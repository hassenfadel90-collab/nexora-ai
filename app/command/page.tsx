'use client'

import { useEffect, useState } from 'react'
import { Activity, Bot, BriefcaseBusiness, CheckSquare2, Gauge, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function CommandOverviewPage(){
  const [stats,setStats]=useState({leads:0,projects:0,tasks:0,team:0})
  const [name,setName]=useState('')

  useEffect(()=>{
    let alive=true
    ;(async()=>{
      const supabase=createClient()
      const {data:{user}}=await supabase.auth.getUser()
      if(!user)return
      const [{data:profile},leads,projects,tasks,team]=await Promise.all([
        supabase.from('profiles').select('full_name').eq('id',user.id).maybeSingle(),
        supabase.from('leads').select('*',{count:'exact',head:true}),
        supabase.from('projects').select('*',{count:'exact',head:true}),
        supabase.from('tasks').select('*',{count:'exact',head:true}),
        supabase.from('profiles').select('*',{count:'exact',head:true}).eq('active',true),
      ])
      if(!alive)return
      setName(profile?.full_name||'')
      setStats({leads:leads.count||0,projects:projects.count||0,tasks:tasks.count||0,team:team.count||0})
    })()
    return()=>{alive=false}
  },[])

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">EXECUTIVE OVERVIEW</div><h2 className="mt-5 text-3xl font-black tracking-[-.025em] md:text-4xl">أهلاً {name}</h2><p className="mt-3 text-sm font-medium leading-7 text-slate-500">نظرة مباشرة على العمل الحالي. الأرقام الأساسية تُقرأ من Supabase بدل بيانات تجريبية.</p></div><div className="flex gap-2"><button className="btn-primary">+ مشروع جديد</button><button className="btn-secondary">تقرير سريع</button></div></div></section>
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[[stats.leads,'Leads',Gauge],[stats.projects,'Projects',BriefcaseBusiness],[stats.tasks,'Tasks',CheckSquare2],[stats.team,'Team',Users]].map(([value,label,Icon]:any)=><article key={label} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-start justify-between"><div><span className="text-xs font-extrabold text-slate-400">{label}</span><strong className="mt-3 block font-[var(--font-inter)] text-4xl font-black">{value}</strong></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0071e3]"><Icon size={19}/></div></div></article>)}</section>
    <section className="grid gap-4 xl:grid-cols-[1.35fr_.65fr]"><article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><div><span className="text-xs font-black tracking-[.14em] text-[#0071e3]">BUSINESS PULSE</span><h3 className="mt-2 text-xl font-black">نشاط العمل</h3></div><Activity className="text-slate-300"/></div><div className="mt-10 flex h-56 items-end gap-3">{[58,72,44,88,66,76,52,92,68,84].map((h,i)=><i key={i} style={{height:`${h}%`}} className="flex-1 rounded-t-xl bg-gradient-to-t from-[#0071e3] to-[#86c1ff]"/>)}</div></article><article className="rounded-[28px] border border-slate-200 bg-[#07111f] p-6 text-white shadow-card"><Bot className="text-blue-300"/><div className="mt-16 text-xs font-black tracking-[.14em] text-blue-300">AI OPERATIONS</div><h3 className="mt-3 text-2xl font-black">NEXORA Assistant</h3><p className="mt-3 text-sm leading-7 text-slate-300">المساعد سيجمع إجراءات الفريق، تحذيرات الأنظمة والفرص المقترحة في مكان واحد.</p><button className="mt-8 rounded-xl bg-white px-4 py-3 text-sm font-black text-slate-950">فتح المساعد</button></article></section>
  </div>
}
