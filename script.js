const root = document.documentElement;
const toggle = document.getElementById('langToggle');
let lang = 'ar';

function applyLang(next){
  lang = next;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if(toggle) toggle.textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll('option[data-ar][data-en]').forEach(el=>{
    el.textContent = el.dataset[lang];
  });
}

if(toggle) toggle.addEventListener('click',()=>applyLang(lang === 'ar' ? 'en' : 'ar'));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in');
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

function installVisibleLoginAccess(){
  if(document.getElementById('nexoraLoginAccessStyles')) return;
  const style = document.createElement('style');
  style.id = 'nexoraLoginAccessStyles';
  style.textContent = `
    .nex-login-menu{position:relative;z-index:120}.nex-login-trigger{height:40px;display:flex;align-items:center;gap:8px;padding:0 12px;border:1px solid rgba(255,255,255,.12);border-radius:12px;background:rgba(255,255,255,.055);color:inherit;cursor:pointer;font:700 12px Cairo,sans-serif;white-space:nowrap}.nex-login-trigger:hover{border-color:rgba(124,92,255,.45);background:rgba(124,92,255,.11)}.nex-login-pop{position:absolute;top:48px;inset-inline-end:0;width:330px;padding:8px;border:1px solid rgba(255,255,255,.10);border-radius:18px;background:rgba(9,13,22,.98);box-shadow:0 28px 80px rgba(0,0,0,.38);backdrop-filter:blur(22px);display:none}.nex-login-menu.open .nex-login-pop{display:block}.nex-login-option{display:grid;grid-template-columns:44px 1fr auto;gap:11px;align-items:center;padding:12px;border-radius:13px;text-decoration:none;color:inherit;transition:.16s}.nex-login-option:hover{background:rgba(124,92,255,.10)}.nex-login-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:rgba(124,92,255,.15);color:#b6aaff;font:800 17px Inter}.nex-login-icon.client{background:rgba(0,216,255,.11);color:#7ce9f1}.nex-login-option strong,.nex-login-option small{display:block}.nex-login-option strong{font-size:12px}.nex-login-option small{margin-top:3px;color:#8f9bad;font-size:10px}.nex-login-option>b{color:#8f9bad}.nex-access-shortcuts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px;max-width:720px}.nex-access-card{display:grid;grid-template-columns:42px 1fr auto;gap:10px;align-items:center;padding:12px 13px;border:1px solid rgba(255,255,255,.10);border-radius:16px;text-decoration:none;color:inherit;background:rgba(255,255,255,.035);transition:.18s;backdrop-filter:blur(10px)}.nex-access-card:hover{transform:translateY(-2px);border-color:rgba(124,92,255,.36);background:rgba(124,92,255,.075)}.nex-access-card.client:hover{border-color:rgba(0,216,255,.30);background:rgba(0,216,255,.055)}.nex-access-icon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(124,92,255,.15);color:#b8abff;font:800 16px Inter}.nex-access-card.client .nex-access-icon{background:rgba(0,216,255,.11);color:#83e9ef}.nex-access-card strong,.nex-access-card small{display:block}.nex-access-card strong{font-size:12px}.nex-access-card small{margin-top:3px;color:#8f9bad;font:600 9px Inter,sans-serif}.nex-access-card>b{color:#8f9bad}@media(max-width:900px){.nex-login-trigger .label{display:none}.nex-login-pop{width:min(330px,calc(100vw - 24px))}}@media(max-width:640px){.nex-login-trigger{width:40px;padding:0;justify-content:center}.nex-login-pop{position:fixed;top:68px;right:12px;left:12px;width:auto}.nex-access-shortcuts{grid-template-columns:1fr;margin-top:14px}}
    html[data-theme="light"] .nex-login-trigger,html[data-theme="light"] .nex-access-card{background:rgba(255,255,255,.95);border-color:rgba(20,31,50,.10)}html[data-theme="light"] .nex-login-pop{background:rgba(255,255,255,.99);border-color:rgba(20,31,50,.10);box-shadow:0 28px 80px rgba(42,57,83,.16)}
  `;
  document.head.appendChild(style);

  const actions = document.querySelector('.header-actions');
  if(actions && !document.querySelector('.nex-login-menu')){
    const wrap = document.createElement('div');
    wrap.className = 'nex-login-menu';
    wrap.innerHTML = `
      <button class="nex-login-trigger" type="button" aria-expanded="false"><span>↪</span><span class="label" data-ar="تسجيل الدخول" data-en="Sign in">تسجيل الدخول</span><span>⌄</span></button>
      <div class="nex-login-pop">
        <a class="nex-login-option" href="/dashboard/"><span class="nex-login-icon">◫</span><span><strong data-ar="لوحة الإدارة" data-en="Staff Dashboard">لوحة الإدارة</strong><small data-ar="للمالك والموظفين المعتمدين" data-en="For owner and authorized staff">للمالك والموظفين المعتمدين</small></span><b>↗</b></a>
        <a class="nex-login-option" href="/portal/"><span class="nex-login-icon client">◎</span><span><strong data-ar="بوابة العملاء" data-en="Client Portal">بوابة العملاء</strong><small data-ar="لمتابعة المشاريع والملفات" data-en="Track projects and files">لمتابعة المشاريع والملفات</small></span><b>↗</b></a>
      </div>`;
    actions.insertBefore(wrap, actions.firstChild);
    const btn = wrap.querySelector('.nex-login-trigger');
    btn.addEventListener('click',e=>{e.stopPropagation();const open=wrap.classList.toggle('open');btn.setAttribute('aria-expanded',String(open))});
    document.addEventListener('click',()=>{wrap.classList.remove('open');btn.setAttribute('aria-expanded','false')});
    wrap.querySelector('.nex-login-pop').addEventListener('click',e=>e.stopPropagation());
  }

  const heroCta = document.querySelector('.hero-cta');
  if(heroCta && !document.querySelector('.nex-access-shortcuts')){
    const shortcuts = document.createElement('div');
    shortcuts.className = 'nex-access-shortcuts';
    shortcuts.innerHTML = `
      <a class="nex-access-card" href="/dashboard/"><span class="nex-access-icon">◫</span><span><strong data-ar="دخول الإدارة والفريق" data-en="Staff & Admin Login">دخول الإدارة والفريق</strong><small>CRM • Projects • AI • Approvals</small></span><b>↗</b></a>
      <a class="nex-access-card client" href="/portal/"><span class="nex-access-icon">◎</span><span><strong data-ar="دخول العملاء" data-en="Client Login">دخول العملاء</strong><small data-ar="المشاريع • الملفات • العروض" data-en="Projects • Files • Proposals">المشاريع • الملفات • العروض</small></span><b>↗</b></a>`;
    heroCta.insertAdjacentElement('afterend',shortcuts);
  }
}

installVisibleLoginAccess();

const form = document.getElementById('leadForm');
const note = document.getElementById('formNote');
const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/wym5rha3snhq2qe7p2abdjd8hp9wozhg';

if(form) form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';
  try{
    await fetch(MAKE_WEBHOOK_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},body:new URLSearchParams(data).toString()});
    note.textContent = lang === 'ar' ? 'تم إرسال طلبك بنجاح. سيقوم النظام بتحليله وتجهيز الخطوة التالية.' : 'Your request was sent successfully. Our system will analyze it and prepare the next step.';
    note.classList.add('success');form.reset();
  }catch(err){
    note.textContent = lang === 'ar' ? 'تعذر الإرسال حالياً. يرجى المحاولة مرة أخرى بعد قليل.' : 'Could not send right now. Please try again shortly.';
    note.classList.remove('success');
  }finally{button.disabled=false;button.innerHTML=original;}
});

applyLang('ar');
