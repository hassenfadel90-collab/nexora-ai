(()=>{
  const isGitHubPages=location.hostname.endsWith('github.io');
  const base=isGitHubPages?'/nexora-ai':'';
  const appPath=(p)=>`${base}${p}`;

  const polishShowcase=()=>{
    const cards=document.querySelectorAll('.showcase-card');
    const copy=[
      {
        p:'نماذج صفحات رئيسية وصفحات هبوط وواجهات مهيأة للموبايل، مصممة لتوضيح الخدمة وزيادة الثقة وتحسين التحويل.'
      },
      {
        p:'معاينة من لوحة NEXORA التشغيلية الحالية: العملاء المحتملون، المشاريع، الموظفون، الفواتير، مساعد الذكاء الاصطناعي، ومركز الموافقات.'
      },
      {
        p:'نبني الحل بمراحل واضحة: جمع البيانات، منطق الأعمال، الأتمتة، التحليل، ثم الموافقة قبل أي تنفيذ خارجي.'
      }
    ];
    cards.forEach((card,i)=>{
      const p=card.querySelector('p');
      if(p&&copy[i]){
        p.dataset.ar=copy[i].p;
        if((document.documentElement.lang||'ar')==='ar') p.textContent=copy[i].p;
      }
    });
  };

  const normalizeRoutes=(root=document)=>{
    root.querySelectorAll?.('a[href]').forEach(a=>{
      const raw=(a.getAttribute('href')||'').trim();
      if(/^\.?\/?(nexora-ai\/)?dashboard\/?$/.test(raw.replace(/^\//,''))||raw==='/dashboard/'||raw==='/nexora-ai/dashboard/'){
        a.setAttribute('href',appPath('/dashboard/'));
      }
      if(/^\.?\/?(nexora-ai\/)?portal\/?$/.test(raw.replace(/^\//,''))||raw==='/portal/'||raw==='/nexora-ai/portal/'){
        a.setAttribute('href',appPath('/portal/'));
      }
      if(raw==='/'||raw==='/nexora-ai/') a.setAttribute('href',appPath('/'));
    });
    root.querySelectorAll?.('img[src="assets/dashboard-showcase.jpg"],img[src$="/assets/dashboard-showcase.jpg"]').forEach(img=>{
      img.src=`${base}/assets/nexora-platform.svg`;
      img.alt='NEXORA operations dashboard preview';
    });
    polishShowcase();
  };

  /* Route guard: an old/cached anchor can no longer navigate to github.io/dashboard/. */
  document.addEventListener('click',e=>{
    const a=e.target.closest?.('a[href]');
    if(!a) return;
    const raw=(a.getAttribute('href')||'').trim();
    const clean=raw.replace(/^https?:\/\/[^/]+/,'');
    if(clean==='/dashboard/'||clean==='/nexora-ai/dashboard/'||clean==='dashboard/'||clean==='./dashboard/'){
      e.preventDefault();location.href=appPath('/dashboard/');return;
    }
    if(clean==='/portal/'||clean==='/nexora-ai/portal/'||clean==='portal/'||clean==='./portal/'){
      e.preventDefault();location.href=appPath('/portal/');
    }
  },true);

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
    s.src=src;s.async=false;
    s.onload=()=>{normalizeRoutes();resolve()};
    s.onerror=()=>reject(new Error('Failed to load '+src));
    document.head.appendChild(s);
  });

  load('./base-script.js?v=routefix-20260909-2')
    .then(()=>load('./premium-home.js?v=routefix-20260909-2'))
    .then(()=>normalizeRoutes())
    .catch(err=>console.error('NEXORA premium loader',err));
})();