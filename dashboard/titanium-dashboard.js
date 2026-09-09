(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;
  if(!localStorage.getItem('nexora-theme'))root.dataset.theme='light';
  document.title='NEXORA TITANIUM — Operations OS';
  const theme=q('meta[name="theme-color"]');if(theme)theme.content='#F5F5F7';
  qa('.brand').forEach(a=>{
    const mark=q('.brand-mark',a);if(mark)mark.textContent='N';
    const spans=qa(':scope > span',a);
    const target=spans.find(s=>!s.classList.contains('brand-mark'));
    if(target)target.innerHTML='<span class="ti-dashboard-wordmark"><span>NEXORA</span><em>TITANIUM</em></span>';
    else if(!q('.ti-dashboard-wordmark',a)){const s=document.createElement('span');s.className='ti-dashboard-wordmark';s.innerHTML='<span>NEXORA</span><em>TITANIUM</em>';a.appendChild(s)}
    a.setAttribute('aria-label','NEXORA TITANIUM');
  });
  const authEyebrow=q('.auth-copy .eyebrow');if(authEyebrow)authEyebrow.textContent='NEXORA TITANIUM · SECURE OPERATIONS';
  const authTitle=q('.auth-copy h1');if(authTitle)authTitle.textContent='لوحة إدارة NEXORA TITANIUM';
  const workspace=q('.side-workspace strong');if(workspace)workspace.textContent='Titanium Operations';
  const sideSmall=q('.side-workspace small');if(sideSmall)sideSmall.textContent='Connected Workspace';
  const topMeta=q('.top-title .muted');if(topMeta)topMeta.textContent='NEXORA TITANIUM / OPERATIONS';
  const cmd=q('.command-bar b');if(cmd)cmd.textContent='ابحث أو اسأل NEXORA TITANIUM';
  document.body.classList.add('nexora-titanium-dashboard');
})();