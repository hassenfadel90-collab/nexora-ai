(()=>{
  const isGitHubPages=location.hostname.endsWith('github.io');
  const base=isGitHubPages?'/nexora-ai':'';
  const appPath=(p)=>`${base}${p}`;

  const normalizeRoutes=(root=document)=>{
    root.querySelectorAll?.('a[href]').forEach(a=>{
      const raw=a.getAttribute('href');
      if(raw==='/dashboard/'||raw==='/nexora-ai/dashboard/') a.setAttribute('href',appPath('/dashboard/'));
      if(raw==='/portal/'||raw==='/nexora-ai/portal/') a.setAttribute('href',appPath('/portal/'));
      if(raw==='/'||raw==='/nexora-ai/') a.setAttribute('href',appPath('/'));
    });
    root.querySelectorAll?.('img[src="assets/dashboard-showcase.jpg"],img[src$="/assets/dashboard-showcase.jpg"]').forEach(img=>{
      img.src=`${base}/assets/nexora-platform.svg`;
      img.alt='NEXORA operations dashboard preview';
    });
  };

  normalizeRoutes();
  const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType===1) normalizeRoutes(n);
  })));
  observer.observe(document.documentElement,{subtree:true,childList:true});

  if(isGitHubPages&&'serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister())).catch(()=>{});
    if('caches' in window) caches.keys().then(keys=>keys.filter(k=>/nexora/i.test(k)).forEach(k=>caches.delete(k))).catch(()=>{});
  }

  const load=(src)=>new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.onload=()=>{normalizeRoutes();resolve()};
    s.onerror=()=>reject(new Error('Failed to load '+src));
    document.head.appendChild(s);
  });

  load('./base-script.js?v=routefix-20260909-1')
    .then(()=>load('./premium-home.js?v=routefix-20260909-1'))
    .then(()=>normalizeRoutes())
    .catch(err=>console.error('NEXORA premium loader',err));
})();