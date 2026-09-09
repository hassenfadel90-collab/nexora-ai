'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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
    if(String(fd.get('website')||'').trim())return
    setBusy(true);setError('')
    try{
      const sb=createClient()
      const {error}=await sb.rpc('submit_public_lead',{
        p_name:String(fd.get('name')||''),
        p_business:String(fd.get('business')||'')||null,
        p_country:String(fd.get('country')||'')||null,
        p_contact:String(fd.get('contact')||''),
        p_service:String(fd.get('service')||'')||null,
        p_message:String(fd.get('message')||'')||null,
      })
      if(error)throw error
      form.reset();setDone(true)
    }catch(err:any){
      console.error(err)
      setError('تعذر إرسال الطلب حالياً. تأكد من البيانات وحاول مرة ثانية.')
    }finally{setBusy(false)}
  }

  return <form onSubmit={submit} className="rounded-[30px] border border-white/10 bg-white/[.06] p-5 backdrop-blur md:p-6">
    {done&&<div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-bold text-emerald-100"><CheckCircle2 className="mt-0.5 shrink-0" size={18}/><div><strong className="block">وصل طلبك إلى NEXORA.</strong><span className="mt-1 block font-medium text-emerald-100/70">تم تسجيله داخل CRM وسيتم مراجعته من الفريق.</span></div></div>}
    {error&&<div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm font-bold text-red-100">{error}</div>}
    <div className="grid gap-4 md:grid-cols-2">
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الاسم *</span><input name="name" required minLength={2} maxLength={120} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="اسمك"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الشركة / النشاط</span><input name="business" maxLength={160} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="اسم الشركة"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">الدولة</span><input name="country" maxLength={100} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="العراق"/></label>
      <label className="block"><span className="mb-2 block text-xs font-black text-slate-300">البريد أو واتساب *</span><input name="contact" required maxLength={180} className="h-12 w-full rounded-xl border border-white/10 bg-white/10 px-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="email@example.com أو +964..."/></label>
      <label className="block md:col-span-2"><span className="mb-2 block text-xs font-black text-slate-300">نوع المشروع</span><select name="service" className="h-12 w-full rounded-xl border border-white/10 bg-[#0b1727] px-3 text-white outline-none focus:border-blue-400"><option value="">اختر الخدمة</option>{services.map(s=><option key={s}>{s}</option>)}</select></label>
      <label className="block md:col-span-2"><span className="mb-2 block text-xs font-black text-slate-300">احجيلنا عن الفكرة</span><textarea name="message" rows={5} maxLength={3000} className="w-full resize-none rounded-xl border border-white/10 bg-white/10 p-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-400" placeholder="شنو تريد تبني أو تطور؟"/></label>
      <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    </div>
    <button disabled={busy} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 font-black text-slate-950 transition hover:bg-blue-50 disabled:opacity-60">{busy?<><Loader2 size={18} className="animate-spin"/> جاري الإرسال…</>:<>إرسال الطلب <ArrowUpLeft size={18}/></>}</button>
    <p className="mt-3 text-center text-[11px] font-semibold leading-5 text-slate-500">لا ترسل كلمات مرور أو مفاتيح API أو معلومات سرية عبر النموذج.</p>
  </form>
}
