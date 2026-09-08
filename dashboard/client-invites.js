(()=>{
  const ready=()=>{
    const bar=document.querySelector('#page-projects .section-toolbar');
    if(!bar||document.getElementById('clientInviteBtn'))return;
    const btn=document.createElement('button');
    btn.id='clientInviteBtn';btn.type='button';btn.className='btn ghost management-only';btn.textContent='＋ كود تفعيل عميل';
    bar.appendChild(btn);

    const dlg=document.createElement('dialog');
    dlg.id='clientInviteDialog';dlg.className='modal';
    dlg.innerHTML=`<form method="dialog" class="modal-card" id="clientInviteForm"><button class="modal-close" value="cancel">×</button><div class="modal-content"><span class="eyebrow">CLIENT ACCESS</span><h2>إنشاء كود تفعيل عميل</h2><p class="muted">الكود يستخدم مرة واحدة، ويغني مؤقتاً عن تأكيد البريد إلى أن يتم ربط دومين إرسال.</p><label>المشروع<select id="clientInviteProject" required></select></label><label>اسم العميل<input id="clientInviteName" placeholder="اسم العميل"></label><label>بريد العميل<input id="clientInviteEmail" type="email" required placeholder="client@example.com"></label><label>صلاحية الكود<select id="clientInviteHours"><option value="24">24 ساعة</option><option value="72">3 أيام</option><option value="168" selected>7 أيام</option><option value="336">14 يوم</option></select></label><div id="clientInviteResult" class="auth-info hidden"></div><div class="form-actions"><button class="btn ghost" value="cancel">إلغاء</button><button class="btn primary" id="generateClientInvite" type="button">إنشاء الكود</button></div></div></form>`;
    document.body.appendChild(dlg);

    const fillProjects=async()=>{
      let projects=[];
      try{projects=Array.isArray(state?.projects)?state.projects:[]}catch{}
      if(!projects.length){const r=await sb.from('projects').select('id,title,status').order('created_at',{ascending:false}).limit(100);projects=r.data||[]}
      const sel=document.getElementById('clientInviteProject');
      sel.innerHTML=projects.map(p=>`<option value="${p.id}">${String(p.title||'Project').replace(/[<>&"]/g,'')}</option>`).join('')||'<option value="">لا توجد مشاريع</option>';
    };
    btn.onclick=async()=>{await fillProjects();document.getElementById('clientInviteResult').classList.add('hidden');dlg.showModal()};
    document.getElementById('generateClientInvite').onclick=async()=>{
      const email=document.getElementById('clientInviteEmail').value.trim().toLowerCase(),name=document.getElementById('clientInviteName').value.trim(),project=document.getElementById('clientInviteProject').value,hours=Number(document.getElementById('clientInviteHours').value||168),result=document.getElementById('clientInviteResult'),go=document.getElementById('generateClientInvite');
      if(!project||!email.includes('@')){result.className='auth-info error';result.textContent='اختر المشروع وأدخل بريداً صحيحاً.';return}
      go.disabled=true;go.textContent='جارِ الإنشاء…';
      try{
        const {data,error}=await sb.rpc('create_client_invite',{p_email:email,p_project_id:project,p_full_name:name||null,p_valid_hours:hours});
        if(error)throw error;
        const row=Array.isArray(data)?data[0]:data;if(!row?.activation_code)throw new Error('لم يتم إنشاء الكود');
        result.className='auth-info success';
        result.innerHTML=`<strong>كود التفعيل</strong><p style="font-size:24px;font-weight:800;letter-spacing:.08em;direction:ltr">${row.activation_code}</p><small>صالح حتى ${new Date(row.expires_at).toLocaleString('ar-IQ')}</small><button type="button" class="btn ghost small" id="copyInviteCode">نسخ الكود</button>`;
        document.getElementById('copyInviteCode').onclick=async()=>{await navigator.clipboard.writeText(row.activation_code);try{toast('تم نسخ كود التفعيل')}catch{}};
      }catch(e){result.className='auth-info error';result.textContent=e?.message||'تعذر إنشاء كود التفعيل';}
      finally{go.disabled=false;go.textContent='إنشاء الكود'}
    };
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();