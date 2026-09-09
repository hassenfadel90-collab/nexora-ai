'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckSquare2, CircleDollarSign, FileText, Gauge, LayoutDashboard, LogOut, Menu, MessageSquareMore, Search, Settings, ShieldCheck, Sparkles, Users, Workflow, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Profile = { id:string; email:string; full_name:string|null; role:string; active:boolean }

const items = [
  ['نظرة عامة','/command',LayoutDashboard],
  ['CRM / Leads','/command/leads',Gauge],
  ['المشاريع','/command/projects',BriefcaseBusiness],
  ['المهام','/command/tasks',CheckSquare2],
  ['الفريق','/command/team',Users],
  ['العروض','/command/proposals',FileText],
  ['الفواتير','/command/invoices',CircleDollarSign],
  ['AI Agents','/command/agents',Bot],
  ['Automations','/command/automations',Workflow],
  ['الموافقات','/command/approvals',ShieldCheck],
  ['التحليلات','/command/analytics',ChartNoAxesCombined],
  ['سجل النشاط','/command/activity',Activity],
  ['الإعدادات','/command/settings',Settings],
] as const

export function CommandShell({children}:{children:ReactNode}){
  const pathname = usePathname()
  const [profile,setProfile] = useState<Profile|null>(null)
  const [ready,setReady] = useState(false)
  const [mobile,setMobile] = useState(false)

  useEffect(()=>{
    let alive=true
    ;(async()=>{
      try{
        const supabase=createClient()
        const {data:{user}}=await supabase.auth.getUser()
        if(!user) return window.location.replace('/login')
        const {data:p,error}=await supabase.from('profiles').select('id,email,full_name,role,active').eq('id',user.id).maybeSingle()
        if(error || !p?.active || !['owner','admin','manager','sales','developer'].includes(p.role)){
          await supabase.auth.signOut(); return window.location.replace('/login')
        }
        if(alive){setProfile(p as Profile);setReady(true)}
      }catch{ window.location.replace('/login') }
    })()
    return()=>{alive=false}
  },[])

  const roleLabel=useMemo(()=>({owner:'Owner',admin:'Admin',manager:'Manager',sales:'Sales',developer:'Developer'} as Record<string,string>)[profile?.role||'']||'',[profile])
  const activeTitle=items.find(([,href])=>pathname===href)?.[0]||'NEXORA Command'

  async function logout(){const supabase=createClient();await supabase.auth.signOut();location.href='/login'}

  if(!ready)return <main className="grid min-h-screen place-items-center bg-[#f6f7f9]"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0071e3]"/> جاري تجهيز NEXORA Command…</div></main>

  return <main className="min-h-screen bg-[#f6f7f9] text-slate-950">
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 right-0 z-50 w-[286px] border-l border-slate-200 bg-white p-4 transition-transform duration-200 lg:static lg:translate-x-0 ${mobile?'translate-x-0':'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-2 py-2"><Link href="/" className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#07111f] text-lg font-black text-white">N</span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.17em]">NEXORA <b className="text-[#0071e3]">AI</b></span></Link><button onClick={()=>setMobile(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 lg:hidden"><X size={17}/></button></div>
          <div className="mx-2 mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="text-[10px] font-black tracking-[.16em] text-[#0071e3]">NEXORA COMMAND</div><div className="mt-1 text-sm font-extrabold">Operations Workspace</div></div>
          <nav className="mt-5 flex-1 space-y-1 overflow-y-auto pr-1">{items.map(([label,href,Icon])=>{const active=pathname===href;return <Link key={href} href={href} onClick={()=>setMobile(false)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-extrabold transition ${active?'bg-blue-50 text-[#0071e3]':'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}><Icon size={18}/><span>{label}</span></Link>})}</nav>
          <div className="mt-4 border-t border-slate-100 pt-4"><div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-[#0071e3] shadow-card">{(profile?.full_name||profile?.email||'N').slice(0,1).toUpperCase()}</div><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{profile?.full_name||profile?.email}</strong><span className="text-xs font-bold text-slate-400">{roleLabel}</span></div><button onClick={logout} title="تسجيل الخروج" className="text-slate-400 hover:text-red-600"><LogOut size={17}/></button></div></div>
        </div>
      </aside>
      {mobile&&<button aria-label="إغلاق القائمة" onClick={()=>setMobile(false)} className="fixed inset-0 z-40 bg-slate-950/20 lg:hidden"/>}
      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl md:px-6 lg:px-8"><button onClick={()=>setMobile(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 lg:hidden"><Menu size={18}/></button><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">NEXORA / COMMAND</div><h1 className="text-lg font-black">{activeTitle}</h1></div><button className="mr-auto hidden min-w-[340px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-right text-sm font-bold text-slate-400 md:flex"><Search size={17}/><span className="flex-1">ابحث في NEXORA…</span><kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px]">⌘ K</kbd></button><button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-violet-600"><Sparkles size={18}/></button><button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white"><MessageSquareMore size={18}/></button></header>
        <div className="p-4 md:p-6 lg:p-8">{children}</div>
      </section>
    </div>
  </main>
}
