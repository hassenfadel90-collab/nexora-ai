(()=>{
  const ready=()=>{
    const signupBtn=document.getElementById('signupBtn');
    const resendBtn=document.getElementById('resendBtn');
    const form=document.getElementById('authForm');
    const password=document.getElementById('password');
    if(!signupBtn||!form||!password)return;

    if(resendBtn)resendBtn.style.display='none';
    signupBtn.textContent='تفعيل الحساب لأول مرة';

    let wrap=document.getElementById('activationWrap');
    if(!wrap){
      wrap=document.createElement('label');
      wrap.id='activationWrap';
      wrap.style.display='none';
      wrap.innerHTML='كود التفعيل<input id="activationCode" type="text" autocomplete="one-time-code" placeholder="NX-XXXX-XXXX-XXXX" maxlength="20" style="text-transform:uppercase">';
      password.closest('label')?.insertAdjacentElement('afterend',wrap);
    }

    let activationMode=false;
    const setMode=(on)=>{
      activationMode=on;
      wrap.style.display=on?'grid':'none';
      signupBtn.textContent=on?'تفعيل الحساب':'تفعيل الحساب لأول مرة';
      const submit=form.querySelector('button[type="submit"]');
      if(submit)submit.style.display=on?'none':'';
      if(on){
        const n=document.getElementById('note');
        if(n){n.textContent='استخدم كود التفعيل الذي يرسله لك فريق NEXORA. لا تحتاج إلى رسالة تأكيد بريد.';n.className='note ok'}
        setTimeout(()=>document.getElementById('activationCode')?.focus(),0);
      }
    };

    signupBtn.onclick=async()=>{
      if(!activationMode){setMode(true);return;}
      const email=document.getElementById('email')?.value.trim().toLowerCase()||'';
      const pass=password.value||'';
      const code=(document.getElementById('activationCode')?.value||'').trim().toUpperCase();
      if(!email.includes('@'))return note('أدخل بريداً صحيحاً.',true);
      if(pass.length<8)return note('كلمة المرور 8 أحرف على الأقل.',true);
      if(code.length<10)return note('أدخل كود التفعيل الصحيح.',true);
      signupBtn.disabled=true;
      const old=signupBtn.textContent;signupBtn.textContent='جارِ التفعيل…';
      try{
        const r=await fetch(`${URL}/functions/v1/client-activate`,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},body:JSON.stringify({email,password:pass,code})});
        const data=await r.json().catch(()=>({}));
        if(!r.ok||!data.ok)throw new Error(data.error||'تعذر تفعيل الحساب');
        note('تم تفعيل الحساب بنجاح. جارِ تسجيل الدخول…',false,true);
        const {error}=await sb.auth.signInWithPassword({email,password:pass});
        if(error)throw error;
        await init();
      }catch(e){note(e?.message||'تعذر تفعيل الحساب.',true)}
      finally{signupBtn.disabled=false;signupBtn.textContent=old}
    };

    document.getElementById('email')?.addEventListener('input',()=>{if(activationMode)document.getElementById('activationCode').value=''});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();