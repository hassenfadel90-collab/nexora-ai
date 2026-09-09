'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpLeft, CheckCircle2, Loader2 } from 'lucide-react'

const services=['موقع أو منصة','نظام أعمال','AI Agent','Automation','Dashboard / CRM','استشارة تقنية','أخرى']

export function ContactForm(){
  const [busy,setBusy]=useState(false)
  const [done,setDone]=useState(false)
  const [error,setError]=useState('')

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault()
    if(busy)return
    const form=e.currentTarget
    const fd=new FormData(form)
    const honeypot=String(fd.get('company_website')||'').trim()
    if(honeypot)return
    setBusy(true);setError('');setDone(false)
    try{
      const response=await fetch('/api/contact',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          name:String(fd.get('name')||''),
          business:String(fd.get('business')||''),
          country:String(fd.get('country')||''),
          contact:String(fd.get('contact')||''),
          service:String(fd.get('service')||''),
          message:String(fd.get('message')||''),
          company_website:honeypot,
        }),
      })
      const data=await response.json().catch(()=>({}))
      if(!response.ok||!data?.ok){
        if(response.status===429)throw new Error('محاولات كثيرة. حاول مرة أخرى بعد دقائق.')
        throw new Error(data?.error||'تعذر إرسال الطلب.')
      }
      form.reset();setDone(true)
    }catch(err:any){
      console.error(err)
      setError(String(err?.message||'تعذر إرسال الطلب حالياً. تأكد من البيانات وحاول مرة ثانية.'))
    }finally{setBusy(false)}
  }

  return <form onSubmit={submit} className="rounded-[30px] border border-white/10 bg-white/[.06] p-5 backdrop-blur md:p-6">
    {done&&<div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 className="mt-0.5 shrink-0" size={18}/><div><strong className="block">وصل طلبك إلى NEXORA.</strong><span className="mt-1 block font-medium text-emerald-100/70">تم تسجيله داخل CRM وبدأ مسار التحليل الآلي الآمن.</span></div></div>}
    {error&&<div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-100">{error}</div>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الاسم *</span><input name="name" required minLength={2} maxLength={120} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="اسمك"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الشركة / النشاط</span><input name="business" maxLength={160} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="اسم الشركة"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الدولة</span><input name="country" maxLength={100} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="العراق"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">البريد أو واتساب *</span><input name="contact" required minLength={3} maxLength={200} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="email@example.com أو +964..."/></label>
      <label className="block md:col-span-2"><span className="mb-2 block text-xs font-black text-slate-300">نوع المشروع</span><select name="service" className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1727] px-3 text-white outline-none focus:border-blue-400"><option value="">اختر الخدمة</option>{services.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="block md:col-span-2"><span className="mb-2 block text-xs font-black text-slate-300">احجيلنا عن الفكرة *</span><textarea name="message" required minLength={5} rows={5} maxLength={4000} className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="شنو تريد تبني أو تطور؟"/></label>
      <label className="hidden" aria-hidden="true">Website<input name="company_website" tabIndex={-1} autoComplete="off"/></label>
    </div>
    <button disabled={busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 font-black text-slate-950 transition hover:bg-blue-50 disabled:opacity-60">{busy?<><Loader2 size={18} className="animate-spin"/> جاري الإرسال…</>:<>إرسال الطلب <ArrowUpLeft size={18}/></>}</button>
    <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-slate-500">لا ترسل كلمات مرور أو مفاتيح API أو معلومات سرية عبر النموذج.</p>
  </form>
}
