(()=>{
  const q=(s,r=document)=>r.querySelector(s), qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const setCopy=(el,ar,en)=>{el.dataset.ar=ar;el.dataset.en=en;el.textContent=document.documentElement.lang==='en'?en:ar};
  const ready=()=>{
    document.body.classList.add('premium-home','apple-reframe');

    const hero=q('.hero');
    const heroCopy=q('.hero-copy');
    const heroVisual=q('.hero-visual');
    if(hero&&heroCopy){
      hero.classList.add('apple-hero');
      const eyebrow=q('.hero .eyebrow');
      if(eyebrow){eyebrow.innerHTML='<span class="pulse"></span><span data-ar="NEXORA AI — Product Studio" data-en="NEXORA AI — Product Studio">NEXORA AI — Product Studio</span>'}
      const h1=q('.hero h1');
      if(h1) h1.innerHTML='<span data-ar="نبني التقنية" data-en="We build technology">نبني التقنية</span><span class="gradient-text" data-ar="لتشعر أنها بسيطة." data-en="that feels effortless.">لتشعر أنها بسيطة.</span>';
      const lead=q('.hero-lead');
      if(lead) setCopy(lead,'مواقع، أنظمة، ذكاء اصطناعي وأتمتة — مصممة كتجربة واحدة سريعة وواضحة وقابلة للنمو.','Websites, software, AI and automation — designed as one fast, clear and scalable experience.');
      const second=q('.hero-cta .btn-ghost');
      if(second){second.href='#appleStories';setCopy(second,'اكتشف التجربة','Explore the experience')}
      if(!q('.apple-hero-note',heroCopy)){
        const note=document.createElement('p');note.className='apple-hero-note';
        note.innerHTML='<span data-ar="من العراق إلى العالم" data-en="Built in Iraq. Ready for the world.">من العراق إلى العالم</span><i></i><span>Human approval on sensitive actions</span>';
        q('.hero-cta',heroCopy)?.insertAdjacentElement('afterend',note);
      }
    }
    if(heroVisual) heroVisual.classList.add('apple-device-stage');

    const strip=q('.logo-strip');
    if(strip && !q('#appleStories')){
      const stage=document.createElement('section');stage.id='appleStories';stage.className='apple-stories';
      stage.innerHTML=`
        <div class="apple-section-intro reveal">
          <span class="apple-kicker">NEXORA GROWTH OS</span>
          <h2 data-ar="كل ما يحتاجه العمل. في نظام واحد." data-en="Everything your business needs. One system.">كل ما يحتاجه العمل. في نظام واحد.</h2>
          <p data-ar="بدل الأدوات المتفرقة، نربط الموقع والمبيعات والمشاريع والعملاء والذكاء الاصطناعي ضمن تجربة موحدة." data-en="Instead of scattered tools, we connect your website, sales, projects, clients and AI in one unified experience.">بدل الأدوات المتفرقة، نربط الموقع والمبيعات والمشاريع والعملاء والذكاء الاصطناعي ضمن تجربة موحدة.</p>
        </div>
        <article class="apple-feature apple-feature-light reveal">
          <div class="apple-feature-copy">
            <span class="apple-kicker">DIGITAL EXPERIENCE</span>
            <h3 data-ar="واجهة تحكي قيمة مشروعك قبل أي كلمة." data-en="An interface that communicates value before a word is spoken.">واجهة تحكي قيمة مشروعك قبل أي كلمة.</h3>
            <p data-ar="تصميم هادئ، محتوى مركز، انتقالات ناعمة، وتجربة Mobile‑first تعطي منتجك المساحة التي يستحقها." data-en="Calm design, focused content, fluid motion and a mobile-first experience that gives your product room to shine.">تصميم هادئ، محتوى مركز، انتقالات ناعمة، وتجربة Mobile‑first تعطي منتجك المساحة التي يستحقها.</p>
            <div class="apple-inline-links"><a href="#contact" data-ar="ابدأ مشروعاً" data-en="Start a project">ابدأ مشروعاً</a><a href="#showcase" data-ar="شاهد الأعمال" data-en="See showcase">شاهد الأعمال</a></div>
          </div>
          <div class="apple-web-product" aria-hidden="true">
            <div class="apple-browser-shell">
              <div class="apple-browser-bar"><i></i><i></i><i></i><span>nexora.ai</span></div>
              <div class="apple-browser-page"><small>PRODUCT EXPERIENCE</small><b>Less noise.<br>More impact.</b><em></em><div class="apple-browser-grid"><span></span><span></span><span></span></div></div>
            </div>
          </div>
        </article>
        <article class="apple-feature apple-feature-dark apple-feature-reverse reveal">
          <div class="apple-feature-copy">
            <span class="apple-kicker">BUSINESS OPERATING SYSTEM</span>
            <h3 data-ar="من أول Lead إلى آخر فاتورة." data-en="From the first lead to the final invoice.">من أول Lead إلى آخر فاتورة.</h3>
            <p data-ar="CRM، مشاريع، مهام، موافقات، فواتير، ملفات، دعم، Timesheets وصحة المشاريع — مترابطة بدون نسخ ولصق." data-en="CRM, projects, tasks, approvals, invoices, files, support, timesheets and project health — connected without copy and paste.">CRM، مشاريع، مهام، موافقات، فواتير، ملفات، دعم، Timesheets وصحة المشاريع — مترابطة بدون نسخ ولصق.</p>
            <div class="apple-pills"><span>CRM</span><span>Projects</span><span>Finance</span><span>Support</span></div>
          </div>
          <div class="apple-os" aria-hidden="true">
            <aside><strong>N</strong><i></i><i></i><i></i><i></i><i></i></aside>
            <main><header><span>Command Center</span><b>● LIVE</b></header><div class="apple-os-metrics"><article><small>PIPELINE</small><strong>$48K</strong><em>+18%</em></article><article><small>ACTIVE</small><strong>12</strong><em>projects</em></article><article><small>HEALTH</small><strong>94</strong><em>/100</em></article></div><div class="apple-os-chart"><i></i></div><div class="apple-os-list"><span><b>Website redesign</b><em>On track</em></span><span><b>AI support agent</b><em>Review</em></span><span><b>CRM automation</b><em>Active</em></span></div></main>
          </div>
        </article>
        <article class="apple-feature apple-feature-ai reveal">
          <div class="apple-feature-copy centered">
            <span class="apple-kicker">CONTROLLED AI</span>
            <h3 data-ar="ذكاء اصطناعي سريع. قرارات حساسة بإذن منك." data-en="Fast AI. Sensitive decisions stay yours.">ذكاء اصطناعي سريع. قرارات حساسة بإذن منك.</h3>
            <p data-ar="النظام يحلل ويجهز ويقترح تلقائياً، بينما التواصل الخارجي والصرف والنشر الحساس يبقى خلف بوابة موافقة بشرية." data-en="The system analyzes, prepares and recommends automatically, while external communication, spending and sensitive publishing stay behind human approval.">النظام يحلل ويجهز ويقترح تلقائياً، بينما التواصل الخارجي والصرف والنشر الحساس يبقى خلف بوابة موافقة بشرية.</p>
          </div>
          <div class="apple-ai-scene" aria-hidden="true"><div class="apple-ai-halo"></div><div class="apple-ai-core"><span>N</span></div><div class="apple-ai-orbit one"></div><div class="apple-ai-orbit two"></div><div class="apple-ai-label l1">Analyze</div><div class="apple-ai-label l2">Prepare</div><div class="apple-ai-label l3">Approve</div></div>
        </article>
        <div class="apple-bento reveal">
          <article class="apple-bento-card wide"><span class="apple-kicker">88 CAPABILITIES</span><strong data-ar="من Growth إلى Delivery إلى Finance." data-en="From growth to delivery to finance.">من Growth إلى Delivery إلى Finance.</strong><p data-ar="المزايا موزعة عبر الموقع، لوحة الإدارة وبوابة العملاء مع Feature Registry مركزي." data-en="Capabilities span the public site, admin workspace and client portal with a central feature registry.">المزايا موزعة عبر الموقع، لوحة الإدارة وبوابة العملاء مع Feature Registry مركزي.</p><div class="apple-88"><b>88</b><span>Growth OS</span></div></article>
          <article class="apple-bento-card"><span class="apple-kicker">CLIENT PORTAL</span><strong data-ar="العميل يرى ما يهمه فقط." data-en="Clients see only what matters.">العميل يرى ما يهمه فقط.</strong><div class="apple-mini-window"><i></i><i></i><i></i></div><a href="/portal/" data-ar="دخول العملاء ↗" data-en="Client login ↗">دخول العملاء ↗</a></article>
          <article class="apple-bento-card"><span class="apple-kicker">TEAM WORKSPACE</span><strong data-ar="قرارات أسرع. معلومات أوضح." data-en="Faster decisions. Clearer context.">قرارات أسرع. معلومات أوضح.</strong><div class="apple-rings"><i></i><i></i><i></i></div><a href="/dashboard/" data-ar="لوحة الإدارة ↗" data-en="Staff dashboard ↗">لوحة الإدارة ↗</a></article>
        </div>`;
      strip.insertAdjacentElement('afterend',stage);
    }

    qa('.premium-story').forEach(el=>el.remove());
    if(!q('.apple-final-cta')){
      const contact=q('#contact');
      if(contact){const c=document.createElement('section');c.className='apple-final-cta reveal';c.innerHTML='<span class="apple-kicker">START SOMETHING BETTER</span><h2 data-ar="فكرتك. لكن بتجربة أقوى." data-en="Your idea. With a stronger experience.">فكرتك. لكن بتجربة أقوى.</h2><p data-ar="احچيلنا شنو تريد تبني، ونحولها إلى خطة واضحة قابلة للتنفيذ." data-en="Tell us what you want to build and we’ll turn it into a clear, executable plan.">احچيلنا شنو تريد تبني، ونحولها إلى خطة واضحة قابلة للتنفيذ.</p><a class="btn btn-primary btn-lg" href="#contact" data-ar="ابدأ مشروعك" data-en="Start your project">ابدأ مشروعك</a>';contact.parentNode.insertBefore(c,contact)}
    }

    if(!q('.apple-scroll-progress')){const p=document.createElement('div');p.className='apple-scroll-progress';p.innerHTML='<i></i>';document.body.appendChild(p)}
    const progress=q('.apple-scroll-progress i');
    const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;const r=max>0?scrollY/max:0;if(progress)progress.style.transform=`scaleX(${r})`;qa('.apple-feature').forEach(card=>{const rect=card.getBoundingClientRect(),mid=innerHeight*.55,delta=Math.max(-1,Math.min(1,(rect.top-mid)/innerHeight));card.style.setProperty('--shift',`${delta*14}px`)})};
    addEventListener('scroll',onScroll,{passive:true});onScroll();

    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});qa('.apple-stories .reveal,.apple-final-cta').forEach(x=>io.observe(x))}
    else qa('.apple-stories .reveal,.apple-final-cta').forEach(x=>x.classList.add('in'));

    if(typeof applyLang==='function')try{applyLang(lang)}catch{}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();