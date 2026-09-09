'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Download, File, FileUp, Search, Trash2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Project={id:string;title:string;status:string}
type Row={id:string;project_id:string|null;storage_path:string;file_name:string;mime_type:string|null;file_size:number|null;visibility:string;created_at:string}

const maxBytes=25*1024*1024
const safeName=(name:string)=>name.replace(/[^\w.\-\u0600-\u06FF]+/g,'_').slice(0,180)
const size=(n:number|null)=>{if(!n)return '—';if(n<1024)return `${n} B`;if(n<1024**2)return `${(n/1024).toFixed(1)} KB`;return `${(n/1024**2).toFixed(1)} MB`}

export default function FilesPage(){
  const [rows,setRows]=useState<Row[]>([])
  const [projects,setProjects]=useState<Project[]>([])
  const [query,setQuery]=useState('')
  const [open,setOpen]=useState(false)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function load(){
    const sb=createClient();setError('')
    const [f,p]=await Promise.all([
      sb.from('project_files').select('id,project_id,storage_path,file_name,mime_type,file_size,visibility,created_at').order('created_at',{ascending:false}).limit(250),
      sb.from('projects').select('id,title,status').order('created_at',{ascending:false})
    ])
    if(f.error)return setError(f.error.message)
    if(p.error)return setError(p.error.message)
    setRows((f.data||[]) as Row[]);setProjects((p.data||[]) as Project[])
  }
  useEffect(()=>{load()},[])

  const projectMap=useMemo(()=>Object.fromEntries(projects.map(p=>[p.id,p])),[projects])
  const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return q?rows.filter(r=>[r.file_name,r.mime_type,r.visibility,projectMap[r.project_id||'']?.title].some(v=>String(v||'').toLowerCase().includes(q))):rows},[rows,query,projectMap])

  async function upload(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(busy)return
    const form=e.currentTarget,fd=new FormData(form),file=fd.get('file') as File|null
    if(!file||!file.size)return setError('اختر ملفاً أولاً.')
    if(file.size>maxBytes)return setError('الحد الأعلى للملف 25 MB.')
    const projectId=String(fd.get('project_id')||'')||null
    const visibility=String(fd.get('visibility')||'internal')==='client'?'client':'internal'
    setBusy(true);setError('')
    try{
      const sb=createClient()
      const {data:{user}}=await sb.auth.getUser()
      if(!user)throw new Error('انتهت جلسة الدخول.')
      const path=`${projectId||'general'}/${Date.now()}-${safeName(file.name)}`
      const up=await sb.storage.from('project-files').upload(path,file,{upsert:false,contentType:file.type||'application/octet-stream'})
      if(up.error)throw up.error
      const ins=await sb.from('project_files').insert({project_id:projectId,storage_path:path,file_name:file.name,mime_type:file.type||null,file_size:file.size,visibility,uploaded_by:user.id})
      if(ins.error){await sb.storage.from('project-files').remove([path]);throw ins.error}
      form.reset();setOpen(false);await load()
    }catch(err:any){setError(String(err?.message||err))}finally{setBusy(false)}
  }

  async function download(row:Row){
    const sb=createClient();setError('')
    const {data,error}=await sb.storage.from('project-files').createSignedUrl(row.storage_path,60)
    if(error)return setError(error.message)
    if(data?.signedUrl)window.open(data.signedUrl,'_blank','noopener,noreferrer')
  }

  async function remove(row:Row){
    if(!confirm(`حذف ${row.file_name}؟`))return
    const sb=createClient();setError('')
    const delStorage=await sb.storage.from('project-files').remove([row.storage_path])
    if(delStorage.error)return setError(delStorage.error.message)
    const delRow=await sb.from('project_files').delete().eq('id',row.id)
    if(delRow.error)return setError(delRow.error.message)
    await load()
  }

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">FILES & DELIVERY</div><h2 className="mt-5 text-3xl font-black md:text-4xl">ملفات المشاريع</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">Storage خاص، روابط تحميل مؤقتة، وإمكانية تحديد ما إذا كان الملف داخلياً أو مرئياً للعميل.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><FileUp size={17}/> رفع ملف</button></div></section>

    <section className="grid gap-3 sm:grid-cols-3"><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><File size={19} className="text-[#0071e3]"/><strong className="mt-5 block text-3xl font-black">{rows.length}</strong><span className="text-xs font-bold text-slate-400">إجمالي الملفات</span></article><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><FileUp size={19} className="text-emerald-600"/><strong className="mt-5 block text-3xl font-black">{rows.filter(x=>x.visibility==='client').length}</strong><span className="text-xs font-bold text-slate-400">مرئي للعميل</span></article><article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Download size={19} className="text-violet-600"/><strong className="mt-5 block text-3xl font-black">25 MB</strong><span className="text-xs font-bold text-slate-400">حد الرفع لكل ملف</span></article></section>

    <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="بحث باسم الملف، المشروع أو النوع…"/></div></section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card"><div className="hidden grid-cols-[1.3fr_1fr_.55fr_.55fr_.65fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black text-slate-400 md:grid"><span>الملف</span><span>المشروع</span><span>الحجم</span><span>الظهور</span><span>إجراءات</span></div><div className="divide-y divide-slate-100">{filtered.length?filtered.map(r=><article key={r.id} className="grid gap-4 p-5 md:grid-cols-[1.3fr_1fr_.55fr_.55fr_.65fr] md:items-center"><div className="min-w-0"><strong className="block truncate text-sm">{r.file_name}</strong><span className="mt-1 block truncate text-xs font-semibold text-slate-400">{r.mime_type||'file'} • {new Date(r.created_at).toLocaleDateString('ar-IQ')}</span></div><div><strong className="block text-sm">{r.project_id?projectMap[r.project_id]?.title||'مشروع':'عام'}</strong></div><span className="text-xs font-bold text-slate-500">{size(r.file_size)}</span><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${r.visibility==='client'?'bg-blue-50 text-[#0071e3]':'bg-slate-100 text-slate-500'}`}>{r.visibility==='client'?'Client':'Internal'}</span><div className="flex gap-2"><button onClick={()=>download(r)} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500" title="تحميل"><Download size={16}/></button><button onClick={()=>remove(r)} className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 text-red-500" title="حذف"><Trash2 size={16}/></button></div></article>):<div className="p-10 text-center text-sm font-bold text-slate-400">لا توجد ملفات.</div>}</div></section>

    {open&&<div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><form onSubmit={upload} className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">SECURE UPLOAD</div><h3 className="mt-4 text-2xl font-black">رفع ملف</h3></div><button type="button" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div><div className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-extrabold">الملف *</span><input name="file" type="file" required className="block w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">المشروع</span><select name="project_id" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"><option value="">ملف عام</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label><label className="block"><span className="mb-2 block text-sm font-extrabold">الظهور</span><select name="visibility" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"><option value="internal">داخلي فقط</option><option value="client">مرئي للعميل</option></select></label></div><button disabled={busy} className="btn-primary mt-6 w-full disabled:opacity-60">{busy?'جارِ الرفع…':'رفع الملف'}</button></form></div>}
  </div>
}
