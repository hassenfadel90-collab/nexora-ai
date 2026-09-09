(()=>{
  const opt=(arr,label,value='id')=>arr.map(x=>`<option value="${esc(x[value])}">${esc(label(x))}</option>`).join('');
  const projectOptions=()=>'<option value="">بدون مشروع</option>'+opt(state.projects,x=>x.title);
  const leadOptions=()=>'<option value="">بدون Lead</option>'+opt(state.leads,x=>x.name);
  const staffOptions=()=>'<option value="">غير معيّن</option>'+opt(state.profiles.filter(p=>p.active),x=>x.full_name||x.email);

  function modalActions(title,body,onSave){
    openModal(`<span class="eyebrow">CREATE</span><h3>${title}</h3>${body}<div class="form-actions"><button type="button" class="btn ghost" id="cancelCreate">إلغاء</button><button type="button" class="btn primary" id="confirmCreate">حفظ</button></div>`);
    document.getElementById('cancelCreate').onclick=closeModal;
    document.getElementById('confirmCreate').onclick=async()=>{
      const b=document.getElementById('confirmCreate');b.disabled=true;
      try{await onSave();}catch(e){toast(e?.message||'تعذر الحفظ',true)}finally{b.disabled=false}
    };
  }

  function createProject(){
    modalActions('مشروع جديد',`<div class="form-grid"><label>اسم المشروع<input id="cpTitle" required></label><label>الحالة<select id="cpStatus"><option value="planned">مخطط</option><option value="active">نشط</option><option value="on_hold">متوقف</option></select></label><label>الميزانية<input id="cpBudget" type="number" min="0" step="0.01"></label><label>العملة<select id="cpCurrency"><option>USD</option><option>IQD</option><option>EUR</option></select></label><label>الموعد النهائي<input id="cpDeadline" type="date"></label><label>المسؤول<select id="cpAssigned">${staffOptions()}</select></label><label class="full">الوصف<textarea id="cpDescription" rows="4"></textarea></label></div>`,async()=>{
      const title=document.getElementById('cpTitle').value.trim();if(!title)throw new Error('أدخل اسم المشروع.');
      const row={title,description:document.getElementById('cpDescription').value.trim()||null,status:document.getElementById('cpStatus').value,budget:Number(document.getElementById('cpBudget').value)||null,currency:document.getElementById('cpCurrency').value,deadline:document.getElementById('cpDeadline').value||null,assigned_to:document.getElementById('cpAssigned').value||null,created_by:state.profile.id};
      const {error}=await sb.from('projects').insert(row);if(error)throw error;closeModal();toast('تم إنشاء المشروع');await refreshAll();goPage('projects');
    });
  }

  function createTask(){
    modalActions('مهمة جديدة',`<div class="form-grid"><label>عنوان المهمة<input id="ctTitle" required></label><label>المشروع<select id="ctProject">${projectOptions()}</select></label><label>الأولوية<select id="ctPriority"><option value="normal">عادية</option><option value="high">عالية</option><option value="urgent">عاجلة</option></select></label><label>المسؤول<select id="ctAssigned">${staffOptions()}</select></label><label>موعد الاستحقاق<input id="ctDue" type="datetime-local"></label><label>مرئية للعميل<select id="ctVisible"><option value="false">لا</option><option value="true">نعم</option></select></label><label class="full">الوصف<textarea id="ctDescription" rows="4"></textarea></label></div>`,async()=>{
      const title=document.getElementById('ctTitle').value.trim();if(!title)throw new Error('أدخل عنوان المهمة.');
      const due=document.getElementById('ctDue').value;
      const row={title,description:document.getElementById('ctDescription').value.trim()||null,project_id:document.getElementById('ctProject').value||null,priority:document.getElementById('ctPriority').value,assigned_to:document.getElementById('ctAssigned').value||null,due_at:due?new Date(due).toISOString():null,visible_to_client:document.getElementById('ctVisible').value==='true',created_by:state.profile.id};
      const {error}=await sb.from('tasks').insert(row);if(error)throw error;closeModal();toast('تم إنشاء المهمة');await refreshAll();goPage('tasks');
    });
  }

  function createProposal(){
    modalActions('عرض جديد',`<div class="form-grid"><label>عنوان العرض<input id="cprTitle" required></label><label>Lead<select id="cprLead">${leadOptions()}</select></label><label>المشروع<select id="cprProject">${projectOptions()}</select></label><label>السعر<input id="cprPrice" type="number" min="0" step="0.01"></label><label>العملة<select id="cprCurrency"><option>USD</option><option>IQD</option><option>EUR</option></select></label><label>مرئي للعميل<select id="cprVisible"><option value="false">لا</option><option value="true">نعم</option></select></label><label class="full">النطاق<textarea id="cprScope" rows="5"></textarea></label><label class="full">الشروط<textarea id="cprTerms" rows="3"></textarea></label></div>`,async()=>{
      const title=document.getElementById('cprTitle').value.trim();if(!title)throw new Error('أدخل عنوان العرض.');
      const row={title,lead_id:document.getElementById('cprLead').value||null,project_id:document.getElementById('cprProject').value||null,scope:document.getElementById('cprScope').value.trim()||null,terms:document.getElementById('cprTerms').value.trim()||null,price:Number(document.getElementById('cprPrice').value)||null,currency:document.getElementById('cprCurrency').value,visible_to_client:document.getElementById('cprVisible').value==='true',status:'draft',ai_generated:false,created_by:state.profile.id};
      const {error}=await sb.from('proposals').insert(row);if(error)throw error;closeModal();toast('تم إنشاء العرض كمسودة');await refreshAll();goPage('proposals');
    });
  }

  function createInvoice(){
    const invoiceNo=`NX-${new Date().toISOString().replace(/\D/g,'').slice(0,14)}`;
    modalActions('فاتورة جديدة',`<div class="form-grid"><label>رقم الفاتورة<input id="ciNumber" value="${invoiceNo}"></label><label>المشروع<select id="ciProject">${projectOptions()}</select></label><label>Lead<select id="ciLead">${leadOptions()}</select></label><label>المبلغ<input id="ciTotal" type="number" min="0" step="0.01" required></label><label>العملة<select id="ciCurrency"><option>USD</option><option>IQD</option><option>EUR</option></select></label><label>تاريخ الاستحقاق<input id="ciDue" type="date"></label><label class="full">ملاحظات<textarea id="ciNotes" rows="4"></textarea></label></div>`,async()=>{
      const number=document.getElementById('ciNumber').value.trim(),total=Number(document.getElementById('ciTotal').value);if(!number)throw new Error('أدخل رقم الفاتورة.');if(!(total>=0))throw new Error('أدخل مبلغاً صحيحاً.');
      const row={invoice_number:number,project_id:document.getElementById('ciProject').value||null,lead_id:document.getElementById('ciLead').value||null,subtotal:total,total,currency:document.getElementById('ciCurrency').value,due_date:document.getElementById('ciDue').value||null,notes:document.getElementById('ciNotes').value.trim()||null,status:'draft',created_by:state.profile.id};
      const {error}=await sb.from('invoices').insert(row);if(error)throw error;closeModal();toast('تم إنشاء الفاتورة كمسودة');await refreshAll();goPage('invoices');
    });
  }

  function createEmployee(){
    if(!ownerAdmin())return toast('إضافة أعضاء الفريق متاحة للـ Owner/Admin فقط.',true);
    modalActions('إضافة عضو فريق',`<div class="form-grid"><label>الاسم<input id="ceName"></label><label>البريد الإلكتروني<input id="ceEmail" type="email" required></label><label>الدور<select id="ceRole"><option value="admin">Admin</option><option value="manager">Manager</option><option value="sales">Sales</option><option value="developer">Developer</option></select></label></div><div class="auth-info"><strong>طريقة التفعيل</strong><p>بعد الحفظ يصبح البريد معتمداً. يستخدم الموظف تبويب «تفعيل حساب» في لوحة الإدارة بنفس البريد.</p></div>`,async()=>{
      const email=document.getElementById('ceEmail').value.trim().toLowerCase();if(!email.includes('@'))throw new Error('أدخل بريداً صحيحاً.');
      const row={email,full_name:document.getElementById('ceName').value.trim()||null,role:document.getElementById('ceRole').value,active:true,added_by:state.profile.id,updated_at:new Date().toISOString()};
      const {error}=await sb.from('team_access').upsert(row,{onConflict:'email'});if(error)throw error;closeModal();toast('تم اعتماد بريد عضو الفريق');await refreshAll();goPage('employees');
    });
  }

  const bind=()=>{
    const map={newProjectBtn:createProject,newTaskBtn:createTask,newProposalBtn:createProposal,newInvoiceBtn:createInvoice,newEmployeeBtn:createEmployee};
    Object.entries(map).forEach(([id,fn])=>{const el=document.getElementById(id);if(el)el.onclick=fn});
    document.querySelectorAll('[data-quick="proposal"]').forEach(b=>b.onclick=createProposal);
  };
  bind();
  window.NEXORA_CREATE_ACTIONS={createProject,createTask,createProposal,createInvoice,createEmployee};
})();