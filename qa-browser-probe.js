(()=>{
  'use strict';
  const finish=()=>{
    const w=innerWidth,doc=document.documentElement,body=document.body;
    const failures=[];
    if(doc.scrollWidth>w+2)failures.push(`document overflow ${doc.scrollWidth}>${w}`);
    const selectors=['.site-header','.hero','.hero-copy','.dashboard-card','#services','.service-grid','#process','#showcase','#contact','.contact-panel','.lead-form','.site-footer'];
    for(const sel of selectors){
      const el=document.querySelector(sel);if(!el){failures.push(`missing ${sel}`);continue}
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);
      if(cs.display==='none')continue;
      if(r.width>w+3)failures.push(`${sel} width ${Math.round(r.width)}>${w}`);
      if(r.left<-3||r.right>w+3)failures.push(`${sel} outside viewport ${Math.round(r.left)}..${Math.round(r.right)}`);
    }
    document.querySelectorAll('input,select,textarea,.btn').forEach((el,i)=>{
      const r=el.getBoundingClientRect(),cs=getComputedStyle(el);if(cs.display==='none'||r.width===0)return;
      if(r.width>w+2||r.right>w+3||r.left<-3)failures.push(`control[${i}] overflow`);
    });
    const h1=document.querySelector('.hero h1');if(h1){const r=h1.getBoundingClientRect();if(r.width>w+3)failures.push('hero heading overflow')}
    if(w<=960){
      const toggle=document.querySelector('.titanium-mobile-toggle'),nav=document.querySelector('.nav-links');
      if(!toggle)failures.push('mobile toggle missing');
      else{
        toggle.click();
        const r=nav?.getBoundingClientRect();
        if(!nav||getComputedStyle(nav).pointerEvents==='none')failures.push('mobile menu did not open');
        if(r&&(r.left<-3||r.right>w+3||r.width>w+3))failures.push('mobile menu overflow');
        toggle.click();
      }
    }
    const form=document.querySelector('#leadForm');
    if(!form)failures.push('lead form missing');
    else for(const name of ['name','business','country','contact','service','message'])if(!form.elements.namedItem(name))failures.push(`lead field missing ${name}`);
    body.dataset.titaniumQa=failures.length?'fail':'ok';
    body.dataset.titaniumQaWidth=String(w);
    body.dataset.titaniumQaFailures=failures.join(' | ').slice(0,1500);
    const marker=document.createElement('div');marker.id='titaniumQaMarker';marker.hidden=true;marker.textContent=failures.length?`FAIL:${failures.join(' | ')}`:`PASS:${w}`;body.appendChild(marker);
  };
  addEventListener('load',()=>setTimeout(finish,1800),{once:true});
})();