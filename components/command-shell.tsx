'use client'

import { ReactNode, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckSquare2, CircleDollarSign, FileText, FolderOpen, Gauge, LayoutDashboard, LogOut, Menu, MessageSquareMore, Search, Settings, ShieldCheck, Sparkles, UserRoundCheck, Users, Workflow, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { NotificationsMenu } from '@/components/notifications-menu'
import { withBasePath } from '@/lib/base-path'

type Profile = { id:string; email:string; full_name:string|null; role:string; active:boolean }
type Role = 'owner'|'admin'|'manager'|'sales'|'developer'
type NavItem = { label:string; href:string; icon:any; roles:Role[] }
type NavGroup = { label:string; items:NavItem[] }

const allRoles:Role[]=['owner','admin','manager','sales','developer']
const management:Role[]=['owner','admin','manager']
const accessAdmins:Role[]=['owner','admin']

const groups:NavGroup[] = [
  {label:'COMMAND',items:[
    {label:'نظرة عامة',href:'/command',icon:LayoutDashboard,roles:allRoles},
    {label:'AI Agents',href:'/command/agents',icon:Bot,roles:['owner','admin','manager','developer']},
    {label:'Automations',href:'/command/automations',icon:Workflow,roles:['owner','admin','manager','developer']},
  ]},
  {label:'SALES',items:[
    {label:'CRM / Leads',href:'/command/leads',icon:Gauge,roles:['owner','admin','manager','sales']},
    {label:'العملاء',href:'/command/clients',icon:UserRoundCheck,roles:management},
    {label:'العروض',href:'/command/proposals',icon:FileText,roles:['owner','admin','manager','sales']},
    {label:'الفواتير',href:'/command/invoices',icon:CircleDollarSign,roles:['owner','admin','manager','sales']},
  ]},
  {label:'DELIVERY',items:[
    {label:'المشاريع',href:'/command/projects',icon:BriefcaseBusiness,roles:allRoles},
    {label:'المهام',href:'/command/tasks',icon:CheckSquare2,roles:allRoles},
    {label:'الملفات',href:'/command/files',icon:FolderOpen,roles:allRoles},
    {label:'الرسائل',href:'/command/messages',icon:MessageSquareMore,roles:allRoles},
  ]},
  {label:'MANAGEMENT',items:[
    {label:'الفريق',href:'/command/team',icon:Users,roles:accessAdmins},
    {label:'الموافقات',href:'/command/approvals',icon:ShieldCheck,roles:management},
    {label:'التحليلات',href:'/command/analytics',icon:ChartNoAxesCombined,roles:management},
    {label:'سجل النشاط',href:'/command/activity',icon:Activity,roles:['owner','admin','manager','developer']},
    {label:'الإعدادات',href:'/command/settings',icon:Settings,roles:accessAdmins},
  ]},
]
const items=groups.flatMap(group=>group.items)

export function CommandShell({children}:{children:ReactNode}){
  const pathname = usePathname()
  const [profile,setProfile] = useState<Profile|null>(null)
  const [ready,setReady] = useState(false)
  const [mobile,setMobile] = useState(false)
  const [searchOpen,setSearchOpen] = useState(false)
  const [query,setQuery] = useState('')

  useEffect(()=>{
    let alive=true
    ;(async()=>{
      try{
        const supabase=createClient()
        const {data:{user},error:userError}=await supabase.auth.getUser()
        if(userError||!user){window.location.replace(withBasePath('/login'));return}
        const {data:p,error}=await supabase.from('profiles').select('id,email,full_name,role,active').eq('id',user.id).maybeSingle()
        const allowed=['owner','admin','manager','sales','developer']
        if(error||!p?.active||!allowed.includes(p.role)){
          await supabase.auth.signOut()
          window.location.replace(withBasePath('/login'))
          return
        }
        if(alive){setProfile(p as Profile);setReady(true)}
      }catch{
        window.location.replace(withBasePath('/login'))
      }
    })()
    return()=>{alive=false}
  },[])

  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setSearchOpen(v=>!v)}
      if(e.key==='Escape'){setSearchOpen(false);setMobile(false)}
    }
    window.addEventListener('keydown',onKey)
    return()=>window.removeEventListener('keydown',onKey)
  },[])

  const role=(profile?.role||'') as Role
  const visibleGroups=useMemo(()=>groups.map(group=>({...group,items:group.items.filter(item=>item.roles.includes(role))})).filter(group=>group.items.length),[role])
  const visibleItems=useMemo(()=>visibleGroups.flatMap(group=>group.items),[visibleGroups])
  const roleLabel=useMemo(()=>({owner:'Owner',admin:'Admin',manager:'Manager',sales:'Sales',developer:'Developer'} as Record<string,string>)[profile?.role||'']||'',[profile])
  const isActive=(href:string)=> pathname===href || pathname.endsWith(href) || (href==='/command'&&/\/command\/?$/.test(pathname))
  const activeTitle=items.find(x=>isActive(x.href))?.label||'NEXORA Command'
  const results=useMemo(()=>{const q=query.trim().toLowerCase();return q?visibleItems.filter(x=>x.label.toLowerCase().includes(q)||x.href.includes(q)):visibleItems},[query,visibleItems])

  useEffect(()=>{
    if(!ready||!profile)return
    const known=items.find(x=>isActive(x.href))
    if(known&&!known.roles.includes(role))window.location.replace(withBasePath('/command'))
  },[ready,profile,pathname,role])

  async function logout(){
    const supabase=createClient()
    await supabase.auth.signOut()
    window.location.replace(withBasePath('/login'))
  }

  if(!ready)return <main className="grid min-h-screen place-items-center bg-[#f6f8fc]"><div className="nx-card-soft flex items-center gap-3 px-5 py-4 font-bold text-slate-500"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0071e3]"/> جاري تجهيز NEXORA Command…</div></main>

  return <main className="min-h-screen bg-[#f6f8fc] text-[#071428]">
    <div className="flex min-h-screen items-start">
      <aside className={`fixed inset-y-0 right-0 z-50 w-[270px] border-l border-slate-200/80 bg-white/95 p-3.5 shadow-[0_0_45px_rgba(40,61,89,.05)] backdrop-blur-xl transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${mobile?'translate-x-0':'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-2 py-2">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-slate-200 bg-white p-1.5 shadow-card"><img src={withBasePath('/nexora-mark.svg')} alt="NEXORA" className="h-full w-full"/></span>
              <span><strong className="block font-[var(--font-inter)] text-[14px] font-black tracking-[.19em]">NEXORA</strong><small className="mt-0.5 block text-[9px] font-black tracking-[.14em] text-[#0071e3]">COMMAND</small></span>
            </Link>
            <button onClick={()=>setMobile(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 lg:hidden" aria-label="إغلاق القائمة"><X size={17}/></button>
          </div>

          <div className="mx-2 mt-4 rounded-[17px] border border-slate-200/80 bg-gradient-to-br from-[#f8fbff] to-white p-3.5">
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[.13em] text-[#0071e3]"><span className="brand-dot !h-1.5 !w-1.5"/> OPERATIONS OS</div>
            <div className="mt-1.5 text-sm font-black">Agency Workspace</div>
            <div className="mt-1 text-[10px] font-bold text-slate-400">Secure · Role based</div>
          </div>

          <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-1 pb-2">
            {visibleGroups.map(group=><div key={group.label} className="mb-4"><div className="px-3 pb-1.5 text-[9px] font-black tracking-[.16em] text-slate-300">{group.label}</div><div className="space-y-1">{group.items.map(({label,href,icon:Icon})=>{const active=isActive(href);return <Link key={href} href={href} onClick={()=>setMobile(false)} className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13px] font-extrabold transition ${active?'bg-[#eaf3ff] text-[#0068cf] shadow-[inset_-3px_0_0_#0071e3]':'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}><Icon size={17}/><span>{label}</span></Link>})}</div></div>)}
          </nav>

          <div className="mt-2 border-t border-slate-100 pt-3">
            <div className="flex items-center gap-3 rounded-[17px] bg-slate-50 p-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-[#0071e3] shadow-card">{(profile?.full_name||profile?.email||'N').slice(0,1).toUpperCase()}</div>
              <div className="min-w-0 flex-1"><strong className="block truncate text-[12px]">{profile?.full_name||profile?.email}</strong><span className="text-[10px] font-bold text-slate-400">{roleLabel}</span></div>
              <button onClick={logout} title="تسجيل الخروج" aria-label="تسجيل الخروج" className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-white hover:text-red-600"><LogOut size={17}/></button>
            </div>
          </div>
        </div>
      </aside>

      {mobile&&<button aria-label="إغلاق القائمة" onClick={()=>setMobile(false)} className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] lg:hidden"/>}

      <section className="min-w-0 flex-1 self-stretch">
        <header className="sticky top-0 z-30 flex min-h-[78px] items-center gap-3 border-b border-slate-200/70 bg-[#f6f8fc]/90 px-4 backdrop-blur-xl md:px-6 lg:px-8">
          <button onClick={()=>setMobile(true)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white lg:hidden" aria-label="فتح القائمة"><Menu size={18}/></button>
          <div className="min-w-0"><div className="text-[9px] font-black tracking-[.16em] text-slate-400">NEXORA / COMMAND</div><h1 className="truncate text-lg font-black text-[#071428]">{activeTitle}</h1></div>
          <button onClick={()=>setSearchOpen(true)} className="mr-auto hidden min-w-[310px] max-w-[500px] flex-1 items-center gap-3 rounded-[13px] border border-slate-200 bg-white px-4 py-2.5 text-right text-sm font-bold text-slate-400 shadow-[0_7px_22px_rgba(39,61,92,.035)] md:flex"><Search size={17}/><span className="flex-1">ابحث في NEXORA…</span><kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px]">⌘ K</kbd></button>
          <Link href="/command/agents" title="NEXORA AI" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-[#0071e3]"><Sparkles size={18}/></Link>
          <NotificationsMenu />
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-1.5 sm:flex"><div className="grid h-7 w-7 place-items-center rounded-lg bg-[#edf5ff] text-[11px] font-black text-[#0071e3]">{(profile?.full_name||'N').slice(0,1).toUpperCase()}</div><span className="max-w-[110px] truncate text-[11px] font-extrabold text-slate-600">{profile?.full_name||roleLabel}</span></div>
        </header>
        <div className="p-3 sm:p-4 md:p-6 lg:p-8">{children}</div>
      </section>
    </div>

    {searchOpen&&<div className="fixed inset-0 z-[90] flex items-start justify-center bg-slate-950/20 p-4 pt-[12vh] backdrop-blur-sm" onMouseDown={()=>setSearchOpen(false)}><div className="w-full max-w-2xl overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-soft" onMouseDown={e=>e.stopPropagation()}><div className="flex items-center gap-3 border-b border-slate-100 px-5"><Search size={18} className="text-slate-400"/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="ابحث عن صفحة أو أداة…" className="h-14 flex-1 bg-transparent text-sm font-bold outline-none"/><button onClick={()=>setSearchOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-50" aria-label="إغلاق البحث"><X size={17}/></button></div><div className="max-h-[52vh] overflow-y-auto p-2">{results.length?results.map(({label,href,icon:Icon})=><Link key={href} href={href} onClick={()=>{setSearchOpen(false);setQuery('')}} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-extrabold hover:bg-slate-50"><span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[#0071e3]"><Icon size={17}/></span><span>{label}</span><span className="mr-auto text-xs font-semibold text-slate-300">{href}</span></Link>):<div className="p-8 text-center text-sm font-bold text-slate-400">لا توجد نتائج.</div>}</div></div></div>}
  </main>
}
