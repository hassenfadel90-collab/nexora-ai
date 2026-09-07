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

// Later: replace this with your Make webhook URL.
const MAKE_WEBHOOK_URL = '';

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const button = form.querySelector('button[type="submit"]');
  const original = button.innerHTML;
  button.disabled = true;
  button.textContent = lang === 'ar' ? 'جاري الإرسال...' : 'Sending...';

  try{
    if(MAKE_WEBHOOK_URL){
      const res = await fetch(MAKE_WEBHOOK_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Webhook failed');
    } else {
      note.textContent = lang === 'ar' ? 'نموذج التواصل قيد الربط حالياً، لذلك لم يتم إرسال طلبك بعد.' : 'The contact workflow is being connected, so your request was not sent yet.';
      note.classList.remove('success');
      return;
    }
    note.textContent = lang === 'ar' ? 'تم إرسال طلبك بنجاح.' : 'Your request was sent successfully.';
    note.classList.add('success');
    form.reset();
  }catch(err){
    note.textContent = lang === 'ar' ? 'تعذر الإرسال. سنربط النموذج بالـWebhook في الخطوة التالية.' : 'Could not send. We will connect the form to the webhook in the next step.';
    note.classList.remove('success');
  }finally{
    button.disabled = false;
    button.innerHTML = original;
  }
});

applyLang('ar');
