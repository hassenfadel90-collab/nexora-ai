const root = document.documentElement;
const toggle = document.getElementById('langToggle');
let lang = 'ar';

function applyLang(next){
  lang = next;
  root.lang = lang;
  root.dir = lang === 'ar' ? 'rtl' : 'ltr';
  toggle.textContent = lang === 'ar' ? 'EN' : 'AR';
  document.querySelectorAll('[data-ar][data-en]').forEach(el=>{
    el.textContent = el.dataset[lang];
  });
  document.querySelectorAll('option[data-ar][data-en]').forEach(el=>{
    el.textContent = el.dataset[lang];
  });
}

toggle.addEventListener('click',()=>applyLang(lang === 'ar' ? 'en' : 'ar'));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in');
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const form = document.getElementById('leadForm');
const note = document.getElementById('formNote');

const MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/wym5rha3snhq2qe7p2abdjd8hp9wozhg';

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';

  try{
    await fetch(MAKE_WEBHOOK_URL,{
      method:'POST',
      mode:'no-cors',
      headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'},
      body:new URLSearchParams(data).toString()
    });
    note.textContent = lang === 'ar' ? 'تم إرسال طلبك بنجاح. سيقوم النظام بتحليله وتجهيز الخطوة التالية.' : 'Your request was sent successfully. Our system will analyze it and prepare the next step.';
    note.classList.add('success');
    form.reset();
  }catch(err){
    note.textContent = lang === 'ar' ? 'تعذر الإرسال حالياً. يرجى المحاولة مرة أخرى بعد قليل.' : 'Could not send right now. Please try again shortly.';
    note.classList.remove('success');
  }finally{
    button.disabled = false;
    button.innerHTML = original;
  }
});

applyLang('ar');
