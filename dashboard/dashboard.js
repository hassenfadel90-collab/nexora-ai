(()=>{
  const addStyle=(href,attrs={})=>{
    if(document.querySelector(`link[href^="${href}"]`))return;
    const l=document.createElement('link');l.rel='stylesheet';l.href=href;
    Object.entries(attrs).forEach(([k,v])=>l.dataset[k]=v);
    document.head.appendChild(l);
  };
  addStyle('./dashboard-laptop-fix.css?v=titanium-20260909-1');
  addStyle('./suite-88.css?v=88.3',{suite88:'1'});
  addStyle('./suite-88-ultra.css?v=88.3',{suiteUltra:'1'});
  addStyle('./titanium-dashboard.css?v=titanium-20260909-1');

  const load=(src)=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;
    s.onerror=()=>reject(new Error('Failed to load '+src));document.head.appendChild(s);
  });
  load('./dashboard-base.js?v=88.4')
    .then(()=>load('./suite-88.js?v=88.4'))
    .then(()=>load('./suite-88-ultra.js?v=88.4'))
    .then(()=>load('./client-invites.js?v=88.4'))
    .then(()=>load('./auth-ui-fix.js?v=auth-20260909-3'))
    .then(()=>load('./auth-session-fix.js?v=session-20260909-1'))
    .then(()=>load('./ui-actions.js?v=actions-20260909-2'))
    .then(()=>load('../route-guard.js?v=routes-20260909-2'))
    .catch(err=>{
      console.error('NEXORA loader',err);
      const n=document.getElementById('authNote');
      if(n)n.textContent='تعذر تحميل لوحة التحكم. أعد تحميل الصفحة.';
    });
})();