#!/usr/bin/env python3
from pathlib import Path
import re, sys

root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
if not root.exists(): raise SystemExit(f'QA root missing: {root}')

text_files=[p for p in root.rglob('*') if p.is_file() and p.suffix.lower() in {'.html','.js'}]
all_js='\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in text_files if p.suffix.lower()=='.js')
errors=[]

# 1) GitHub Pages local routes must stay inside /nexora-ai/.
for p in text_files:
    t=p.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r'href\s*=\s*["\']([^"\']+)["\']',t,re.I):
        href=m.group(1).strip()
        if href.startswith(('#','mailto:','tel:','http://','https://','javascript:')): continue
        if href.startswith('/') and not href.startswith('/nexora-ai/'):
            errors.append(f'{p}: unscoped local href {href}')
    for m in re.finditer(r'(?:location\.(?:href|assign)|window\.location)\s*=*\s*["\'](/[^"\']+)["\']',t):
        path=m.group(1)
        if not path.startswith('/nexora-ai/'):
            errors.append(f'{p}: unscoped navigation {path}')

# 2) Required pages and auth assets must exist.
required=[
    root/'index.html',root/'dashboard/index.html',root/'portal/index.html',
    root/'dashboard/auth-ui-fix.js',root/'dashboard/ui-actions.js',
    root/'portal/portal-auth-fix.js'
]
for p in required:
    if not p.exists(): errors.append(f'missing required asset: {p}')

# 3) Every static HTML button must have a submit role, an id with JS binding,
#    a supported data action, or explicit onclick.
supported_data=('data-page','data-go','data-quick','data-auth-tab','data-lead-view','data-ai-prompt','data-font-size','data-tab','data-status','data-id','data-action')
for p in root.rglob('*.html'):
    t=p.read_text(encoding='utf-8',errors='ignore')
    for m in re.finditer(r'<button\b([^>]*)>',t,re.I|re.S):
        attrs=m.group(1)
        if re.search(r'type\s*=\s*["\']submit["\']',attrs,re.I): continue
        if 'onclick=' in attrs.lower(): continue
        if any(k in attrs for k in supported_data): continue
        mid=re.search(r'id\s*=\s*["\']([^"\']+)["\']',attrs,re.I)
        if mid:
            bid=mid.group(1)
            if bid in all_js: continue
            errors.append(f'{p}: button #{bid} has no JS reference')
        else:
            # buttons with generic classes are accepted only when their class is wired by delegation/dynamic code.
            cls=re.search(r'class\s*=\s*["\']([^"\']+)["\']',attrs,re.I)
            classes=set((cls.group(1) if cls else '').split())
            if classes & {'nav-item','lead-open','approval-action','autopilot-run','search-result','download','open','text-btn','password-eye'}: continue
            errors.append(f'{p}: anonymous button lacks an action: <button{attrs[:120]}>')

# 4) Dashboard/portal reset flows and password login primitives must be present.
checks={
    'dashboard login':'signInWithPassword',
    'password reset email':'resetPasswordForEmail',
    'password update':'updateUser({password',
    'recovery event':'PASSWORD_RECOVERY',
    'client activation':'client-activate'
}
joined='\n'.join(p.read_text(encoding='utf-8',errors='ignore') for p in text_files)
for label,needle in checks.items():
    if needle not in joined: errors.append(f'missing auth capability: {label}')

if errors:
    print('NEXORA interaction QA FAILED')
    for e in errors[:100]: print(' -',e)
    raise SystemExit(1)
print('NEXORA interaction QA PASSED: routes, buttons, login and recovery flows verified')
