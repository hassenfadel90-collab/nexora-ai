'use client'

import { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, LockKeyhole, Mail, ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/base-path'

const allowedRoles=['owner','admin','manager','sales','developer']
const normalizeEmail=(value:string)=>value.trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com')

export default function LoginPage() {
  const [mode,setMode]=useState<'signin'|'activate'>('signin')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [fullName,setFullName]=useState('')
  const [show,setShow]=useState(false)
  const [remember,setRemember]=useState(true)
  const [loading,setLoading]=useState(false)
  const [message,setMessage]=useState('')
  const [success,setSuccess]=useState('')

  useEffect(()=>{
    let alive=true
    const params=new URLSearchParams(window.location.search)
    if(params.get('mode')==='activate')setMode('activate')
    const supplied=params.get('email')
    const remembered=localStorage.getItem('nexora-login-email')||''
    if(supplied)setEmail(normalizeEmail(supplied));else if(remembered)setEmail(normalizeEmail(remembered))

    ;(async()=>{
      try{
        const sb=createClient()
        const {data:{session}}=await sb.auth.getSession()
        if(!session?.user||!alive)return
        const {data:profile}=await sb.from('profiles').select('role,active').eq('id',session.user.id).maybeSingle()
        if(profile?.active&&allowedRoles.includes(profile.role))window.location.replace(withBasePath('/command'))
      }catch{}
    })()
    return()=>{alive=false}
  },[])

  async function validateStaff(userId:string){
    const sb=createClient()
    const {data:profile,error}=await sb.from('profiles').select('role,active').eq('id',userId).maybeSingle()
    if(error)throw new Error('تم تسجيل الدخول، لكن تعذر قراءة صلاحيات الحساب. أعد المحاولة بعد تحديث الصفحة.')
    if(!profile)throw new Error('الحساب موجود في Auth لكنه غير مربوط بملف فريق NEXORA.')
    if(!profile.active)throw new Error('هذا الحساب متوقف حالياً.')
    if(!allowedRoles.includes(profile.role))throw new Error('هذا الحساب لا يملك صلاحية دخول NEXORA Command.')
    return profile
  }

  async function submit(e:FormEvent){
    e.preventDefault();if(loading)return
    setLoading(true);setMessage('');setSuccess('')
    const normalized=normalizeEmail(email)
    try{
      const supabase=createClient()
      if(mode==='activate'){
        const access=await supabase.from('team_access').select('email,active,role').ilike('email',normalized).eq('active',true).maybeSingle()
        if(access.error)throw access.error
        if(!access.data)throw new Error('هذا البريد غير مضاف إلى فريق NEXORA. يجب أن يضيفه Owner أو Admin أولاً.')
        const redirect=`${window.location.origin}${withBasePath('/login')}`
        const {data,error}=await supabase.auth.signUp({email:normalized,password,options:{data:{full_name:fullName.trim()||null},emailRedirectTo:redirect}})
        if(error)throw error
        if(data.session&&data.user){await validateStaff(data.user.id);window.location.replace(withBasePath('/command'));return}
        setSuccess('تم إنشاء الحساب. إذا كان تأكيد البريد مفعلاً، افتح رسالة التأكيد ثم ارجع وسجّل الدخول.')
        setMode('signin');setPassword('')
        return
      }

      const {data,error}=await supabase.auth.signInWithPassword({email:normalized,password})
      if(error)throw error
      if(!data.user)throw new Error('لم يتم إنشاء جلسة دخول.')
      await validateStaff(data.user.id)
      if(remember)localStorage.setItem('nexora-login-email',normalized);else localStorage.removeItem('nexora-login-email')
      window.location.replace(withBasePath('/command'))
    }catch(err:any){
      const raw=String(err?.message||err||'')
      if(/Invalid login credentials/i.test(raw))setMessage('البريد أو كلمة المرور غير صحيحة. استخدم استعادة كلمة المرور إذا نسيتها.')
      else if(/Email not confirmed/i.test(raw))setMessage('البريد غير مؤكد بعد. افتح رسالة التأكيد في بريدك ثم حاول مجددًا.')
      else if(/already registered|already been registered/i.test(raw))setMessage('يوجد حساب بهذا البريد بالفعل. استخدم تسجيل الدخول أو استعادة كلمة المرور.')
      else setMessage(raw||'تعذر إكمال العملية.')
    }finally{setLoading(false)}
  }

  async function forgotPassword(){
    const normalized=normalizeEmail(email)
    if(!normalized.includes('@')){setMessage('اكتب بريدك أولاً ثم اضغط استعادة كلمة المرور.');return}
    setLoading(true);setMessage('');setSuccess('')
    try{
      const sb=createClient()
      const {error}=await sb.auth.resetPasswordForEmail(normalized,{redirectTo:`${window.location.origin}${withBasePath('/reset-password')}`})
      if(error)throw error
      setSuccess('تم إرسال رابط استعادة كلمة المرور إذا كان البريد مسجلاً.')
    }catch(err:any){setMessage(String(err?.message||err))}finally{setLoading(false)}
  }

  async function magicLink(){
    const normalized=normalizeEmail(email)
    if(!normalized.includes('@')){setMessage('اكتب بريدك أولاً.');return}
    setLoading(true);setMessage('');setSuccess('')
    try{
      const sb=createClient()
      const {error}=await sb.auth.signInWithOtp({email:normalized,options:{shouldCreateUser:false,emailRedirectTo:`${window.location.origin}${withBasePath('/login')}`}})
      if(error)throw error
      setSuccess('تم إرسال رابط دخول آمن إلى البريد إذا كان الحساب موجوداً.')
    }catch(err:any){setMessage(String(err?.message||err))}finally{setLoading(false)}
  }

  return <main className="grid min-h-screen place-items-center px-3 py-5 md:px-5 md:py-8">
    <div className="grid w-full max-w-[1180px] overflow-hidden rounded-[34px] border border-slate-200/80 bg-white shadow-[0_35px_100px_rgba(35,57,85,.13)] lg:grid-cols-[.93fr_1.07fr]">
      <section className="order-2 p-6 md:p-10 lg:order-1 lg:p-12">
        <div className="flex items-center justify-between"><Link href="/" className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500"><ArrowLeft size={15}/> العودة للموقع</Link><span className="flex items-center gap-2 text-[10px] font-black tracking-[.1em] text-emerald-600"><span className="brand-dot !h-1.5 !w-1.5"/> SECURE ACCESS</span></div>

        <div className="mt-10 max-w-md"><div className="eyebrow"><ShieldCheck size={14}/> NEXORA COMMAND</div><h1 className="mt-6 text-4xl font-black tracking-[-.04em] text-[#071428] md:text-5xl">دخول الإدارة والفريق.</h1><p className="mt-4 leading-8 text-slate-500">الدخول يتحقق من حساب Supabase ومن دور المستخدم الفعلي قبل فتح أي جزء من لوحة الإدارة.</p></div>

        <div className="mt-8 flex max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-1"><button type="button" onClick={()=>{setMode('signin');setMessage('');setSuccess('')}} className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-black transition ${mode==='signin'?'bg-white text-slate-950 shadow-card':'text-slate-400'}`}>تسجيل الدخول</button><button type="button" onClick={()=>{setMode('activate');setMessage('');setSuccess('')}} className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-black transition ${mode==='activate'?'bg-white text-slate-950 shadow-card':'text-slate-400'}`}>تفعيل حساب</button></div>

        <form onSubmit={submit} className="mt-7 max-w-md space-y-4">
          {mode==='activate'&&<label className="block"><span className="mb-2 block text-xs font-extrabold text-slate-600">الاسم</span><div className="flex items-center gap-3 rounded-[15px] border border-slate-200 bg-[#fbfcfe] px-4"><UserPlus size={17} className="text-slate-400"/><input value={fullName} onChange={e=>setFullName(e.target.value)} maxLength={100} autoComplete="name" className="min-h-[52px] w-full bg-transparent outline-none" placeholder="اسم الموظف"/></div></label>}
          <label className="block"><span className="mb-2 block text-xs font-extrabold text-slate-600">البريد الإلكتروني</span><div className="flex items-center gap-3 rounded-[15px] border border-slate-200 bg-[#fbfcfe] px-4"><Mail size={17} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" className="min-h-[52px] w-full bg-transparent outline-none" placeholder="name@company.com"/></div></label>
          <label className="block"><span className="mb-2 block text-xs font-extrabold text-slate-600">{mode==='activate'?'كلمة مرور جديدة':'كلمة المرور'}</span><div className="flex items-center gap-3 rounded-[15px] border border-slate-200 bg-[#fbfcfe] px-4"><LockKeyhole size={17} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete={mode==='activate'?'new-password':'current-password'} className="min-h-[52px] w-full bg-transparent outline-none" placeholder="8 أحرف أو أكثر"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-slate-400" aria-label={show?'إخفاء كلمة المرور':'إظهار كلمة المرور'}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>

          {mode==='signin'&&<label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-500"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} className="h-4 w-4"/> تذكّر البريد على هذا الجهاز</label>}
          {message&&<div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold leading-7 text-red-700">{message}</div>}
          {success&&<div className="flex gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold leading-7 text-emerald-700"><CheckCircle2 className="mt-1 shrink-0" size={17}/><span>{success}</span></div>}

          <button disabled={loading} className="btn-primary min-h-[52px] w-full disabled:opacity-60">{loading?<><Loader2 className="animate-spin" size={18}/> جاري التحقق…</>:mode==='signin'?'تسجيل الدخول':'إنشاء وتفعيل الحساب'}</button>
          {mode==='signin'&&<div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><button type="button" disabled={loading} onClick={forgotPassword} className="btn-secondary min-h-[46px] text-xs"><KeyRound size={16}/> استعادة كلمة المرور</button><button type="button" disabled={loading} onClick={magicLink} className="btn-secondary min-h-[46px] text-xs"><Mail size={16}/> Magic Link</button></div>}
        </form>
      </section>

      <section className="nx-dark order-1 relative min-h-[330px] overflow-hidden p-7 lg:order-2 lg:min-h-[720px] lg:p-11">
        <div className="absolute inset-0 nx-mesh opacity-[.08]"/>
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-[15px] bg-white p-1.5 shadow-soft"><img src={withBasePath('/nexora-mark.svg')} alt="NEXORA" className="h-full w-full"/></span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.2em]">NEXORA</span></div>
          <div className="max-w-lg py-8"><div className="nx-kicker text-blue-300">ONE PLATFORM. INFINITE POSSIBILITIES.</div><h2 className="mt-5 text-4xl font-black leading-[1.03] tracking-[-.04em] md:text-6xl">Your business.<br/>Under control.</h2><p className="mt-6 max-w-md text-base leading-8 text-slate-300">Projects, CRM, clients, team, approvals, files, AI agents and automation in one secure operating system.</p><div className="mt-8 grid gap-2 sm:grid-cols-2">{['Role-based access','Real Supabase data','Human approvals','AI & automation'].map((x,i)=><div key={x} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3 py-2.5 text-xs font-bold text-slate-200">{i===3?<Sparkles size={15} className="text-blue-300"/>:<CheckCircle2 size={15} className="text-emerald-400"/>}{x}</div>)}</div></div>
        </div>
      </section>
    </div>
  </main>
}
