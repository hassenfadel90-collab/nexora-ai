'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage(){
  const [ready,setReady]=useState(false)
  const [valid,setValid]=useState(false)
  const [password,setPassword]=useState('')
  const [confirm,setConfirm]=useState('')
  const [show,setShow]=useState(false)
  const [busy,setBusy]=useState(false)
  const [message,setMessage]=useState('')
  const [done,setDone]=useState(false)

  useEffect(()=>{
    ;(async()=>{
      const sb=createClient()
      const code=new URLSearchParams(window.location.search).get('code')
      if(code){
        const {error}=await sb.auth.exchangeCodeForSession(code)
        if(error){setMessage('رابط الاستعادة غير صالح أو منتهي الصلاحية.');setReady(true);return}
      }
      const {data}=await sb.auth.getSession()
      setValid(Boolean(data.session));setReady(true)
      if(!data.session)setMessage('افتح هذه الصفحة من رابط الاستعادة المرسل إلى بريدك.')
    })()
  },[])

  async function submit(e:FormEvent){
    e.preventDefault();if(busy||!valid)return
    if(password.length<8)return setMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل.')
    if(password!==confirm)return setMessage('كلمتا المرور غير متطابقتين.')
    setBusy(true);setMessage('')
    try{
      const sb=createClient();const {error}=await sb.auth.updateUser({password});if(error)throw error
      setDone(true);await sb.auth.signOut()
    }catch(err:any){setMessage(String(err?.message||err))}finally{setBusy(false)}
  }

  if(!ready)return <main className="grid min-h-screen place-items-center bg-[#f6f7f9]"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card"><Loader2 size={17} className="animate-spin"/> جارِ التحقق من رابط الاستعادة…</div></main>

  return <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-4 py-10"><div className="w-full max-w-xl rounded-[34px] border border-slate-200 bg-white p-7 shadow-soft md:p-10"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#07111f] text-lg font-black text-white">N</span><div><div className="text-[10px] font-black tracking-[.16em] text-[#0071e3]">NEXORA SECURITY</div><strong>Reset Password</strong></div></div>{done?<div className="mt-10 rounded-[26px] border border-emerald-100 bg-emerald-50 p-7 text-center"><CheckCircle2 size={34} className="mx-auto text-emerald-600"/><h1 className="mt-5 text-2xl font-black">تم تحديث كلمة المرور</h1><p className="mt-3 leading-7 text-slate-500">استخدم كلمة المرور الجديدة لتسجيل الدخول.</p><Link href="/login" className="btn-primary mt-6 w-full">العودة لتسجيل الدخول</Link></div>:<><div className="mt-10"><div className="eyebrow">ACCOUNT RECOVERY</div><h1 className="mt-5 text-3xl font-black">كلمة مرور جديدة</h1><p className="mt-3 leading-8 text-slate-500">اختر كلمة مرور قوية ومختلفة عن كلمات المرور التي تستخدمها في خدمات أخرى.</p></div>{message&&<div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold leading-7 text-amber-800">{message}</div>}{valid&&<form onSubmit={submit} className="mt-7 space-y-5"><label className="block"><span className="mb-2 block text-sm font-extrabold">كلمة المرور الجديدة</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><LockKeyhole size={18} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete="new-password" className="h-14 w-full bg-transparent outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><label className="block"><span className="mb-2 block text-sm font-extrabold">تأكيد كلمة المرور</span><input value={confirm} onChange={e=>setConfirm(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete="new-password" className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none"/></label><button disabled={busy} className="btn-primary h-14 w-full disabled:opacity-60">{busy?<><Loader2 size={18} className="animate-spin"/> جارِ الحفظ…</>:'حفظ كلمة المرور'}</button></form>}<div className="mt-6 text-center"><Link href="/login" className="text-sm font-extrabold text-slate-400 hover:text-[#0071e3]">العودة لتسجيل الدخول</Link></div></>}</div></main>
}
