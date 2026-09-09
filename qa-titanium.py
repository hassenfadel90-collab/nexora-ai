#!/usr/bin/env python3
from pathlib import Path
import re,sys

root=Path(sys.argv[1] if len(sys.argv)>1 else '_site')
errors=[]
req=[
 root/'titanium.css',root/'titanium.js',
 root/'dashboard/titanium-dashboard.css',root/'dashboard/titanium-dashboard.js',
 root/'portal/titanium-portal.css',root/'portal/titanium-portal.js'
]
for p in req:
    if not p.exists(): errors.append(f'missing Titanium release asset: {p}')

def read(p): return p.read_text(encoding='utf-8',errors='ignore') if p.exists() else ''
styles=read(root/'styles.css'); script=read(root/'script.js'); ti=read(root/'titanium.css'); tij=read(root/'titanium.js')
dash=read(root/'dashboard/dashboard.js'); portal=read(root/'portal/portal-auth-fix.js'); index=read(root/'index.html')

# Design system must load after legacy visual layers without deleting them.
if 'titanium.css' not in styles: errors.append('styles.css does not load titanium.css')
if 'titanium.js' not in script: errors.append('script.js does not load titanium.js')
if script.find('route-guard.js')>script.find('titanium.js')>=0: errors.append('titanium.js must load after route-guard.js')
if 'titanium-dashboard.css' not in dash or 'titanium-dashboard.js' not in dash: errors.append('dashboard Titanium layer is not loaded')
if 'titanium-portal.css' not in portal or 'titanium-portal.js' not in portal: errors.append('portal Titanium layer is not loaded')

# Required brand and core tokens.
for needle in ['#F5F5F7','#FFFFFF','#0A0A0A','#6E6E73','#0071E3','#0077ED']:
    if needle.lower() not in ti.lower(): errors.append(f'missing Titanium color token {needle}')
for needle in ['NEXORA TITANIUM','Your business.','Smarter.','One system. Everything connected.','AI that actually works.','Built around your business.','Ready to build what']:
    if needle not in tij: errors.append(f'missing required Titanium copy: {needle}')

# Contact form contract must remain unchanged.
for needle in ['id="leadForm"','name="company_website"','name="name"','name="business"','name="country"','name="contact"','name="service"','name="message"','id="formNote"']:
    if needle not in index: errors.append(f'contact form contract changed or missing: {needle}')

# Existing routes and access surfaces must remain present.
for needle in ['/dashboard/','/portal/','#services','#process','#solutions','#showcase','#contact']:
    if needle not in index and needle not in script: errors.append(f'missing existing route/anchor: {needle}')

# Mobile/responsive and reduced-motion requirements.
for needle in ['@media(max-width:430px)','@media(max-width:375px)','@media(max-width:320px)','@media(max-width:960px)','@media(max-width:1180px)','@media(min-width:1600px)','prefers-reduced-motion']:
    if needle not in ti.replace(' ',''): errors.append(f'missing responsive/performance rule: {needle}')
if 'overflow-x:clip' not in ti and 'overflow-x:hidden' not in ti: errors.append('Titanium CSS lacks horizontal overflow guard')
if 'clamp(' not in ti: errors.append('Titanium CSS does not use fluid clamp typography/layout')

# Avoid reintroducing heavy visual directions explicitly rejected by the design brief.
for pattern in [r'particle',r'animation:\s*[^;]*infinite']:
    if re.search(pattern,ti,re.I): errors.append(f'heavy/constant visual effect found: {pattern}')

# Protected functionality needles must still exist in deployed scripts.
joined='\n'.join(read(p) for p in root.rglob('*.js'))
for label,needle in {
 'Supabase public lead intake':'public-lead-intake',
 'dashboard login':'signInWithPassword',
 'password reset':'resetPasswordForEmail',
 'password update':'updateUser({password',
 'client portal auth':'client_profiles',
 'Suite 88':'suiteAction',
 'project creation':'newProjectBtn',
 'file upload':'uploadFileBtn'
}.items():
    if needle not in joined: errors.append(f'protected functionality missing: {label}')

if errors:
    print('NEXORA TITANIUM QA FAILED')
    for e in errors: print(' -',e)
    raise SystemExit(1)
print('NEXORA TITANIUM QA PASSED: design tokens, responsive coverage, routes, contact contract and protected functionality verified')
