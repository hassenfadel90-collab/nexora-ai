'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/base-path'

export default function ClientActivatePage(){
  const [email,setEmail]=useState('')
  const [code,setCode]=useState('')
  const [password,setPassword]=useState('')
  const [show,setShow]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [done,setDone]=useState(false)

  async function submit(e:FormEvent){
    e.preventDefault();if(busy)return;setBusy(true);setError('')
    const normalized=email.trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com')
    try{
      const sb=createClient()
      const {data,error}=await sb.functions.invoke('client-activate',{body:{email:normalized,code:code.trim().toUpperCase(),password}})
      if(error)throw error
      if(!data?.ok)throw new Error(data?.error||'تعذر تفعيل الحساب.')
      setDone(true)
      const sign=await sb.auth.signInWithPassword({email:normalized,password})
      if(sign.error)throw sign.error
      setTimeout(()=>{location.href=withBasePath('/portal')},700)
    }catch(err:any){
      const raw=String(err?.message||err||'')
      if(/invalid or expired/i.test(raw))setError('كود التفعيل غير صحيح أو منتهي الصلاحية.')
      else if(/too many attempts/i.test(raw))setError('محاولات كثيرة. حاول مرة أخرى لاحقًا.')
      else setError(raw||'تعذر تفعيل الحساب.')
    }finally{setBusy(false)}
  }

  return <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-4 py-10"><div className="w-full max-w-2xl rounded-[34px] border border-slate-200 bg-white p-7 shadow-soft md:p-10"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-white p-1 shadow-card"><img src={withBasePath('/nexora-mark.svg')} alt="NEXORA" className="h-10 w-10"/></span><div><div className="text-[10px] font-black tracking-[.16em] text-[#0071e3]">NEXORA PORTAL</div><strong className="text-sm">Client Activation</strong></div></div>{done?<div className="mt-10 rounded-[26px] border border-emerald-100 bg-emerald-50 p-7 text-center"><CheckCircle2 size={34} className="mx-auto text-emerald-600"/><h1 className="mt-5 text-2xl font-black">تم تفعيل الحساب</h1><p className="mt-3 leading-7 text-slate-500">جارِ تسجيل الدخول وفتح بوابة مشروعك…</p></div>:<><div className="mt-10"><div className="eyebrow">ACTIVATION CODE</div><h1 className="mt-5 text-3xl font-black md:text-4xl">فعّل حساب العميل</h1><p className="mt-3 leading-8 text-slate-500">استخدم البريد وكود التفعيل الذي أرسله فريق NEXORA. الكود مؤقت ويُستخدم مرة واحدة.</p></div><form onSubmit={submit} className="mt-8 space-y-5"><label className="block"><span className="mb-2 block text-sm font-extrabold">البريد الإلكتروني</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><Mail size={18} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" className="h-14 w-full bg-transparent outline-none"/></div></label><label className="block"><span className="mb-2 block text-sm font-extrabold">كود التفعيل</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><KeyRound size={18} className="text-slate-400"/><input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} required minLength={10} maxLength={24} autoComplete="one-time-code" className="h-14 w-full bg-transparent font-[var(--font-inter)] font-black tracking-wider outline-none" placeholder="NX-XXXX-XXXX-XXXX"/></div></label><label className="block"><span className="mb-2 block text-sm font-extrabold">كلمة المرور الجديدة</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><LockKeyhole size={18} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete="new-password" className="h-14 w-full bg-transparent outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}<button disabled={busy} className="btn-primary h-14 w-full disabled:opacity-60">{busy?<><Loader2 size={18} className="animate-spin"/> جارِ التفعيل…</>:'تفعيل الحساب'}</button></form><div className="mt-6 flex justify-center gap-4 text-sm font-bold text-slate-400"><Link href="/portal/login" className="hover:text-slate-900">لدي حساب بالفعل</Link><span>•</span><Link href="/" className="hover:text-slate-900">الموقع الرئيسي</Link></div></>}</div></main>
}
