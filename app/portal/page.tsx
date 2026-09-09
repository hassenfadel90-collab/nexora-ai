'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BriefcaseBusiness, CheckCircle2, FileText, LogOut, MessageSquareMore, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ClientProfile = { id:string; email:string; full_name:string|null; active:boolean }
type ClientProject = { id:string; title:string; status:string; deadline:string|null; health_score:number|null }

export default function PortalPage(){
  const [profile,setProfile]=useState<ClientProfile|null>(null)
  const [loading,setLoading]=useState(true)
  const [projects,setProjects]=useState<ClientProject[]>([])

  useEffect(()=>{
    ;(async()=>{
      const supabase=createClient()
      const {data:{user}}=await supabase.auth.getUser()
      if(!user){setLoading(false);return}
      const {data:p}=await supabase.from('client_profiles').select('id,email,full_name,active').eq('id',user.id).maybeSingle()
      if(!p?.active){setLoading(false);return}
      setProfile(p as ClientProfile)
      const {data:rows}=await supabase.from('projects').select('id,title,status,deadline,health_score').order('created_at',{ascending:false}).limit(8)
      setProjects((rows||[]) as ClientProject[])
      setLoading(false)
    })()
  },[])

  async function logout(){const supabase=createClient();await supabase.auth.signOut();location.href='/portal'}

  if(loading)return <main className="grid min-h-screen place-items-center"><div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card">جاري فتح NEXORA Portal…</div></main>

  if(!profile)return <main className="grid min-h-screen place-items-center px-4"><div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-soft md:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#07111f] text-xl font-black text-white">N</div><div className="mt-7 text-xs font-black tracking-[.18em] text-[#0071e3]">NEXORA PORTAL</div><h1 className="mt-4 text-3xl font-black">بوابة العملاء</h1><p className="mt-4 leading-8 text-slate-500">سجّل الدخول بحساب العميل المعتمد لمتابعة مشاريعك وملفاتك وموافقاتك.</p><div className="mt-7 flex flex-wrap justify-center gap-2"><Link href="/portal/login" className="btn-primary">تسجيل دخول العميل</Link><Link href="/" className="btn-secondary">العودة للموقع</Link></div></div></main>

  return <main className="min-h-screen bg-[#f6f7f9]">
    <header className="border-b border-slate-200 bg-white"><div className="container-shell flex min-h-[76px] items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#07111f] font-black text-white">N</span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.16em]">NEXORA <b className="text-[#0071e3]">PORTAL</b></span></Link><div className="flex items-center gap-3"><div className="hidden text-left sm:block"><strong className="block text-sm">{profile.full_name||profile.email}</strong><span className="text-xs font-bold text-slate-400">Client</span></div><button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500"><LogOut size={17}/></button></div></div></header>
    <div className="container-shell py-8 md:py-12">
      <section className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-card md:p-10"><div className="eyebrow">CLIENT WORKSPACE</div><h1 className="mt-5 text-3xl font-black md:text-4xl">أهلاً {profile.full_name||''}</h1><p className="mt-3 max-w-2xl leading-8 text-slate-500">تابع المشاريع، الموافقات، الملفات والتحديثات من مكان واحد.</p></section>
      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[[projects.length,'المشاريع',BriefcaseBusiness],['0','موافقات معلقة',ShieldCheck],['0','ملفات جديدة',FileText],['0','رسائل جديدة',MessageSquareMore]].map(([v,l,Icon]:any)=><article key={l} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Icon size={19} className="text-[#0071e3]"/><strong className="mt-5 block font-[var(--font-inter)] text-3xl font-black">{v}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{l}</span></article>)}</section>
      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">مشاريعي</h2><CheckCircle2 size={20} className="text-emerald-500"/></div><div className="mt-5 space-y-3">{projects.length?projects.map(p=>{const health=Math.min(100,Math.max(0,Number(p.health_score??0)));return <article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"><div><strong className="block">{p.title}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{p.status} {p.deadline?`• ${p.deadline}`:''}</span></div><div className="min-w-[180px]"><div className="mb-2 flex justify-between text-xs font-bold text-slate-400"><span>Health</span><span>{p.health_score==null?'—':`${health}%`}</span></div><div className="h-2 rounded-full bg-slate-200">{p.health_score!=null&&<i style={{width:`${health}%`}} className="block h-full rounded-full bg-[#0071e3]"/>}</div></div></article>}):<div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-400">لا توجد مشاريع متاحة لهذا الحساب حالياً.</div>}</div></section>
    </div>
  </main>
}
