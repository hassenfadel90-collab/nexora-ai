(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;if(!localStorage.getItem('nexora-theme'))root.dataset.theme='light';
  document.title='NEXORA TITANIUM — Client Portal';
  const meta=q('meta[name="theme-color"]');if(meta)meta.content='#F5F5F7';
  qa('.brand').forEach(a=>{const mark=q(':scope > span:first-child',a);if(mark)mark.textContent='N';const b=q(':scope > b',a);if(b)b.innerHTML='<span class="ti-portal-wordmark"><span>NEXORA</span><em>TITANIUM</em></span>';a.setAttribute('aria-label','NEXORA TITANIUM')});
  const eyebrow=q('.login-card .eyebrow');if(eyebrow)eyebrow.textContent='NEXORA TITANIUM · CLIENT PORTAL';
  const title=q('.login-card h1');if(title)title.textContent='بوابة العميل';
  const p=q('.login-card>p');if(p)p.textContent='مساحتك الخاصة لمتابعة المشاريع والملفات والعروض والفواتير ضمن تجربة واحدة واضحة.';
  const welcome=q('.welcome .eyebrow');if(welcome)welcome.textContent='NEXORA TITANIUM · YOUR WORKSPACE';
  const welcomeTitle=q('.welcome h1');if(welcomeTitle)welcomeTitle.textContent='مشاريعك. أوضح.';
  document.body.classList.add('nexora-titanium-portal');
})();