'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Activity, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckSquare2, ChevronLeft, CircleDollarSign, FileText, Gauge, LayoutDashboard, LogOut, Menu, MessageSquareMore, Search, Settings, ShieldCheck, Sparkles, Users, Workflow } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Profile = { id:string; email:string; full_name:string|null; role:string; active:boolean }

const nav = [
  ['نظرة عامة','overview',LayoutDashboard],
  ['CRM / Leads','leads',Gauge],
  ['المشاريع','projects',BriefcaseBusiness],
  ['المهام','tasks',CheckSquare2],
  ['الفريق','team',Users],
  ['العروض','proposals',FileText],
  ['الفواتير','invoices',CircleDollarSign],
  ['AI Agents','agents',Bot],
  ['Automations','automations',Workflow],
  ['الموافقات','approvals',ShieldCheck],
  ['التحليلات','analytics',ChartNoAxesCombined],
  ['الإعدادات','settings',Settings],
] as const

export default function CommandPage() {
  const [profile,setProfile] = useState<Profile|null>(null)
  const [ready,setReady] = useState(false)
  const [active,setActive] = useState('overview')
  const [mobileOpen,setMobileOpen] = useState(false)
  const [stats,setStats] = useState({leads:0,projects:0,tasks:0,team:0})

  useEffect(()=>{
    let alive = true
    ;(async()=>{
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return window.location.replace('/login')
      const { data: p } = await supabase.from('profiles').select('id,email,full_name,role,active').eq('id',user.id).maybeSingle()
      if (!p?.active || !['owner','admin','manager','sales','developer'].includes(p.role)) {
        await supabase.auth.signOut(); return window.location.replace('/login')
      }
      const [leads,projects,tasks,team] = await Promise.all([
        supabase.from('leads').select('*',{count:'exact',head:true}),
        supabase.from('projects').select('*',{count:'exact',head:true}),
        supabase.from('tasks').select('*',{count:'exact',head:true}),
        supabase.from('profiles').select('*',{count:'exact',head:true}).eq('active',true),
      ])
      if (!alive) return
      setProfile(p as Profile)
      setStats({leads:leads.count||0,projects:projects.count||0,tasks:tasks.count||0,team:team.count||0})
      setReady(true)
    })()
    return ()=>{alive=false}
  },[])

  const roleLabel = useMemo(()=>({owner:'Owner',admin:'Admin',manager:'Manager',sales:'Sales',developer:'Developer'} as Record<string,string>)[profile?.role||'']||profile?.role||'', [profile])

  async function logout(){ const supabase=createClient(); await supabase.auth.signOut(); window.location.href='/login' }

  if (!ready) return <main className="grid min-h-screen place-items-center"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0071e3]"/> جاري تجهيز NEXORA Command…</div></main>

  return (
    <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 right-0 z-50 w-[280px] border-l border-slate-200 bg-white p-4 transition-transform lg:static lg:translate-x-0 ${mobileOpen?'translate-x-0':'translate-x-full'}`}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-2 py-2">
              <Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#07111f] text-lg font-black text-white">N</span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.17em]">NEXORA <b className="text-[#0071e3]">AI</b></span></Link>
              <button className="lg:hidden" onClick={()=>setMobileOpen(false)}><ChevronLeft/></button>
            </div>
            <div className="mx-2 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] font-black tracking-[.16em] text-[#0071e3]">NEXORA COMMAND</div><div className="mt-1 text-sm font-extrabold">Operations Workspace</div></div>
            <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">{nav.map(([label,key,Icon])=><button key={key} onClick={()=>{setActive(key);setMobileOpen(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-right text-sm font-extrabold transition ${active===key?'bg-blue-50 text-[#0071e3]':'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}><Icon size={18}/><span>{label}</span></button>)}</nav>
            <div className="mt-4 border-t border-slate-100 pt-4"><div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-[#0071e3] shadow-card">{(profile?.full_name||profile?.email||'N').slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{profile?.full_name||profile?.email}</strong><span className="text-xs font-bold text-slate-400">{roleLabel}</span></div><button onClick={logout} title="تسجيل الخروج" className="text-slate-400 hover:text-red-600"><LogOut size={17}/></button></div></div>
          </div>
        </aside>

        {mobileOpen && <button aria-label="إغلاق القائمة" onClick={()=>setMobileOpen(false)} className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"/>}

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-[76px] items-center gap-3 border-b border-slate-200 bg-white/88 px-4 backdrop-blur-xl md:px-6 lg:px-8">
            <button onClick={()=>setMobileOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden"><Menu size={18}/></button>
            <div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">NEXORA / COMMAND</div><h1 className="text-lg font-black">{nav.find(x=>x[1]===active)?.[0]}</h1></div>
            <button className="mr-auto hidden min-w-[340px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right text-sm font-bold text-slate-400 md:flex"><Search size={17}/><span className="flex-1">ابحث في NEXORA…</span><kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px]">⌘ K</kbd></button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-violet-600"><Sparkles size={18}/></button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white"><MessageSquareMore size={18}/></button>
          </header>

          <div className="p-4 md:p-6 lg:p-8">
            {active==='overview' ? <Overview stats={stats} profile={profile}/> : <Placeholder title={nav.find(x=>x[1]===active)?.[0]||active}/>} 
          </div>
        </section>
      </div>
    </main>
  )
}

function Overview({stats,profile}:{stats:{leads:number;projects:number;tasks:number;team:number};profile:Profile|null}){
  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">EXECUTIVE OVERVIEW</div><h2 className="mt-5 text-3xl font-black tracking-[-.025em] md:text-4xl">أهلاً {profile?.full_name||''}</h2><p className="mt-3 text-sm font-medium leading-7 text-slate-500">هذه نظرة مباشرة على العمل الحالي. كل البيانات هنا تُقرأ من Supabase بدل أرقام تجريبية.</p></div><div className="flex gap-2"><button className="btn-primary">+ مشروع جديد</button><button className="btn-secondary">تقرير سريع</button></div></div></section>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[[stats.leads,'Leads',Gauge],[stats.projects,'Projects',BriefcaseBusiness],[stats.tasks,'Tasks',CheckSquare2],[stats.team,'Team',Users]].map(([value,label,Icon]:any)=><article key={label} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-start justify-between"><div><span className="text-xs font-extrabold text-slate-400">{label}</span><strong className="mt-3 block font-[var(--font-inter)] text-4xl font-black">{value}</strong></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0071e3]"><Icon size={19}/></div></div></article>)}</section>
    <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]"><article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><div><span className="text-xs font-black tracking-[.14em] text-[#0071e3]">BUSINESS PULSE</span><h3 className="mt-2 text-xl font-black">نشاط العمل</h3></div><Activity className="text-slate-300"/></div><div className="mt-10 flex h-56 items-end gap-3">{[58,72,44,88,66,76,52,92,68,84].map((h,i)=><i key={i} style={{height:`${h}%`}} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#0071e3] to-[#86c1ff]"/>)}</div></article><article className="rounded-[28px] border border-slate-200 bg-[#07111f] p-6 text-white shadow-card"><Bot className="text-blue-300"/><div className="mt-16 text-xs font-black tracking-[.14em] text-blue-300">AI OPERATIONS</div><h3 className="mt-3 text-2xl font-black">NEXORA Assistant</h3><p className="mt-3 text-sm leading-7 text-slate-300">المساعد سيجمع إجراءات الفريق، تحذيرات الأنظمة والفرص المقترحة في مكان واحد.</p><button className="mt-8 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950">فتح المساعد</button></article></section>
  </div>
}

function Placeholder({title}:{title:string}){
  return <div className="mx-auto max-w-[1500px]"><section className="min-h-[520px] rounded-[28px] border border-dashed border-slate-300 bg-white p-8 shadow-card"><div className="eyebrow">NEXORA V2</div><h2 className="mt-6 text-3xl font-black">{title}</h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-500">تم تجهيز الهيكل الجديد لهذه الصفحة. الخطوة التالية تربط مكونات الصفحة مباشرة بالجداول والـRPC الحالية في Supabase بدون إعادة اختراع البيانات.</p></section></div>
}
