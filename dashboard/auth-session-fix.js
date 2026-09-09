(()=>{
  if(typeof sb==='undefined')return;
  const original=window.initSession;
  window.initSession=async function(){
    try{
      const {data:{user},error:userError}=await sb.auth.getUser();
      if(userError||!user){
        showAuth();
        if(userError)authNote('انتهت جلسة الدخول أو تعذر التحقق منها. سجّل الدخول من جديد.',true);
        return;
      }
      const {data:profile,error:profileError}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
      if(profileError){
        console.error('NEXORA profile check',profileError);
        showAuth();
        authNote('تم تسجيل الدخول، لكن تعذر قراءة صلاحيات الحساب. أعد المحاولة؛ وإذا استمرت المشكلة استخدم استعادة كلمة المرور.',true);
        return;
      }
      if(!profile){
        showAuth();
        authNote('تم التحقق من الحساب، لكنه غير مربوط بملف فريق NEXORA.',true);
        return;
      }
      if(!profile.active){
        await sb.auth.signOut();showAuth();
        authNote('هذا الحساب غير فعال حالياً.',true);return;
      }
      state.user=user;state.profile=profile;
      showApp();
      try{await refreshAll()}catch(e){console.error('NEXORA initial refresh',e);toast('تم الدخول، لكن بعض البيانات لم تُحمّل. استخدم زر التحديث.',true)}
    }catch(e){
      console.error('NEXORA session init',e);
      showAuth();authNote('تعذر إكمال تسجيل الدخول بسبب خطأ اتصال. حاول مجدداً.',true);
    }
  };
  // Re-check an already restored Supabase session after all auth patches load.
  setTimeout(async()=>{
    try{const {data:{session}}=await sb.auth.getSession();if(session)await window.initSession()}catch(e){console.warn('session restore',e)}
  },0);
  window.NEXORA_AUTH_SESSION_PATCH={installed:true,previous:typeof original==='function'};
})();