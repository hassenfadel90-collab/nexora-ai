(()=>{
  'use strict';
  const rectCheck=(sel,w,failures,required=true)=>{
    const el=document.querySelector(sel);if(!el){if(required)failures.push(`missing ${sel}`);return}
    const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(cs.display==='none'||r.width===0)return;
    if(r.width>w+3)failures.push(`${sel} width ${Math.round(r.width)}>${w}`);
    if(r.left<-3||r.right>w+3)failures.push(`${sel} outside viewport ${Math.round(r.left)}..${Math.round(r.right)}`);
  };
  const publicChecks=(w,failures)=>{
    ['.site-header','.hero','.hero-copy','.dashboard-card','#services','.service-grid','#process','#showcase','#contact','.contact-panel','.lead-form','.site-footer'].forEach(s=>rectCheck(s,w,failures));
    document.querySelectorAll('input,select,textarea,.btn').forEach((el,i)=>{const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(cs.display==='none'||r.width===0)return;if(r.width>w+2||r.right>w+3||r.left<-3)failures.push(`control[${i}] overflow`)});
    const h1=document.querySelector('.hero h1');if(h1&&h1.getBoundingClientRect().width>w+3)failures.push('hero heading overflow');
    if(w<=960){const toggle=document.querySelector('.titanium-mobile-toggle'),nav=document.querySelector('.nav-links');if(!toggle)failures.push('mobile toggle missing');else{toggle.click();const r=nav?.getBoundingClientRect();if(!nav||getComputedStyle(nav).pointerEvents==='none')failures.push('mobile menu did not open');if(r&&(r.left<-3||r.right>w+3||r.width>w+3))failures.push('mobile menu overflow');toggle.click()}}
    const form=document.querySelector('#leadForm');if(!form)failures.push('lead form missing');else for(const name of ['name','business','country','contact','service','message'])if(!form.elements.namedItem(name))failures.push(`lead field missing ${name}`);
  };
  const dashboardChecks=(w,failures)=>{
    ['#authView','.auth-card','#authForm','#authEmail','#authPassword','#forgotPasswordBtn','#signupBtn'].forEach(s=>rectCheck(s,w,failures));
    const auth=document.querySelector('#authView'),app=document.querySelector('#appView');if(auth)auth.style.display='none';if(app){app.classList.remove('hidden');app.style.display='grid'}
    ['#appView','.sidebar','.topbar','#page-overview','.command-center-grid','.executive-stats'].forEach(s=>rectCheck(s,w,failures,false));
    if(w<=1024){const menu=document.querySelector('#mobileMenu');if(!menu)failures.push('dashboard mobile menu missing')}
  };
  const portalChecks=(w,failures)=>{
    ['#authView','.login-card','#authForm','#email','#password','#signupBtn','#forgotClientPasswordBtn'].forEach(s=>rectCheck(s,w,failures));
    const auth=document.querySelector('#authView'),app=document.querySelector('#appView');if(auth)auth.style.display='none';if(app){app.classList.remove('hidden');app.style.display='block'}
    ['#appView','.portal>header','.portal main','.welcome','#projects'].forEach(s=>rectCheck(s,w,failures,false));
  };
  const finish=()=>{
    const w=innerWidth,doc=document.documentElement,body=document.body,failures=[];
    if(doc.scrollWidth>w+2)failures.push(`document overflow ${doc.scrollWidth}>${w}`);
    const path=location.pathname;
    if(path.includes('/dashboard/'))dashboardChecks(w,failures);else if(path.includes('/portal/'))portalChecks(w,failures);else publicChecks(w,failures);
    requestAnimationFrame(()=>{
      if(doc.scrollWidth>w+2&&!failures.some(x=>x.startsWith('document overflow')))failures.push(`document overflow after shell switch ${doc.scrollWidth}>${w}`);
      body.dataset.titaniumQa=failures.length?'fail':'ok';body.dataset.titaniumQaWidth=String(w);body.dataset.titaniumQaFailures=failures.join(' | ').slice(0,1500);
      const marker=document.createElement('div');marker.id='titaniumQaMarker';marker.hidden=true;marker.textContent=failures.length?`FAIL:${failures.join(' | ')}`:`PASS:${path}:${w}`;body.appendChild(marker);
    });
  };
  addEventListener('load',()=>setTimeout(finish,1900),{once:true});
})();