'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Mail, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/base-path'

const normalizeEmail=(value:string)=>value.trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com')

export default function LoginPage() {
  const [mode,setMode]=useState<'signin'|'activate'>('signin')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [fullName,setFullName]=useState('')
  const [show,setShow]=useState(false)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [success,setSuccess]=useState('')

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    if(params.get('mode')==='activate')setMode('activate')
    const supplied=params.get('email')
    if(supplied)setEmail(normalizeEmail(supplied))
  },[])

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setMessage('');setSuccess('')
    const normalized=normalizeEmail(email)
    try{
      const supabase=createClient()
      if(mode==='activate'){
        const access=await supabase.from('team_access').select('email,active,role').ilike('email',normalized).eq('active',true).maybeSingle()
        if(access.error)throw access.error
        if(!access.data)throw new Error('هذا البريد غير مضاف إلى فريق NEXORA. اطلب من Owner أو Admin إضافته أولاً.')
        const {data,error}=await supabase.auth.signUp({email:normalized,password,options:{data:{full_name:fullName.trim()||null},emailRedirectTo:`${window.location.origin}${withBasePath('/login')}`}})
        if(error)throw error
        if(data.session){window.location.href=withBasePath('/command');return}
        setSuccess('تم إنشاء الحساب. إذا كان تأكيد البريد مفعلاً، افتح رسالة Supabase في بريدك ثم ارجع وسجّل الدخول.')
        setMode('signin');setPassword('')
        return
      }

      const {data,error}=await supabase.auth.signInWithPassword({email:normalized,password})
      if(error)throw error
      if(!data.user)throw new Error('لم يتم إنشاء جلسة دخول.')
      const {data:profile,error:profileError}=await supabase.from('profiles').select('role,active').eq('id',data.user.id).maybeSingle()
      if(profileError)throw profileError
      if(!profile?.active||!['owner','admin','manager','sales','developer'].includes(profile.role)){
        await supabase.auth.signOut()
        throw new Error('الحساب غير مفعّل ضمن فريق NEXORA أو لا يملك صلاحية دخول.')
      }
      window.location.href=withBasePath('/command')
    }catch(err:any){
      const raw=String(err?.message||err||'')
      if(/Invalid login credentials/i.test(raw))setMessage('البريد أو كلمة المرور غير صحيحة.')
      else if(/Email not confirmed/i.test(raw))setMessage('البريد غير مؤكد بعد. افتح رسالة التأكيد في بريدك ثم حاول مجددًا.')
      else if(/already registered|already been registered/i.test(raw))setMessage('يوجد حساب بهذا البريد بالفعل. استخدم تسجيل الدخول أو استعادة كلمة المرور.')
      else setMessage(raw||'تعذر إكمال العملية.')
    }finally{setLoading(false)}
  }

  async function forgotPassword(){
    const normalized=normalizeEmail(email)
    if(!normalized.includes('@')){setMessage('اكتب بريدك أولاً ثم اضغط نسيت كلمة المرور.');return}
    setLoading(true);setMessage('');setSuccess('')
    try{
      const sb=createClient()
      const {error}=await sb.auth.resetPasswordForEmail(normalized,{redirectTo:`${window.location.origin}${withBasePath('/reset-password')}`})
      if(error)throw error
      setSuccess('تم إرسال رابط استعادة كلمة المرور إذا كان البريد مسجلاً.')
    }catch(err:any){setMessage(String(err?.message||err))}finally{setLoading(false)}
  }

  return <main className="grid min-h-screen place-items-center px-4 py-10">
    <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft lg:grid-cols-[.92fr_1.08fr]">
      <section className="order-2 p-7 md:p-12 lg:order-1 lg:p-14">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-500"><ArrowLeft size={16}/> العودة للموقع</Link>
        <div className="mt-12 max-w-md"><div className="eyebrow">SECURE ACCESS</div><h1 className="mt-6 text-4xl font-black tracking-[-.03em] md:text-5xl">NEXORA Command</h1><p className="mt-4 leading-8 text-slate-500">دخول الإدارة والفريق فقط. الصلاحيات تُقرأ من قاعدة البيانات ولا تعتمد على إخفاء عناصر الواجهة.</p></div>

        <div className="mt-8 flex max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-1"><button onClick={()=>{setMode('signin');setMessage('');setSuccess('')}} className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-black ${mode==='signin'?'bg-white text-slate-950 shadow-card':'text-slate-400'}`}>تسجيل الدخول</button><button onClick={()=>{setMode('activate');setMessage('');setSuccess('')}} className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-black ${mode==='activate'?'bg-white text-slate-950 shadow-card':'text-slate-400'}`}>تفعيل حساب الفريق</button></div>

        <form onSubmit={submit} className="mt-7 max-w-md space-y-5">
          {mode==='activate'&&<label className="block"><span className="mb-2 block text-sm font-extrabold">الاسم</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><UserPlus size={18} className="text-slate-400"/><input value={fullName} onChange={e=>setFullName(e.target.value)} maxLength={100} autoComplete="name" className="h-14 w-full bg-transparent outline-none" placeholder="اسم الموظف"/></div></label>}
          <label className="block"><span className="mb-2 block text-sm font-extrabold">البريد الإلكتروني</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><Mail size={18} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" className="h-14 w-full bg-transparent outline-none" placeholder="name@company.com"/></div></label>
          <label className="block"><span className="mb-2 block text-sm font-extrabold">{mode==='activate'?'كلمة مرور جديدة':'كلمة المرور'}</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><LockKeyhole size={18} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete={mode==='activate'?'new-password':'current-password'} className="h-14 w-full bg-transparent outline-none" placeholder="8 أحرف أو أكثر"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
          {message&&<div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold leading-7 text-red-700">{message}</div>}
          {success&&<div className="flex gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold leading-7 text-emerald-700"><CheckCircle2 className="mt-1 shrink-0" size={17}/><span>{success}</span></div>}
          <button disabled={loading} className="btn-primary h-14 w-full disabled:opacity-60">{loading?<><Loader2 className="animate-spin" size={18}/> جاري التحقق…</>:mode==='signin'?'تسجيل الدخول':'إنشاء وتفعيل الحساب'}</button>
          {mode==='signin'&&<button type="button" disabled={loading} onClick={forgotPassword} className="w-full py-2 text-sm font-extrabold text-slate-400 hover:text-[#0071e3]">نسيت كلمة المرور؟</button>}
        </form>
      </section>

      <section className="order-1 relative min-h-[360px] overflow-hidden bg-[#07111f] p-8 text-white lg:order-2 lg:min-h-[760px] lg:p-12"><div className="absolute inset-0 opacity-25 grid-dots"/><div className="relative flex h-full flex-col justify-between"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white p-1 text-xl font-black text-slate-950"><img src={withBasePath('/nexora-mark.svg')} alt="NEXORA" className="h-10 w-10"/></span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.2em]">NEXORA AI</span></div><div className="max-w-lg"><div className="text-xs font-black tracking-[.18em] text-blue-300">NEXORA COMMAND</div><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Your business.<br/>Under control.</h2><p className="mt-6 max-w-md text-base leading-8 text-slate-300">Projects, CRM, clients, team, approvals, files, AI agents and automation in one secure operating system.</p></div></div></section>
    </div>
  </main>
}
