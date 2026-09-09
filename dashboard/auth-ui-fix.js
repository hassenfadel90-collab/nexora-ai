(()=>{
  const base=location.hostname.endsWith('github.io')?'/nexora-ai':'';
  const homeUrl=`${location.origin}${base}/`;
  const dashboardUrl=`${location.origin}${base}/dashboard/`;
  const portalUrl=`${location.origin}${base}/portal/`;
  const recoveryUrl=`${dashboardUrl}?recovery=1`;

  const humanError=(err)=>{
    const m=String(err?.message||err||'');
    if(/Invalid login credentials/i.test(m))return 'البريد أو كلمة المرور غير صحيحة.';
    if(/Email not confirmed/i.test(m))return 'البريد غير مؤكد بعد. تأكد أيضاً من كتابة نطاق البريد بشكل صحيح، مثل gmail.com.';
    if(/rate limit|too many requests/i.test(m))return 'محاولات كثيرة. انتظر قليلاً ثم أعد المحاولة.';
    if(/network|fetch/i.test(m))return 'تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مجدداً.';
    return m||'حدث خطأ غير متوقع.';
  };

  // Prevent common Gmail domain typos from creating a second, unconfirmed account
  // or blocking an existing approved NEXORA account from signing in.
  const emailDomainFixes={
    'gmai.com':'gmail.com',
    'gmial.com':'gmail.com',
    'gmail.con':'gmail.com'
  };
  const normalizeEmail=(value='')=>{
    const raw=String(value||'').trim().toLowerCase();
    const at=raw.lastIndexOf('@');
    if(at<=0)return {email:raw,corrected:false,from:raw};
    const local=raw.slice(0,at),domain=raw.slice(at+1);
    const fixed=emailDomainFixes[domain];
    if(!fixed)return {email:raw,corrected:false,from:raw};
    return {email:`${local}@${fixed}`,corrected:true,from:raw};
  };
  const getEmail=(id)=>{
    const input=document.getElementById(id);
    const result=normalizeEmail(input?.value||'');
    if(input&&result.corrected)input.value=result.email;
    return result;
  };
  const repairRememberedEmail=()=>{
    try{
      const saved=localStorage.getItem('nexora-auth-email');
      if(!saved)return;
      const fixed=normalizeEmail(saved);
      if(fixed.corrected){
        localStorage.setItem('nexora-auth-email',fixed.email);
        const input=document.getElementById('authEmail');
        if(input)input.value=fixed.email;
      }
    }catch{}
  };

  const setLinks=()=>{
    document.querySelectorAll('a[href="/"],a[href="/dashboard/"],a[href="/portal/"]').forEach(a=>{
      const h=a.getAttribute('href');
      if(h==='/')a.href=homeUrl;
      if(h==='/dashboard/')a.href=dashboardUrl;
      if(h==='/portal/')a.href=portalUrl;
    });
  };
  setLinks();
  repairRememberedEmail();

  const form=document.getElementById('authForm');
  if(form)form.onsubmit=async(e)=>{
    e.preventDefault();
    const emailResult=getEmail('authEmail');
    const email=emailResult.email;
    const password=document.getElementById('authPassword')?.value||'';
    if(!email||!password)return authNote('أدخل البريد وكلمة المرور.',true);
    authNote(emailResult.corrected?`تم تصحيح البريد إلى ${email}، وجاري تسجيل الدخول…`:'جاري تسجيل الدخول…');
    const remember=document.getElementById('rememberEmail')?.checked;
    if(remember)localStorage.setItem('nexora-auth-email',email);else localStorage.removeItem('nexora-auth-email');
    const {error}=await sb.auth.signInWithPassword({email,password});
    if(error)return authNote(humanError(error),true);
    await initSession();
  };

  const forgotBtn=document.getElementById('forgotPasswordBtn');
  if(forgotBtn)forgotBtn.onclick=async()=>{
    const emailResult=getEmail('authEmail');
    const email=emailResult.email;
    if(!email)return authNote('أدخل البريد الإلكتروني أولاً.',true);
    forgotBtn.disabled=true;
    authNote(emailResult.corrected?`تم تصحيح البريد إلى ${email}. جاري إرسال رابط إعادة التعيين…`:'جاري إرسال رابط إعادة تعيين كلمة المرور…');
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:recoveryUrl});
    forgotBtn.disabled=false;
    if(error)return authNote(humanError(error),true);
    authNote('تم إرسال رابط إعادة تعيين كلمة المرور. افتح الرسالة من نفس الجهاز إن أمكن.',false,true);
  };

  const magicBtn=document.getElementById('magicLinkBtn');
  if(magicBtn)magicBtn.onclick=async()=>{
    const emailResult=getEmail('authEmail');
    const email=emailResult.email;
    if(!email)return authNote('أدخل البريد الإلكتروني أولاً.',true);
    magicBtn.disabled=true;
    if(emailResult.corrected)authNote(`تم تصحيح البريد إلى ${email}. جاري إرسال رابط الدخول…`);
    const {error}=await sb.auth.signInWithOtp({email,options:{shouldCreateUser:false,emailRedirectTo:dashboardUrl}});
    magicBtn.disabled=false;
    authNote(error?humanError(error):'تم إرسال رابط الدخول إلى بريدك.',!!error,!error);
  };

  const signupBtn=document.getElementById('signupBtn');
  if(signupBtn)signupBtn.onclick=async()=>{
    const emailResult=getEmail('activateEmail');
    const email=emailResult.email;
    const password=document.getElementById('activatePassword')?.value||'';
    if(!email||password.length<8)return authNote('أدخل البريد المعتمد وكلمة مرور من 8 أحرف على الأقل.',true);
    signupBtn.disabled=true;
    authNote(emailResult.corrected?`تم تصحيح البريد إلى ${email}. جاري تفعيل الحساب…`:'جاري تفعيل الحساب…');
    const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:dashboardUrl}});
    signupBtn.disabled=false;
    if(error)return authNote(humanError(error),true);
    if(data?.session)return initSession();
    authNote('تم إنشاء الحساب. إذا كان تأكيد البريد مطلوباً، افتح رسالة التأكيد ثم سجّل الدخول.',false,true);
  };

  const resendBtn=document.getElementById('resendBtn');
  if(resendBtn)resendBtn.onclick=async()=>{
    const sourceId=document.getElementById('activateEmail')?.value?'activateEmail':'authEmail';
    const emailResult=getEmail(sourceId);
    const email=emailResult.email;
    if(!email)return authNote('أدخل البريد الإلكتروني أولاً.',true);
    resendBtn.disabled=true;
    const {error}=await sb.auth.resend({type:'signup',email,options:{emailRedirectTo:dashboardUrl}});
    resendBtn.disabled=false;
    authNote(error?humanError(error):'أُعيد إرسال رسالة التأكيد.',!!error,!error);
  };

  const recoveryForm=document.getElementById('recoveryForm');
  if(recoveryForm)recoveryForm.onsubmit=async(e)=>{
    e.preventDefault();
    const p=document.getElementById('recoveryPassword')?.value||'';
    const c=document.getElementById('recoveryPasswordConfirm')?.value||'';
    if(p.length<8)return authNote('كلمة المرور يجب أن تكون 8 أحرف على الأقل.',true);
    if(p!==c)return authNote('كلمتا المرور غير متطابقتين.',true);
    const submit=recoveryForm.querySelector('button[type="submit"]');
    if(submit)submit.disabled=true;
    const {error}=await sb.auth.updateUser({password:p});
    if(submit)submit.disabled=false;
    if(error)return authNote(humanError(error),true);
    recoveryMode=false;
    history.replaceState({},'',dashboardUrl);
    authNote('تم تغيير كلمة المرور بنجاح.',false,true);
    await initSession();
  };

  const params=new URLSearchParams(location.search);
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  const recoveryHint=params.get('recovery')==='1'||hash.get('type')==='recovery';
  if(recoveryHint){
    recoveryMode=true;
    setTimeout(()=>showRecovery(),50);
  }

  sb.auth.onAuthStateChange((event)=>{
    if(event==='PASSWORD_RECOVERY')setTimeout(()=>showRecovery(),0);
  });

  window.NEXORA_AUTH={homeUrl,dashboardUrl,portalUrl,recoveryUrl};
})();