'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff, Loader2, LockKeyhole, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const supabase = createClient()
      const normalized = email.trim().toLowerCase().replace('@gmai.com', '@gmail.com').replace('@gmial.com', '@gmail.com')
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalized, password })
      if (error) throw error
      if (!data.user) throw new Error('لم يتم إنشاء جلسة دخول.')
      const { data: profile, error: profileError } = await supabase.from('profiles').select('role,active').eq('id', data.user.id).maybeSingle()
      if (profileError) throw profileError
      if (!profile?.active) throw new Error('هذا الحساب غير مفعّل ضمن فريق NEXORA.')
      if (!['owner','admin','manager','sales','developer'].includes(profile.role)) throw new Error('الحساب لا يملك صلاحية دخول لوحة الفريق.')
      window.location.href = '/command'
    } catch (err: any) {
      const raw = String(err?.message || err || '')
      setMessage(/Invalid login credentials/i.test(raw) ? 'البريد أو كلمة المرور غير صحيحة.' : raw || 'تعذر تسجيل الدخول.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-soft lg:grid-cols-[.92fr_1.08fr]">
        <section className="order-2 p-7 md:p-12 lg:order-1 lg:p-14">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-500"><ArrowLeft size={16}/> العودة للموقع</Link>
          <div className="mt-16 max-w-md">
            <div className="eyebrow">SECURE ACCESS</div>
            <h1 className="mt-6 text-4xl font-black tracking-[-.03em] md:text-5xl">تسجيل دخول الإدارة والفريق</h1>
            <p className="mt-4 leading-8 text-slate-500">الدخول مخصص للحسابات المعتمدة فقط. الصلاحيات يتم التحقق منها من قاعدة البيانات بعد تسجيل الدخول.</p>
          </div>

          <form onSubmit={submit} className="mt-10 max-w-md space-y-5">
            <label className="block"><span className="mb-2 block text-sm font-extrabold">البريد الإلكتروني</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><Mail size={18} className="text-slate-400"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" className="h-14 w-full bg-transparent outline-none" placeholder="name@company.com" /></div></label>
            <label className="block"><span className="mb-2 block text-sm font-extrabold">كلمة المرور</span><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4"><LockKeyhole size={18} className="text-slate-400"/><input value={password} onChange={e=>setPassword(e.target.value)} type={show?'text':'password'} required minLength={8} autoComplete="current-password" className="h-14 w-full bg-transparent outline-none" placeholder="••••••••" /><button type="button" onClick={()=>setShow(v=>!v)} className="text-slate-400">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
            {message && <div className="rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">{message}</div>}
            <button disabled={loading} className="btn-primary h-14 w-full disabled:opacity-60">{loading?<><Loader2 className="animate-spin" size={18}/> جاري التحقق…</>:'تسجيل الدخول'}</button>
          </form>
        </section>

        <section className="order-1 relative min-h-[360px] overflow-hidden bg-[#07111f] p-8 text-white lg:order-2 lg:min-h-[760px] lg:p-12">
          <div className="absolute inset-0 opacity-25 grid-dots" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-xl font-black text-slate-950">N</span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.2em]">NEXORA AI</span></div>
            <div className="max-w-lg"><div className="text-xs font-black tracking-[.18em] text-blue-300">NEXORA COMMAND</div><h2 className="mt-5 text-4xl font-black leading-tight md:text-6xl">Your business.<br/>Under control.</h2><p className="mt-6 max-w-md text-base leading-8 text-slate-300">Projects, CRM, team, approvals, AI agents and automation in one secure operating system.</p></div>
          </div>
        </section>
      </div>
    </main>
  )
}
