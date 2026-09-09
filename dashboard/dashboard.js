(()=>{
  const style=document.createElement('link');style.rel='stylesheet';style.href='./titanium-dashboard.css?v=titanium-20260909-1';document.head.appendChild(style);
  const load=(src)=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Failed to load '+src));document.head.appendChild(s)});
  load('./dashboard-base.js?v=88.3')
    .then(()=>load('./suite-88.js?v=88.3'))
    .then(()=>load('./suite-88-ultra.js?v=88.3'))
    .then(()=>load('./client-invites.js?v=88.3'))
    .then(()=>load('./auth-ui-fix.js?v=auth-20260909-1'))
    .then(()=>load('./ui-actions.js?v=actions-20260909-1'))
    .then(()=>load('./titanium-dashboard.js?v=titanium-20260909-1'))
    .catch(err=>{console.error('NEXORA TITANIUM dashboard loader',err);const n=document.getElementById('authNote');if(n)n.textContent='تعذر تحميل لوحة التحكم. أعد تحميل الصفحة.'});
})();