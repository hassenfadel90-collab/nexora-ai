'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Activity, ArrowLeft, Bot, BriefcaseBusiness, CheckCircle2, CheckSquare2, Clock3, Gauge, ShieldCheck, Sparkles, Users, Workflow } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Lead={id:string;name:string;status:string;score:number|null;created_at:string}
type Project={id:string;title:string;status:string;deadline:string|null;health_score:number|null;created_at:string}
type Task={id:string;title:string;status:string;due_at:string|null;priority:string|null}
type Approval={id:string;title:string;status:string;created_at:string}
type ActivityRow={id:number;action:string;entity_type:string;created_at:string}

type DashboardState={
  name:string
  leads:Lead[]
  projects:Project[]
  tasks:Task[]
  approvals:Approval[]
  activity:ActivityRow[]
  team:number
  automations:number
}

const initial:DashboardState={name:'',leads:[],projects:[],tasks:[],approvals:[],activity:[],team:0,automations:0}
const statusLabel:Record<string,string>={active:'Active',planned:'Planning',on_hold:'On hold',completed:'Completed',cancelled:'Cancelled',new:'New',analyzed:'Analyzed',demo_ready:'Demo',contacted:'Contacted',interested:'Qualified',paid:'Won',delivered:'Delivered',lost:'Lost',pending:'Pending',approved:'Approved',rejected:'Rejected',todo:'Todo',in_progress:'In progress',review:'Review',done:'Done'}

function niceDate(value:string|null){
  if(!value)return '—'
  try{return new Intl.DateTimeFormat('ar-IQ',{month:'short',day:'numeric'}).format(new Date(value))}catch{return value}
}

