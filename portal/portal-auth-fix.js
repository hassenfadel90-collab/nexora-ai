(()=>{
  const base=location.hostname.endsWith('github.io')?'/nexora-ai':'';
  const homeUrl=`${location.origin}${base}/`;
  const dashboardUrl=`${location.origin}${base}/dashboard/`;
  const portalUrl=`${location.origin}${base}/portal/`;
  const recoveryUrl=`${portalUrl}?recovery=1`;

  if(!document.querySelector('link[data-titanium-portal]')){
    const l=document.createElement('link');l.rel='stylesheet';l.href='./titanium-portal.css?v=titanium-20260909-1';l.dataset.titaniumPortal='1';document.head.appendChild(l);
  }

  document.querySelectorAll('a[href="/"],a[href="/dashboard/"],a[href="/portal/"]').forEach(a=>{
    const h=a.getAttribute('href');
    if(h==='/')a.href=homeUrl;
    if(h==='/dashboard/')a.href=dashboardUrl;
    if(h==='/portal/')a.href=portalUrl;
  });

  const authForm=document.getElementById('authForm');
  const signupBtn=document.getElementById('signupBtn');
  let forgotBtn=document.getElementById('forgotClientPasswordBtn');
  if(authForm&&!forgotBtn){
    forgotBtn=document.createElement('button');
    forgotBtn.type='button';forgotBtn.id='forgotClientPasswordBtn';forgotBtn.className='link-btn';forgotBtn.textContent='نسيت كلمة المرور';
    signupBtn?.insertAdjacentElement('afterend',forgotBtn);
  }

  let recovery=document.getElementById('clientRecoveryForm');
  if(authForm&&!recovery){
    recovery=document.createElement('form');
    recovery.id='clientRecoveryForm';
    recovery.style.display='none';
    recovery.innerHTML='<label>كلمة المرور الجديدة<input id="clientRecoveryPassword" type="password" minlength="8" autocomplete="new-password" required></label><label>تأكيد كلمة المرور<input id="clientRecoveryConfirm" type="password" minlength="8" autocomplete="new-password" required></label><button class="btn primary" type="submit">حفظ كلمة المرور الجديدة</button><button class="link-btn" type="button" id="cancelClientRecovery">إلغاء</button>';
    authForm.insertAdjacentElement('afterend',recovery);
  }

  const showRecovery=()=>{
    showAuth();
    if(authForm)authForm.style.display='none';
    if(recovery)recovery.style.display='grid';
    note('تم فتح وضع إعادة تعيين كلمة المرور. اختر كلمة مرور جديدة.',false,true);
  };
  const hideRecovery=()=>{
    if(authForm)authForm.style.display='grid';
    if(recovery)recovery.style.display='none';
  };

  if(forgotBtn)forgotBtn.onclick=async()=>{
    const email=document.getElementById('email')?.value.trim().toLowerCase()||'';
    if(!email)return note('اكتب البريد الإلكتروني أولاً.',true);
    forgotBtn.disabled=true;note('جاري إرسال رابط إعادة تعيين كلمة المرور…');
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:recoveryUrl});
    forgotBtn.disabled=false;
    if(error)return note(error.message||'تعذر إرسال رابط الاستعادة.',true);
    note('تم إرسال رابط إعادة تعيين كلمة المرور. افحص البريد وSpam/Junk.',false,true);
  };

  if(recovery)recovery.onsubmit=async(e)=>{
    e.preventDefault();
    const p=document.getElementById('clientRecoveryPassword')?.value||'';
    const c=document.getElementById('clientRecoveryConfirm')?.value||'';
    if(p.length<8)return note('كلمة المرور يجب أن تكون 8 أحرف على الأقل.',true);
    if(p!==c)return note('كلمتا المرور غير متطابقتين.',true);
    const submit=recovery.querySelector('button[type="submit"]');if(submit)submit.disabled=true;
    const {error}=await sb.auth.updateUser({password:p});if(submit)submit.disabled=false;
    if(error)return note(error.message||'تعذر تغيير كلمة المرور.',true);
    history.replaceState({},'',portalUrl);hideRecovery();note('تم تغيير كلمة المرور بنجاح. جارِ فتح البوابة…',false,true);await init();
  };
  document.getElementById('cancelClientRecovery')?.addEventListener('click',()=>{hideRecovery();history.replaceState({},'',portalUrl);note('يمكنك تسجيل الدخول أو استخدام كود التفعيل.')});

  const params=new URLSearchParams(location.search),hash=new URLSearchParams(location.hash.replace(/^#/,''));
  if(params.get('recovery')==='1'||hash.get('type')==='recovery')setTimeout(showRecovery,60);
  sb.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setTimeout(showRecovery,0)});
  window.NEXORA_PORTAL_AUTH={homeUrl,dashboardUrl,portalUrl,recoveryUrl};

  const s=document.createElement('script');s.src='./titanium-portal.js?v=titanium-20260909-1';s.async=false;document.head.appendChild(s);
})();