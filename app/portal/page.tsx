'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BriefcaseBusiness, CheckCircle2, ClipboardList, Download, FileText, LogOut, MessageSquareMore, Plus, ShieldCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ClientProfile = { id:string; email:string; full_name:string|null; active:boolean }
type ClientProject = { id:string; title:string; status:string; deadline:string|null; health_score:number|null }
type ClientFile = { id:string;project_id:string|null;storage_path:string;file_name:string;mime_type:string|null;file_size:number|null;created_at:string }
type ClientTask = { id:string;project_id:string|null;title:string;status:string;due_at:string|null }
type ClientProposal = { id:string;project_id:string|null;title:string;status:string;price:number|null;currency:string;version:number;created_at:string }
type ChangeRequest = { id:string;project_id:string;title:string;status:string;created_at:string }
type Comment = { id:string;entity_type:string;entity_id:string;body:string;created_at:string }

const fmtSize=(n:number|null)=>!n?'—':n<1024**2?`${(n/1024).toFixed(1)} KB`:`${(n/1024**2).toFixed(1)} MB`

export default function PortalPage(){
  const [profile,setProfile]=useState<ClientProfile|null>(null)
  const [loading,setLoading]=useState(true)
  const [projects,setProjects]=useState<ClientProject[]>([])
  const [files,setFiles]=useState<ClientFile[]>([])
  const [tasks,setTasks]=useState<ClientTask[]>([])
  const [proposals,setProposals]=useState<ClientProposal[]>([])
  const [changes,setChanges]=useState<ChangeRequest[]>([])
  const [comments,setComments]=useState<Comment[]>([])
  const [openChange,setOpenChange]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function load(){
    const supabase=createClient();setError('')
    const {data:{user}}=await supabase.auth.getUser()
    if(!user){setLoading(false);return}
    const {data:p,error:pErr}=await supabase.from('client_profiles').select('id,email,full_name,active').eq('id',user.id).maybeSingle()
    if(pErr||!p?.active){setLoading(false);return}
    setProfile(p as ClientProfile)
    const [pr,fi,ta,po,ch,co]=await Promise.all([
      supabase.from('projects').select('id,title,status,deadline,health_score').order('created_at',{ascending:false}).limit(20),
      supabase.from('project_files').select('id,project_id,storage_path,file_name,mime_type,file_size,created_at').eq('visibility','client').order('created_at',{ascending:false}).limit(30),
      supabase.from('tasks').select('id,project_id,title,status,due_at').eq('visible_to_client',true).order('created_at',{ascending:false}).limit(30),
      supabase.from('proposals').select('id,project_id,title,status,price,currency,version,created_at').eq('visible_to_client',true).order('created_at',{ascending:false}).limit(20),
      supabase.from('change_requests').select('id,project_id,title,status,created_at').order('created_at',{ascending:false}).limit(30),
      supabase.from('comments').select('id,entity_type,entity_id,body,created_at').eq('visibility','client').order('created_at',{ascending:false}).limit(12),
    ])
    const errors=[pr.error,fi.error,ta.error,po.error,ch.error,co.error].filter(Boolean)
    if(errors.length)setError('بعض بيانات البوابة لم يتم تحميلها بالكامل.')
    setProjects((pr.data||[]) as ClientProject[])
    setFiles((fi.data||[]) as ClientFile[])
    setTasks((ta.data||[]) as ClientTask[])
    setProposals((po.data||[]) as ClientProposal[])
    setChanges((ch.data||[]) as ChangeRequest[])
    setComments((co.data||[]) as Comment[])
    setLoading(false)
  }

  useEffect(()=>{load()},[])
  const projectMap=useMemo(()=>Object.fromEntries(projects.map(p=>[p.id,p])),[projects])
  const pendingChanges=changes.filter(x=>['requested','pending','review'].includes(x.status)).length

  async function logout(){const supabase=createClient();await supabase.auth.signOut();location.href='/portal'}
  async function download(row:ClientFile){const sb=createClient();const {data,error}=await sb.storage.from('project-files').createSignedUrl(row.storage_path,60);if(error)return setError(error.message);if(data?.signedUrl)window.open(data.signedUrl,'_blank','noopener,noreferrer')}

  async function requestChange(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(busy)return;setBusy(true);setError('')
    const fd=new FormData(e.currentTarget)
    const projectId=String(fd.get('project_id')||'')
    const title=String(fd.get('title')||'').trim()
    const description=String(fd.get('description')||'').trim()
    try{
      const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user)throw new Error('انتهت جلسة الدخول.')
      const {error}=await sb.from('change_requests').insert({project_id:projectId,title,description,status:'requested',requested_by:user.id})
      if(error)throw error
      e.currentTarget.reset();setOpenChange(false);await load()
    }catch(err:any){setError(String(err?.message||err))}finally{setBusy(false)}
  }

  if(loading)return <main className="grid min-h-screen place-items-center"><div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card">جاري فتح NEXORA Portal…</div></main>

  if(!profile)return <main className="grid min-h-screen place-items-center px-4"><div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-soft md:p-12"><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#07111f] text-xl font-black text-white">N</div><div className="mt-7 text-xs font-black tracking-[.18em] text-[#0071e3]">NEXORA PORTAL</div><h1 className="mt-4 text-3xl font-black">بوابة العملاء</h1><p className="mt-4 leading-8 text-slate-500">سجّل الدخول بحساب العميل المعتمد لمتابعة مشاريعك وملفاتك وتحديثاتك.</p><div className="mt-7 flex flex-wrap justify-center gap-2"><Link href="/portal/login" className="btn-primary">تسجيل دخول العميل</Link><Link href="/portal/activate" className="btn-secondary">تفعيل حساب جديد</Link></div></div></main>

  return <main className="min-h-screen bg-[#f6f7f9]">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="container-shell flex min-h-[76px] items-center justify-between"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#07111f] font-black text-white">N</span><span className="font-[var(--font-inter)] text-sm font-black tracking-[.16em]">NEXORA <b className="text-[#0071e3]">PORTAL</b></span></Link><div className="flex items-center gap-3"><div className="hidden text-left sm:block"><strong className="block text-sm">{profile.full_name||profile.email}</strong><span className="text-xs font-bold text-slate-400">Client</span></div><button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500"><LogOut size={17}/></button></div></div></header>
    <div className="container-shell py-8 md:py-12">
      <section className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-card md:p-10"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><div className="eyebrow">CLIENT WORKSPACE</div><h1 className="mt-5 text-3xl font-black md:text-4xl">أهلاً {profile.full_name||''}</h1><p className="mt-3 max-w-2xl leading-8 text-slate-500">هنا تشوف فقط المعلومات المخصصة لك: المشاريع، الملفات، المهام، العروض وطلبات التغيير.</p></div>{projects.length>0&&<button onClick={()=>setOpenChange(true)} className="btn-primary"><Plus size={17}/> طلب تغيير</button>}</div></section>
      {error&&<div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm font-bold text-amber-800">{error}</div>}

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[[projects.length,'المشاريع',BriefcaseBusiness],[pendingChanges,'طلبات تغيير مفتوحة',ShieldCheck],[files.length,'ملفات متاحة',FileText],[proposals.length,'عروض متاحة',ClipboardList]].map(([v,l,Icon]:any)=><article key={l} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Icon size={19} className="text-[#0071e3]"/><strong className="mt-5 block font-[var(--font-inter)] text-3xl font-black">{v}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{l}</span></article>)}</section>

      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">مشاريعي</h2><CheckCircle2 size={20} className="text-emerald-500"/></div><div className="mt-5 space-y-3">{projects.length?projects.map(p=>{const health=Math.min(100,Math.max(0,Number(p.health_score??0)));return <article key={p.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"><div><strong className="block">{p.title}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{p.status} {p.deadline?`• ${p.deadline}`:''}</span></div><div className="min-w-[180px]"><div className="mb-2 flex justify-between text-xs font-bold text-slate-400"><span>Health</span><span>{p.health_score==null?'—':`${health}%`}</span></div><div className="h-2 rounded-full bg-slate-200">{p.health_score!=null&&<i style={{width:`${health}%`}} className="block h-full rounded-full bg-[#0071e3]"/>}</div></div></article>}):<div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-400">لا توجد مشاريع متاحة لهذا الحساب حالياً.</div>}</div></section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">ملفات المشروع</h2><FileText size={19} className="text-[#0071e3]"/></div><div className="mt-5 space-y-2">{files.length?files.slice(0,8).map(f=><article key={f.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{f.file_name}</strong><span className="mt-1 block text-[11px] font-bold text-slate-400">{f.project_id?projectMap[f.project_id]?.title||'مشروع':'مشروع'} • {fmtSize(f.file_size)}</span></div><button onClick={()=>download(f)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-[#0071e3]"><Download size={16}/></button></article>):<div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center text-sm font-bold text-slate-400">لا توجد ملفات متاحة.</div>}</div></section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">المهام المرئية لك</h2><ClipboardList size={19} className="text-[#0071e3]"/></div><div className="mt-5 space-y-2">{tasks.length?tasks.slice(0,8).map(t=><article key={t.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between gap-3"><div><strong className="block text-sm">{t.title}</strong><span className="mt-1 block text-[11px] font-bold text-slate-400">{t.project_id?projectMap[t.project_id]?.title||'مشروع':'مشروع'} {t.due_at?`• ${new Date(t.due_at).toLocaleDateString('ar-IQ')}`:''}</span></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-slate-500">{t.status}</span></div></article>):<div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center text-sm font-bold text-slate-400">لا توجد مهام منشورة للعميل.</div>}</div></section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">العروض</h2><ShieldCheck size={19} className="text-[#0071e3]"/></div><div className="mt-5 space-y-2">{proposals.length?proposals.map(p=><article key={p.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong className="block text-sm">{p.title}</strong><span className="mt-1 block text-[11px] font-bold text-slate-400">Version {p.version} • {p.status}</span></div><strong className="font-[var(--font-inter)] text-sm">{p.price==null?'—':`${Number(p.price).toLocaleString()} ${p.currency}`}</strong></div></article>):<div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center text-sm font-bold text-slate-400">لا توجد عروض منشورة لك.</div>}</div></section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h2 className="text-xl font-black">آخر التحديثات</h2><MessageSquareMore size={19} className="text-[#0071e3]"/></div><div className="mt-5 space-y-2">{comments.length?comments.map(c=><article key={c.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-sm font-semibold leading-7 text-slate-700">{c.body}</p><span className="mt-2 block text-[11px] font-bold text-slate-400">{new Date(c.created_at).toLocaleString('ar-IQ')}</span></article>):<div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center text-sm font-bold text-slate-400">لا توجد تحديثات منشورة بعد.</div>}</div></section>
      </div>

      <section className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><h2 className="text-xl font-black">طلبات التغيير</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{changes.length?changes.map(c=><article key={c.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><strong className="block text-sm">{c.title}</strong><span className="mt-1 block text-[11px] font-bold text-slate-400">{projectMap[c.project_id]?.title||'مشروع'} • {c.status} • {new Date(c.created_at).toLocaleDateString('ar-IQ')}</span></article>):<div className="rounded-2xl border border-dashed border-slate-200 p-7 text-center text-sm font-bold text-slate-400 md:col-span-2">لا توجد طلبات تغيير.</div>}</div></section>
    </div>

    {openChange&&<div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><form onSubmit={requestChange} className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">CHANGE REQUEST</div><h3 className="mt-4 text-2xl font-black">طلب تغيير جديد</h3></div><button type="button" onClick={()=>setOpenChange(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div><div className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-extrabold">المشروع *</span><select name="project_id" required className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"><option value="">اختر مشروع</option>{projects.map(p=><option value={p.id} key={p.id}>{p.title}</option>)}</select></label><label className="block"><span className="mb-2 block text-sm font-extrabold">عنوان الطلب *</span><input name="title" required minLength={3} maxLength={180} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">التفاصيل *</span><textarea name="description" required minLength={5} maxLength={4000} rows={5} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"/></label></div><button disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">{busy?'جارِ الإرسال…':'إرسال طلب التغيير'}</button></form></div>}
  </main>
}