export default function CommandOverviewPage(){
  const [data,setData]=useState<DashboardState>(initial)
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState('')

  useEffect(()=>{
    let alive=true
    ;(async()=>{
      try{
        const supabase=createClient()
        const {data:{user}}=await supabase.auth.getUser()
        if(!user)return
        const [profile,leads,projects,tasks,team,approvals,activity,automationCount]=await Promise.all([
          supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle(),
          supabase.from('leads').select('id,name,status,score,created_at').order('created_at',{ascending:false}).limit(120),
          supabase.from('projects').select('id,title,status,deadline,health_score,created_at').order('created_at',{ascending:false}).limit(80),
          supabase.from('tasks').select('id,title,status,due_at,priority').order('due_at',{ascending:true}).limit(120),
          supabase.from('profiles').select('*',{count:'exact',head:true}).eq('active',true),
          supabase.from('approvals').select('id,title,status,created_at').eq('status','pending').order('created_at',{ascending:false}).limit(8),
          supabase.from('activity_log').select('id,action,entity_type,created_at').order('created_at',{ascending:false}).limit(8),
          supabase.from('autopilot_runs').select('*',{count:'exact',head:true}),
        ])
        const fatal=[leads.error,projects.error,tasks.error].find(Boolean)
        if(fatal)throw fatal
        if(!alive)return
        setData({
          name:profile.data?.full_name||'',
          leads:(leads.data||[]) as Lead[],
          projects:(projects.data||[]) as Project[],
          tasks:(tasks.data||[]) as Task[],
          approvals:(approvals.data||[]) as Approval[],
          activity:(activity.data||[]) as ActivityRow[],
          team:team.count||0,
          automations:automationCount.count||0,
        })
      }catch(err:any){if(alive)setError(String(err?.message||'تعذر تحميل ملخص لوحة التحكم.'))}
      finally{if(alive)setLoading(false)}
    })()
    return()=>{alive=false}
  },[])

  const metrics=useMemo(()=>{
    const now=Date.now(),week=now+7*86400000
    const activeProjects=data.projects.filter(p=>p.status==='active').length
    const newLeads=data.leads.filter(l=>l.status==='new').length
    const tasksDue=data.tasks.filter(t=>!['done','cancelled'].includes(t.status)&&t.due_at&&new Date(t.due_at).getTime()<=week).length
    return {activeProjects,newLeads,tasksDue,automations:data.automations,team:data.team}
  },[data])

  const projectStatus=useMemo(()=>{
    const active=data.projects.filter(p=>p.status==='active').length
    const review=data.projects.filter(p=>p.status==='on_hold').length
    const done=data.projects.filter(p=>p.status==='completed').length
    const planning=Math.max(0,data.projects.length-active-review-done)
    const total=Math.max(1,data.projects.length)
    const pct=Math.round((active+done)/total*100)
    return {active,review,done,planning,total,pct}
  },[data.projects])

  const pipeline=useMemo(()=>{
    const stages=[
      ['New','new'],['Qualified','interested'],['Proposal','demo_ready'],['Won','paid']
    ] as const
    const counts=stages.map(([label,status])=>({label,count:data.leads.filter(l=>l.status===status).length}))
    const max=Math.max(1,...counts.map(x=>x.count))
    return counts.map(x=>({...x,height:Math.max(12,Math.round(x.count/max*100))}))
  },[data.leads])

  const deadlines=useMemo(()=>data.tasks.filter(t=>!['done','cancelled'].includes(t.status)&&t.due_at).slice(0,6),[data.tasks])

  if(loading)return <div className="mx-auto max-w-[1500px]"><div className="nx-card-soft flex min-h-[240px] items-center justify-center gap-3 font-bold text-slate-500"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#0071e3]"/> جاري تحميل لوحة القيادة…</div></div>

  return <div className="mx-auto max-w-[1500px] space-y-4">
    <section className="nx-card overflow-hidden p-6 md:p-8">
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="eyebrow"><span className="brand-dot"/> EXECUTIVE OVERVIEW</div><h2 className="mt-5 text-3xl font-black tracking-[-.03em] text-[#071428] md:text-4xl">أهلاً {data.name||'بك'}</h2><p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">كل ما يحتاج انتباهك اليوم في مكان واحد: المبيعات، المشاريع، المهام، الأتمتة والموافقات.</p></div>
        <div className="flex flex-wrap gap-2"><Link href="/command/leads" className="btn-primary">+ Lead جديد</Link><Link href="/command/projects" className="btn-secondary">مشروع جديد</Link><Link href="/command/agents" className="btn-secondary"><Sparkles size={17}/> اسأل AI</Link></div>
      </div>
    </section>

    {error&&<div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div>}

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {[
        [metrics.activeProjects,'Active Projects',BriefcaseBusiness,'text-[#0071e3] bg-blue-50'],
        [metrics.newLeads,'New Leads',Gauge,'text-violet-600 bg-violet-50'],
        [metrics.tasksDue,'Tasks Due',CheckSquare2,'text-amber-600 bg-amber-50'],
        [metrics.automations,'Automation Runs',Workflow,'text-cyan-700 bg-cyan-50'],
        [metrics.team,'Active Team',Users,'text-emerald-700 bg-emerald-50'],
      ].map(([value,label,Icon,tone]:any)=><article key={label} className="nx-card-soft p-5"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-black tracking-[.08em] text-slate-400">{label}</span><strong className="mt-3 block font-[var(--font-inter)] text-3xl font-black text-[#071428]">{value}</strong></div><div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}><Icon size={18}/></div></div></article>)}
    </section>

    <section className="grid gap-4 xl:grid-cols-[.92fr_1.08fr]">
      <article className="nx-card-soft p-6">
        <div className="flex items-start justify-between"><div><div className="nx-kicker text-slate-400">PROJECT STATUS</div><h3 className="mt-2 text-xl font-black">حالة المشاريع</h3></div><CheckCircle2 size={20} className="text-emerald-500"/></div>
        <div className="mt-8 grid items-center gap-8 sm:grid-cols-[180px_1fr]">
          <div className="relative mx-auto grid h-40 w-40 place-items-center rounded-full" style={{background:`conic-gradient(#0071e3 0 ${Math.min(100,projectStatus.pct)}%, #56c6ff ${Math.min(100,projectStatus.pct)}% ${Math.min(100,projectStatus.pct+10)}%, #e8edf4 ${Math.min(100,projectStatus.pct+10)}% 100%)`}}><div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-white shadow-card"><div className="text-center"><strong className="font-[var(--font-inter)] text-3xl font-black">{projectStatus.pct}%</strong><span className="mt-1 block text-[9px] font-black tracking-[.08em] text-slate-400">ON TRACK</span></div></div></div>
          <div className="space-y-3">{[['Active',projectStatus.active,'bg-[#0071e3]'],['Planning',projectStatus.planning,'bg-[#56c6ff]'],['On hold',projectStatus.review,'bg-amber-400'],['Completed',projectStatus.done,'bg-emerald-500']].map(([label,value,dot]:any)=><div key={label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3"><span className={`h-2.5 w-2.5 rounded-full ${dot}`}/><span className="text-xs font-bold text-slate-500">{label}</span><strong className="mr-auto font-[var(--font-inter)] text-sm">{value}</strong></div>)}</div>
        </div>
      </article>

      <article className="nx-card-soft p-6">
        <div className="flex items-start justify-between"><div><div className="nx-kicker text-slate-400">LEAD PIPELINE</div><h3 className="mt-2 text-xl font-black">مسار المبيعات</h3></div><Gauge size={20} className="text-[#0071e3]"/></div>
        <div className="mt-10 flex h-[210px] items-end gap-4 sm:gap-6">{pipeline.map(stage=><div key={stage.label} className="flex h-full flex-1 flex-col justify-end"><div className="mb-2 text-center font-[var(--font-inter)] text-lg font-black">{stage.count}</div><div style={{height:`${stage.height}%`}} className="min-h-8 rounded-t-[14px] bg-gradient-to-t from-[#006bd8] to-[#66c8ff] shadow-[0_8px_24px_rgba(0,113,227,.12)]"/><span className="mt-3 text-center text-[10px] font-black text-slate-400">{stage.label}</span></div>)}</div>
      </article>
    </section>

    <section className="grid gap-4 xl:grid-cols-3">
      <article className="nx-card-soft p-5 md:p-6"><div className="flex items-center justify-between"><div><div className="nx-kicker text-slate-400">RECENT ACTIVITY</div><h3 className="mt-2 text-lg font-black">آخر النشاطات</h3></div><Activity size={19} className="text-[#0071e3]"/></div><div className="mt-5 space-y-2">{data.activity.length?data.activity.map(row=><div key={row.id} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3"><span className="mt-1 h-2 w-2 rounded-full bg-[#0071e3]"/><div className="min-w-0"><strong className="block truncate text-xs">{row.action||'Activity'}</strong><span className="mt-1 block text-[10px] font-bold text-slate-400">{row.entity_type||'system'} · {niceDate(row.created_at)}</span></div></div>):<Empty text="لا يوجد نشاط حديث."/>}</div><Link href="/command/activity" className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#0071e3]">السجل الكامل <ArrowLeft size={14}/></Link></article>

      <article className="nx-card-soft p-5 md:p-6"><div className="flex items-center justify-between"><div><div className="nx-kicker text-slate-400">UPCOMING</div><h3 className="mt-2 text-lg font-black">المواعيد القادمة</h3></div><Clock3 size={19} className="text-amber-500"/></div><div className="mt-5 space-y-2">{deadlines.length?deadlines.map(row=><div key={row.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600"><CheckSquare2 size={16}/></div><div className="min-w-0 flex-1"><strong className="block truncate text-xs">{row.title}</strong><span className="mt-1 block text-[10px] font-bold text-slate-400">{statusLabel[row.status]||row.status}</span></div><b className="text-[10px] text-slate-500">{niceDate(row.due_at)}</b></div>):<Empty text="لا توجد مواعيد قريبة."/>}</div><Link href="/command/tasks" className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#0071e3]">عرض المهام <ArrowLeft size={14}/></Link></article>

      <article className="nx-card-soft p-5 md:p-6"><div className="flex items-center justify-between"><div><div className="nx-kicker text-slate-400">APPROVALS</div><h3 className="mt-2 text-lg font-black">بانتظار قرار</h3></div><ShieldCheck size={19} className="text-emerald-600"/></div><div className="mt-5 space-y-2">{data.approvals.length?data.approvals.map(row=><div key={row.id} className="rounded-xl border border-slate-100 bg-white p-3"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0071e3]"><ShieldCheck size={16}/></span><div className="min-w-0"><strong className="block truncate text-xs">{row.title||'Approval'}</strong><span className="mt-1 block text-[10px] font-bold text-slate-400">Pending · {niceDate(row.created_at)}</span></div></div></div>):<Empty text="لا توجد موافقات معلقة."/>}</div><Link href="/command/approvals" className="mt-4 inline-flex items-center gap-1 text-xs font-black text-[#0071e3]">مركز الموافقات <ArrowLeft size={14}/></Link></article>
    </section>

    <section className="nx-dark overflow-hidden rounded-[28px] p-6 md:p-8"><div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]"><div><div className="nx-kicker text-blue-300">NEXORA AI</div><h3 className="mt-3 text-2xl font-black">حوّل البيانات إلى الخطوة التالية.</h3><p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">استخدم أدوات AI Agents وAutomations الموجودة داخل اللوحة بدل التنقل بين أدوات منفصلة.</p></div><div className="flex flex-wrap gap-2"><Link href="/command/agents" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#071428]"><Bot size={17}/> AI Agents</Link><Link href="/command/automations" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white"><Workflow size={17}/> Automations</Link></div></div></section>
  </div>
}

function Empty({text}:{text:string}){return <div className="rounded-xl border border-dashed border-slate-200 bg-white p-5 text-center text-xs font-bold text-slate-400">{text}</div>}
