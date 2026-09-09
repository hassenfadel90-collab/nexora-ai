(()=>{
  const isPages=location.hostname.endsWith('github.io');
  const base=isPages?'/nexora-ai':'';
  const urls={
    home:`${location.origin}${base}/`,
    dashboard:`${location.origin}${base}/dashboard/`,
    portal:`${location.origin}${base}/portal/`
  };
  const fixHref=(a)=>{
    const raw=a.getAttribute('href');
    if(!raw)return;
    if(raw==='/dashboard/'||raw==='/dashboard')a.href=urls.dashboard;
    else if(raw==='/portal/'||raw==='/portal')a.href=urls.portal;
    else if(raw==='/')a.href=urls.home;
  };
  const fixAll=()=>document.querySelectorAll('a[href]').forEach(fixHref);
  fixAll();
  const mo=new MutationObserver(fixAll);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a)return;
    const raw=a.getAttribute('href');
    if(raw==='/dashboard/'||raw==='/dashboard'){e.preventDefault();location.assign(urls.dashboard)}
    else if(raw==='/portal/'||raw==='/portal'){e.preventDefault();location.assign(urls.portal)}
    else if(raw==='/'&&isPages){e.preventDefault();location.assign(urls.home)}
  },true);
  window.NEXORA_ROUTES=urls;
})();