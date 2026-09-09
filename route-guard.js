(()=>{
  const isPages=location.hostname.endsWith('github.io');
  const base=isPages?'/nexora-ai':'';
  const scoped=(raw)=>{
    if(!isPages||!raw||!raw.startsWith('/')||raw.startsWith('//'))return raw;
    if(raw===base||raw.startsWith(base+'/'))return raw;
    return `${base}${raw}`.replace(/\/+/g,'/');
  };
  const urls={home:`${location.origin}${base}/`,dashboard:`${location.origin}${base}/dashboard/`,portal:`${location.origin}${base}/portal/`};
  const fixHref=(a)=>{
    const raw=a.getAttribute('href');
    if(!raw||raw.startsWith('#')||/^(mailto:|tel:|javascript:)/i.test(raw))return;
    if(raw.startsWith('/')&&isPages)a.href=`${location.origin}${scoped(raw)}`;
  };
  const fixAll=()=>document.querySelectorAll('a[href]').forEach(fixHref);
  fixAll();
  const mo=new MutationObserver(fixAll);
  mo.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');if(!a)return;
    const raw=a.getAttribute('href');
    if(isPages&&raw&&raw.startsWith('/')&&!raw.startsWith('//')){e.preventDefault();location.assign(`${location.origin}${scoped(raw)}`)}
  },true);
  window.NEXORA_ROUTES=urls;
})();