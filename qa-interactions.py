#!/usr/bin/env python3
from pathlib import Path
from urllib.parse import urlsplit
import re, sys

root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
if not root.exists(): raise SystemExit(f'QA root missing: {root}')

text_files=[p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.js'}]
html_files=list(root.rglob('*.html'))
js_files=[p for p in text_files if p.suffix.lower()=='.js']
all_js='\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in js_files)
joined='\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in text_files)
errors=[]
BASE='/nexora-ai/'

# 1) GitHub Pages routes must stay inside the repository scope.
for p in text_files:
    t=p.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r'href\s*=\s*["\']([^"\']+)["\']',t,re.I):
        href=m.group(1).strip()
        if href.startswith(('#','mailto:','tel:','http://','https://','javascript:','../','./')): continue
        if href.startswith('/') and not href.startswith(BASE):
            errors.append(f'{p}: unscoped local href {href}')
    for m in re.finditer(r'(?:location\.(?:href|assign)|window\.location)\s*=*\s*["\'](/[^"\']+)["\']',t):
        path=m.group(1)
        if not path.startswith(BASE): errors.append(f'{p}: unscoped navigation {path}')

# 2) Required pages and critical auth/action assets.
required=[
    root/'index.html',root/'dashboard/index.html',root/'portal/index.html',
    root/'security/index.html',root/'status/index.html',root/'insights/index.html',
    root/'dashboard/auth-ui-fix.js',root/'dashboard/ui-actions.js',
    root/'portal/portal-auth-fix.js',root/'route-guard.js'
]
for p in required:
    if not p.exists(): errors.append(f'missing required asset: {p}')

# 3) Every local static asset referenced by HTML must exist in the deployment artifact.
def local_target(page, raw):
    raw=raw.strip()
    if not raw or raw.startswith(('#','data:','mailto:','tel:','javascript:','http://','https://','//')): return None
    path=urlsplit(raw).path
    if not path: return None
    if path.startswith(BASE):
        rel=path[len(BASE):]
        return root/rel
    if path.startswith('/'):
        return None
    return (page.parent/path).resolve()

root_abs=root.resolve()
for p in html_files:
    t=p.read_text(encoding='utf-8',errors='ignore')
    for attr in ('href','src'):
        for m in re.finditer(rf'{attr}\s*=\s*["\']([^"\']+)["\']',t,re.I):
            raw=m.group(1)
            target=local_target(p,raw)
            if target is None: continue
            try: target.relative_to(root_abs)
            except ValueError: continue
            # directory URLs resolve to index.html.
            if raw.split('?',1)[0].split('#',1)[0].endswith('/'):
                target=target/'index.html'
            if not target.exists(): errors.append(f'{p}: missing local {attr} target {raw}')

# 4) Static HTML buttons must be wired or have a native/form role.
supported_data=('data-page','data-go','data-quick','data-auth-tab','data-lead-view','data-ai-prompt','data-font-size','data-tab','data-status','data-id','data-action','data-suite-action','data-access')
for p in html_files:
    t=p.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r'<button\b([^>]*)>',t,re.I|re.S):
        attrs=m.group(1)
        if re.search(r'type\s*=\s*["\']submit["\']',attrs,re.I): continue
        if 'onclick=' in attrs.lower(): continue
        if any(k in attrs for k in supported_data): continue
        if re.search(r'class\s*=\s*["\'][^"\']*modal-close[^"\']*["\']',attrs,re.I) and re.search(r'value\s*=\s*["\']cancel["\']',attrs,re.I): continue
        mid=re.search(r'id\s*=\s*["\']([^"\']+)["\']',attrs,re.I)
        if mid:
            bid=mid.group(1)
            if bid in all_js: continue
            errors.append(f'{p}: button #{bid} has no JS reference')
        else:
            cls=re.search(r'class\s*=\s*["\']([^"\']+)["\']',attrs,re.I)
            classes=set((cls.group(1) if cls else '').split())
            if classes & {'nav-item','lead-open','approval-action','autopilot-run','search-result','download','open','text-btn','password-eye','suite-action'}: continue
            errors.append(f'{p}: anonymous button lacks an action: <button{attrs[:120]}>')

# 5) Every navigation data-page/data-go points to a page rendered in HTML or JS.
page_targets=set(re.findall(r'id=["\']page-([a-zA-Z0-9_-]+)["\']',joined))
nav_targets=set(re.findall(r'data-(?:page|go)=["\']([a-zA-Z0-9_-]+)["\']',joined))
for x in sorted(nav_targets-page_targets):
    errors.append(f'navigation target has no page: {x}')

# 6) Root-page #anchors must point to a real element ID on that HTML page.
for p in html_files:
    t=p.read_text(encoding='utf-8',errors='ignore')
    ids=set(re.findall(r'\bid=["\']([^"\']+)["\']',t))
    for href in re.findall(r'href=["\']#([^"\']+)["\']',t):
        if href and href not in ids: errors.append(f'{p}: anchor #{href} has no matching element')

# 7) Every dynamic Suite 88 action/accessibility value must have an explicit implementation branch.
suite_values=set(re.findall(r'data-suite-action=["\']([a-zA-Z0-9_-]+)["\']',joined))
suite_handlers=set(re.findall(r"a===['\"]([a-zA-Z0-9_-]+)['\"]",joined))
for x in sorted(suite_values-suite_handlers): errors.append(f'Suite 88 action has no handler: {x}')
access_values=set(re.findall(r'data-access=["\']([a-zA-Z0-9_-]+)["\']',joined))
for x in sorted(access_values):
    if not re.search(rf"a===['\"]{re.escape(x)}['\"]",joined): errors.append(f'accessibility action has no handler: {x}')

# 8) Critical auth and create functionality must be present.
checks={
    'dashboard login':'signInWithPassword',
    'password reset email':'resetPasswordForEmail',
    'password update':'updateUser({password',
    'recovery event':'PASSWORD_RECOVERY',
    'client activation':'client-activate',
    'prospect create':'newProspectBtn',
    'Google search':'googleSearchBtn',
    'Maps search':'mapsSearchBtn',
    'approval create':'newApprovalBtn',
    'service create':'newServiceBtn',
    'file upload':'uploadFileBtn',
    'project create':'newProjectBtn',
    'task create':'newTaskBtn',
    'proposal create':'newProposalBtn',
    'invoice create':'newInvoiceBtn',
    'employee create':'newEmployeeBtn'
}
for label,needle in checks.items():
    if needle not in joined: errors.append(f'missing capability: {label}')

if errors:
    print('NEXORA DEEP INTERACTION QA FAILED')
    for e in errors[:150]: print(' -',e)
    raise SystemExit(1)
print(f'NEXORA DEEP INTERACTION QA PASSED: {len(html_files)} pages, {len(nav_targets)} nav targets, {len(suite_values)} suite actions, {len(access_values)} accessibility actions verified')
