(()=>{
  'use strict';
  const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;
  const copy=(el,ar,en)=>{if(!el)return;el.dataset.ar=ar;el.dataset.en=en;el.textContent=(root.lang==='en'?en:ar)};
  const htmlCopy=(el,ar,en)=>{if(!el)return;el.dataset.arHtml=ar;el.dataset.enHtml=en;el.innerHTML=(root.lang==='en'?en:ar)};
  const rerenderLang=()=>{try{if(typeof applyLang==='function')applyLang(typeof lang!=='undefined'?lang:(root.lang||'ar'))}catch{}};

  function setBrand(){
    document.title='NEXORA TITANIUM — AI Systems, Software & Automation';
    const desc=q('meta[name="description"]');if(desc)desc.content='NEXORA TITANIUM builds premium AI systems, software, automation and connected digital platforms for modern businesses.';
    const theme=q('meta[name="theme-color"]');if(theme)theme.content='#F5F5F7';
    qa('.site-header .brand,.site-footer .brand-text').forEach((el,i)=>{
      if(el.matches('.brand')){
        const mark=q('.brand-mark',el);
        const text=q('.brand-text',el);
        if(text)text.innerHTML='<span class="titanium-wordmark"><span class="ti-name">NEXORA</span><span class="ti-edition">TITANIUM</span></span>';
        if(mark)mark.textContent='N';
        el.setAttribute('aria-label','NEXORA TITANIUM');
      }else el.innerHTML='<span class="titanium-wordmark"><span class="ti-name">NEXORA</span><span class="ti-edition">TITANIUM</span></span>';
    });
    const footer=q('.site-footer');
    if(footer){const p=q('p',footer);if(p)p.textContent='AI Systems • Software • Automation';const copyright=qa('.footer-right span',footer)[0];if(copyright)copyright.textContent='© 2026 NEXORA TITANIUM';}
  }

  function redesignNav(){
    const header=q('.site-header'),nav=q('.nav-links',header);if(!header||!nav)return;
    const links=qa('a',nav);
    const labels=[
      ['الخدمات','Services'],['كيف نعمل','Process'],['الحلول','Solutions'],['الأعمال','Work'],['ابدأ مشروعك','Start a Project']
    ];
    links.slice(0,5).forEach((a,i)=>copy(a,labels[i][0],labels[i][1]));
    if(!q('.titanium-mobile-toggle',header)){
      const b=document.createElement('button');
      b.className='titanium-mobile-toggle';b.type='button';b.setAttribute('aria-label','Open navigation');b.setAttribute('aria-expanded','false');b.innerHTML='<span></span>';
      header.appendChild(b);
      const close=()=>{header.classList.remove('mobile-open');b.setAttribute('aria-expanded','false');document.body.style.overflow=''};
      b.addEventListener('click',e=>{e.stopPropagation();const open=header.classList.toggle('mobile-open');b.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''});
      nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
      document.addEventListener('click',e=>{if(header.classList.contains('mobile-open')&&!header.contains(e.target))close()});
      addEventListener('resize',()=>{if(innerWidth>960)close()},{passive:true});
    }
    const cta=q('.header-actions .btn-primary');if(cta)copy(cta,'ابدأ مشروعك','Start a Project');
  }

  function redesignHero(){
    const hero=q('.hero');if(!hero)return;
    const eyebrow=q('.hero .eyebrow');
    if(eyebrow)eyebrow.innerHTML='<span class="pulse"></span><span data-ar="NEXORA TITANIUM · AI TECHNOLOGY" data-en="NEXORA TITANIUM · AI TECHNOLOGY">NEXORA TITANIUM · AI TECHNOLOGY</span>';
    const h1=q('.hero h1');
    if(h1)h1.innerHTML='<span data-ar="عملك." data-en="Your business.">عملك.</span><span data-ar="أذكى." data-en="Smarter.">أذكى.</span>';
    copy(q('.hero-lead'),'أنظمة ذكاء اصطناعي، برمجيات وأتمتة مصممة للأعمال الحديثة.','AI systems, software and automation built for modern businesses.');
    const primary=q('.hero-cta .btn-primary');if(primary){primary.href='#contact';primary.innerHTML='<span data-ar="ابدأ مشروعك" data-en="Start a Project">ابدأ مشروعك</span><span class="arrow">↗</span>';}
    const secondary=q('.hero-cta .btn-ghost');if(secondary){secondary.href='#appleStories';copy(secondary,'اكتشف NEXORA','Explore NEXORA');}
    const note=q('.apple-hero-note');if(note)note.innerHTML='<span data-ar="نظام واحد للأعمال الحديثة" data-en="One system for modern business">نظام واحد للأعمال الحديثة</span><i></i><span data-ar="موافقة بشرية للإجراءات الحساسة" data-en="Human approval for sensitive actions">موافقة بشرية للإجراءات الحساسة</span>';
    const card=q('.dashboard-card');if(card){card.setAttribute('aria-label','NEXORA TITANIUM product interface preview');const chip=q('.dash-chip',card);if(chip)chip.textContent='PRODUCT PREVIEW · DEMO DATA';}
    const metrics=qa('.metric-card',card);
    if(metrics[0]){copy(q('.metric-label',metrics[0]),'ذكاء العملاء','Lead Intelligence');q('strong',metrics[0]).textContent='AI';const small=q('small',metrics[0]);if(small)small.textContent='Qualified context';}
    if(metrics[1]){copy(q('.metric-label',metrics[1]),'نظام العمل','Business OS');q('strong',metrics[1]).textContent='CRM';const small=q('small',metrics[1]);if(small)small.textContent='Connected';}
    if(metrics[2]){copy(q('.metric-label',metrics[2]),'الأتمتة','Automation');q('strong',metrics[2]).textContent='Flow';const small=q('small',metrics[2]);if(small)small.textContent='Approval-gated';}
    const phead=q('.pipeline-head span',card);copy(phead,'تدفق العمل المتصل','Connected Workflow');
    const rows=qa('.pipeline-row',card),rowNames=['Website','Lead Intake','AI Agent','Operations'];rows.forEach((r,i)=>{const s=q('span',r);if(s)s.textContent=rowNames[i]||s.textContent;const em=q('em',r);if(em)em.textContent=['01','02','03','04'][i]||''});
    copy(q('.ai-note p',card),'واجهة توضيحية لربط الموقع والعملاء والذكاء الاصطناعي والأتمتة داخل نظام واحد.','Illustrative interface showing website, leads, AI and automation connected in one system.');
  }

  function productNarrative(){
    const stories=q('#appleStories');if(!stories)return;
    const intro=q('.apple-section-intro',stories);
    if(intro){copy(q('.apple-kicker',intro),'NEXORA CONNECTED SYSTEM','NEXORA CONNECTED SYSTEM');copy(q('h2',intro),'نظام واحد. كل شيء متصل.','One system. Everything connected.');copy(q('p',intro),'من الموقع إلى العملاء، ومن الذكاء الاصطناعي إلى الأتمتة والتحليلات — تدفق واضح ومترابط بدون أدوات مبعثرة.','From your website to leads, AI, automation and analytics — one clear connected flow without scattered tools.');
      if(!q('.titanium-flow',intro)){
        const flow=document.createElement('div');flow.className='titanium-flow';flow.innerHTML=`<div class="titanium-flow-head"><strong data-ar="مسار NEXORA" data-en="NEXORA flow">مسار NEXORA</strong><span data-ar="واجهة مبسطة لتدفق النظام" data-en="A simplified view of the system flow">واجهة مبسطة لتدفق النظام</span></div><div class="titanium-flow-track">
        <div class="titanium-flow-node"><div class="titanium-flow-icon">01</div><b>Website</b><small data-ar="نقطة الدخول" data-en="Entry point">نقطة الدخول</small></div>
        <div class="titanium-flow-node"><div class="titanium-flow-icon">02</div><b>Leads</b><small data-ar="بيانات منظمة" data-en="Structured data">بيانات منظمة</small></div>
        <div class="titanium-flow-node is-ai"><div class="titanium-flow-icon">AI</div><b>AI Agent</b><small data-ar="تحليل وتأهيل" data-en="Analyze & qualify">تحليل وتأهيل</small></div>
        <div class="titanium-flow-node"><div class="titanium-flow-icon">04</div><b>Automation</b><small data-ar="Workflow" data-en="Workflow">Workflow</small></div>
        <div class="titanium-flow-node"><div class="titanium-flow-icon">05</div><b>CRM</b><small data-ar="تشغيل ومتابعة" data-en="Operate & follow up">تشغيل ومتابعة</small></div>
        <div class="titanium-flow-node"><div class="titanium-flow-icon">06</div><b>Analytics</b><small data-ar="رؤية وقرارات" data-en="Insight & decisions">رؤية وقرارات</small></div>
        </div>`;intro.appendChild(flow);
      }
    }
    const features=qa('.apple-feature',stories);
    if(features[0]){copy(q('.apple-kicker',features[0]),'DIGITAL PLATFORM','DIGITAL PLATFORM');copy(q('h3',features[0]),'من الواجهة إلى منصة أعمال حقيقية.','From interface to a real business platform.');copy(q('p',features[0]),'موقع سريع وواضح يتحول إلى نقطة دخول لمنظومة العملاء والبيانات والخدمات، وليس مجرد صفحات منفصلة.','A fast, clear website that becomes the entry point to your customer, data and service system — not just a set of pages.');}
    if(features[1]){copy(q('.apple-kicker',features[1]),'OPERATIONS','OPERATIONS');copy(q('h3',features[1]),'كل العمل في مساحة تشغيل واحدة.','Your operations. One connected workspace.');copy(q('p',features[1]),'CRM، مشاريع، مهام، موافقات، فواتير، ملفات ودعم متصلة بواجهة واحدة مع صلاحيات واضحة.','CRM, projects, tasks, approvals, invoices, files and support connected in one workspace with clear access controls.');}
    const ai=q('.apple-feature-ai',stories);
    if(ai){copy(q('.apple-kicker',ai),'NEXORA AI','NEXORA AI');copy(q('h3',ai),'ذكاء اصطناعي يعمل فعلاً.','AI that actually works.');copy(q('.apple-feature-copy p',ai),'وكلاء ومساعدون للبحث والتحليل وتأهيل العملاء والدعم والأتمتة، مع إبقاء القرارات الحساسة خلف موافقة بشرية.','Agents and assistants for research, analysis, lead qualification, support and automation, while sensitive decisions stay behind human approval.');
      const old=q('.titanium-ai-capabilities',ai);if(!old){const caps=document.createElement('div');caps.className='titanium-ai-capabilities';caps.innerHTML=`<article><span>AI</span><h4 data-ar="Agents & Assistants" data-en="Agents & Assistants">Agents & Assistants</h4><p data-ar="مساعدون مخصصون للمهام، المعرفة، البحث والدعم." data-en="Purpose-built assistants for tasks, knowledge, research and support.">مساعدون مخصصون للمهام، المعرفة، البحث والدعم.</p></article><article><span>↗</span><h4 data-ar="Lead Intelligence" data-en="Lead Intelligence">Lead Intelligence</h4><p data-ar="تأهيل وتحليل وتنظيم الفرص قبل المتابعة البشرية." data-en="Qualification, analysis and structured context before human follow-up.">تأهيل وتحليل وتنظيم الفرص قبل المتابعة البشرية.</p></article><article><span>∞</span><h4 data-ar="Business Automation" data-en="Business Automation">Business Automation</h4><p data-ar="ربط الأنظمة والبيانات والمهام المتكررة ضمن Workflow واضح." data-en="Connect systems, data and repetitive work into a clear workflow.">ربط الأنظمة والبيانات والمهام المتكررة ضمن Workflow واضح.</p></article>`;q('.apple-feature-copy',ai)?.insertAdjacentElement('afterend',caps);}
    }
  }

  function redesignServices(){
    const section=q('#services');if(!section)return;
    copy(q('.section-heading .eyebrow',section),'مصمم حول عملك','BUILT AROUND YOU');
    copy(q('.section-heading h2',section),'مبني حول عملك.','Built around your business.');
    copy(q('.section-heading p',section),'نحافظ على الخدمات الحالية ونقدمها كمنظومة متكاملة: تجربة رقمية، أنظمة أعمال، ذكاء اصطناعي وأتمتة.','Your existing capabilities, organized as one connected offering: digital experiences, business systems, AI and automation.');
  }

  function installMetrics(){
    const process=q('#process');if(!process||q('.titanium-metrics'))return;
    const s=document.createElement('section');s.className='titanium-metrics reveal';s.innerHTML=`<div class="titanium-metrics-head"><span>NEXORA PRINCIPLES</span><h2 data-ar="كل ما تحتاجه. بدون ضجيج." data-en="Everything you need. Nothing you don't.">كل ما تحتاجه. بدون ضجيج.</h2></div><div class="titanium-metrics-grid"><div class="titanium-metric"><strong>24/7</strong><span data-ar="أتمتة قابلة للعمل المستمر حسب النظام المتصل" data-en="Automation designed for always-on connected workflows">أتمتة قابلة للعمل المستمر حسب النظام المتصل</span></div><div class="titanium-metric"><strong>AI-ready</strong><span data-ar="واجهات وسير عمل جاهز لدمج الذكاء الاصطناعي" data-en="Interfaces and workflows ready for AI integration">واجهات وسير عمل جاهز لدمج الذكاء الاصطناعي</span></div><div class="titanium-metric"><strong>Human</strong><span data-ar="موافقة بشرية قبل الإجراءات الحساسة" data-en="Human approval before sensitive actions">موافقة بشرية قبل الإجراءات الحساسة</span></div><div class="titanium-metric"><strong>One</strong><span data-ar="منظومة مترابطة بدل الأدوات المتفرقة" data-en="One connected system instead of scattered tools">منظومة مترابطة بدل الأدوات المتفرقة</span></div></div>`;
    process.parentNode.insertBefore(s,process);
    if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.1});io.observe(s)}else s.classList.add('in');
  }

  function redesignProcess(){
    const section=q('#process');if(!section)return;
    copy(q('.section-heading .eyebrow',section),'طريقة العمل','PROCESS');copy(q('.section-heading h2',section),'من الفكرة إلى نظام يتطور معك.','From idea to a system that scales with you.');
    const timeline=q('.timeline',section);if(timeline&&!timeline.dataset.titanium){timeline.dataset.titanium='1';timeline.innerHTML=`
      <div class="step reveal"><span>01</span><div><h3 data-ar="اكتشاف" data-en="Discover">اكتشاف</h3><p data-ar="نفهم العمل والهدف والقيود قبل اختيار التقنية." data-en="Understand the business, goal and constraints before choosing technology.">نفهم العمل والهدف والقيود قبل اختيار التقنية.</p></div></div>
      <div class="step reveal"><span>02</span><div><h3 data-ar="تصميم" data-en="Design">تصميم</h3><p data-ar="هيكل وتجربة واضحة قبل الدخول بالتنفيذ الكامل." data-en="Define the structure and experience before full implementation.">هيكل وتجربة واضحة قبل الدخول بالتنفيذ الكامل.</p></div></div>
      <div class="step reveal"><span>03</span><div><h3 data-ar="بناء" data-en="Build">بناء</h3><p data-ar="نطور الواجهات والمنطق والربط وقاعدة العمل." data-en="Build interfaces, logic, integrations and the operating foundation.">نطور الواجهات والمنطق والربط وقاعدة العمل.</p></div></div>
      <div class="step reveal"><span>04</span><div><h3 data-ar="أتمتة" data-en="Automate">أتمتة</h3><p data-ar="نربط الخطوات المتكررة والبيانات داخل Workflow مضبوط." data-en="Connect repetitive work and data into a controlled workflow.">نربط الخطوات المتكررة والبيانات داخل Workflow مضبوط.</p></div></div>
      <div class="step reveal"><span>05</span><div><h3 data-ar="إطلاق" data-en="Launch">إطلاق</h3><p data-ar="اختبار وتسليم وإطلاق منظم مع مراجعة الوظائف الأساسية." data-en="Test, hand over and launch with core functionality verified.">اختبار وتسليم وإطلاق منظم مع مراجعة الوظائف الأساسية.</p></div></div>
      <div class="step reveal"><span>06</span><div><h3 data-ar="توسع" data-en="Scale">توسع</h3><p data-ar="نضيف قدرات جديدة بدون تفكيك النظام الموجود." data-en="Add capabilities without dismantling the existing system.">نضيف قدرات جديدة بدون تفكيك النظام الموجود.</p></div></div>`;
      const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.08}):null;qa('.reveal',timeline).forEach(x=>io?io.observe(x):x.classList.add('in'));
    }
  }

  function redesignSolutionsAndWork(){
    const solutions=q('#solutions');if(solutions){copy(q('.section-heading .eyebrow',solutions),'حلول مرنة','SOLUTIONS');copy(q('.section-heading h2',solutions),'نفس التقنية. مصممة لسياق عملك.','One technology foundation. Shaped around your business.');}
    const work=q('#showcase');if(work){copy(q('.section-heading .eyebrow',work),'من المنتج','PRODUCT WORK');copy(q('.section-heading h2',work),'عمل يُعرض كمنتج، مو كقالب.','Work presented like a product, not a template.');copy(q('.section-heading p',work),'واجهات ونماذج توضيحية من نوع الأنظمة التي نبنيها، مع الحفاظ على تمييز أي Demo عن النظام الفعلي.','Product-style previews of the systems we build, while keeping demos clearly distinguished from live systems.');}
  }

  function redesignContact(){
    const c=q('#contact');if(!c)return;
    copy(q('.contact-copy .eyebrow',c),'ابدأ الآن','START NOW');copy(q('.contact-copy h2',c),'جاهز تبني الشيء القادم؟',"Ready to build what's next?");copy(q('.contact-copy>p',c),'احچيلنا شنو تريد تأتمت، تبني، أو تحسن. نفس نموذج الإرسال الحالي يبقى مربوط بالنظام بدون تغيير.','Tell us what you want to automate, build, or improve.');
    const submit=q('.form-submit span:first-child',c);copy(submit,'أرسل المشروع','Send Project');
  }

  function polishGrowth(){
    const growth=q('#nexora-growth-suite');if(!growth)return;
    const headings=qa('.section-heading h2',growth);headings.forEach(h=>h.style.textWrap='balance');
  }

  function installSkipLink(){
    if(q('.titanium-skip'))return;const a=document.createElement('a');a.className='titanium-skip';a.href='#contact';a.textContent='Skip to project form';a.style.cssText='position:fixed;z-index:5000;top:8px;left:8px;transform:translateY(-150%);background:#0071E3;color:#fff;padding:10px 14px;border-radius:10px;text-decoration:none;font:600 12px Inter;transition:.2s';a.onfocus=()=>a.style.transform='none';a.onblur=()=>a.style.transform='translateY(-150%)';document.body.prepend(a);
  }

  function init(){
    if(!localStorage.getItem('nexora-theme'))root.dataset.theme='light';
    document.body.classList.add('nexora-titanium');
    setBrand();redesignNav();redesignHero();productNarrative();redesignServices();installMetrics();redesignProcess();redesignSolutionsAndWork();redesignContact();polishGrowth();installSkipLink();rerenderLang();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();