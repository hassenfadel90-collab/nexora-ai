'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Copy, KeyRound, Plus, Search, UserRoundCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Access={email:string;project_id:string;full_name:string|null;active:boolean;created_at:string}
type Project={id:string;title:string;status:string}
type InviteResult={invite_id:string;activation_code:string;expires_at:string}

export default function ClientsPage(){
  const [access,setAccess]=useState<Access[]>([])
  const [projects,setProjects]=useState<Project[]>([])
  const [query,setQuery]=useState('')
  const [open,setOpen]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')
  const [invite,setInvite]=useState<InviteResult|null>(null)

  async function load(){
    const sb=createClient();setError('')
    const [a,p]=await Promise.all([
      sb.from('client_access').select('email,project_id,full_name,active,created_at').order('created_at',{ascending:false}),
      sb.from('projects').select('id,title,status').order('created_at',{ascending:false})
    ])
    if(a.error)return setError(a.error.message)
    if(p.error)return setError(p.error.message)
    setAccess((a.data||[]) as Access[]);setProjects((p.data||[]) as Project[])
  }
  useEffect(()=>{load()},[])

  const projectMap=useMemo(()=>Object.fromEntries(projects.map(p=>[p.id,p])),[projects])
  const rows=useMemo(()=>{const q=query.trim().toLowerCase();return q?access.filter(r=>[r.email,r.full_name,projectMap[r.project_id]?.title].some(v=>String(v||'').toLowerCase().includes(q))):access},[access,query,projectMap])

  async function createInvite(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError('');setInvite(null)
    const fd=new FormData(e.currentTarget)
    const email=String(fd.get('email')||'').trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com')
    const projectId=String(fd.get('project_id')||'')
    const fullName=String(fd.get('full_name')||'').trim()||null
    try{
      const sb=createClient()
      const {data,error}=await sb.rpc('create_client_invite',{p_email:email,p_project_id:projectId,p_full_name:fullName,p_valid_hours:72})
      if(error)throw error
      const row=Array.isArray(data)?data[0]:data
      if(!row)throw new Error('لم يرجع النظام كود تفعيل.')
      setInvite(row as InviteResult)
      await load()
    }catch(err:any){setError(String(err?.message||err))}finally{setBusy(false)}
  }

  async function toggle(row:Access){
    const sb=createClient();setError('')
    const {error}=await sb.from('client_access').update({active:!row.active}).eq('email',row.email).eq('project_id',row.project_id)
    if(error)return setError(error.message)
    await load()
  }

  async function copyCode(){if(!invite)return;await navigator.clipboard.writeText(invite.activation_code)}

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">CLIENT ACCESS</div><h2 className="mt-5 text-3xl font-black md:text-4xl">العملاء وبوابة المشاريع</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">اربط العميل بمشروع محدد وأنشئ له كود تفعيل مؤقت. العميل لا يرى بيانات الإدارة الداخلية.</p></div><button onClick={()=>{setOpen(true);setInvite(null)}} className="btn-primary"><Plus size={17}/> دعوة عميل</button></div></section>

    <section className="grid gap-3 sm:grid-cols-3"><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><UserRoundCheck size={19} className="text-[#0071e3]"/><strong className="mt-5 block text-3xl font-black">{access.length}</strong><span className="text-xs font-bold text-slate-400">صلاحيات العملاء</span></article><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><CheckCircle2 size={19} className="text-emerald-600"/><strong className="mt-5 block text-3xl font-black">{access.filter(x=>x.active).length}</strong><span className="text-xs font-bold text-slate-400">نشط</span></article><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><KeyRound size={19} className="text-violet-600"/><strong className="mt-5 block text-3xl font-black">72h</strong><span className="text-xs font-bold text-slate-400">مدة كود التفعيل</span></article></section>

    <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="بحث بالاسم، البريد أو المشروع…"/></div></section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card"><div className="hidden grid-cols-[1.2fr_1fr_.5fr_.55fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black text-slate-400 md:grid"><span>العميل</span><span>المشروع</span><span>الحالة</span><span>إجراء</span></div><div className="divide-y divide-slate-100">{rows.length?rows.map(r=><article key={`${r.email}-${r.project_id}`} className="grid gap-4 p-5 md:grid-cols-[1.2fr_1fr_.5fr_.55fr] md:items-center"><div><strong className="block text-sm">{r.full_name||r.email}</strong><span className="mt-1 block text-xs font-semibold text-slate-400">{r.email}</span></div><div><strong className="block text-sm">{projectMap[r.project_id]?.title||'مشروع غير متاح'}</strong><span className="mt-1 text-xs font-bold text-slate-400">{projectMap[r.project_id]?.status||'—'}</span></div><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${r.active?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{r.active?'Active':'Inactive'}</span><button onClick={()=>toggle(r)} className="w-fit rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600">{r.active?'تعطيل':'تفعيل'}</button></article>):<div className="p-10 text-center text-sm font-bold text-slate-400">لا توجد صلاحيات عملاء بعد.</div>}</div></section>

    {open&&<div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">CLIENT INVITE</div><h3 className="mt-4 text-2xl font-black">دعوة عميل للمشروع</h3></div><button onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div>{invite?<div className="mt-7 rounded-[22px] border border-emerald-100 bg-emerald-50 p-5"><CheckCircle2 size={22} className="text-emerald-600"/><strong className="mt-4 block">تم إنشاء كود التفعيل</strong><div className="mt-3 flex items-center gap-2 rounded-xl bg-white p-3"><code className="flex-1 text-left font-[var(--font-inter)] text-sm font-black tracking-wider">{invite.activation_code}</code><button onClick={copyCode} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200"><Copy size={16}/></button></div><p className="mt-3 text-xs font-bold leading-6 text-slate-500">صالح حتى {new Date(invite.expires_at).toLocaleString('ar-IQ')}. أرسل الكود للعميل مع رابط /portal/activate.</p><button onClick={()=>setOpen(false)} className="btn-primary mt-5 w-full">تم</button></div>:<form onSubmit={createInvite} className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-extrabold">الاسم</span><input name="full_name" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">البريد *</span><input name="email" type="email" required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">المشروع *</span><select name="project_id" required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"><option value="">اختر مشروع</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label><button disabled={busy} className="btn-primary mt-2 w-full disabled:opacity-60">{busy?'جاري الإنشاء…':'إنشاء دعوة وكود تفعيل'}</button></form>}</div></div>}
  </div>
}
