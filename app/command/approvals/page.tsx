'use client'

import { useEffect, useState } from 'react'
import { Check, Clock3, ShieldCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Approval={id:string;approval_type:string;entity_type:string|null;entity_id:string|null;title:string;description:string|null;status:string;requested_by:string|null;reviewed_by:string|null;reviewed_at:string|null;created_at:string}

export default function ApprovalsPage(){
  const [rows,setRows]=useState<Approval[]>([])
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  async function load(){setLoading(true);const sb=createClient();const {data,error}=await sb.from('approvals').select('id,approval_type,entity_type,entity_id,title,description,status,requested_by,reviewed_by,reviewed_at,created_at').order('created_at',{ascending:false}).limit(200);if(error)setError(error.message);else{setRows((data||[]) as Approval[]);setError('')}setLoading(false)}
  useEffect(()=>{load()},[])

  async function review(row:Approval,status:'approved'|'rejected'){setBusy(row.id);setError('');const sb=createClient();const {data:{user}}=await sb.auth.getUser();const {error}=await sb.from('approvals').update({status,reviewed_by:user?.id||null,reviewed_at:new Date().toISOString()}).eq('id',row.id);setBusy('');if(error)return setError(error.message);await load()}

  const pending=rows.filter(r=>r.status==='pending')
  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex items-start justify-between gap-6"><div><div className="eyebrow">APPROVAL CENTER</div><h2 className="mt-5 text-3xl font-black md:text-4xl">مركز الموافقات</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">القرارات الحساسة تبقى بيد الإدارة. الموافقة أو الرفض يُكتب مباشرة في جدول approvals مع هوية المراجع ووقت القرار.</p></div><div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0071e3]"><ShieldCheck size={24}/></div></div></section>
    <section className="grid gap-3 sm:grid-cols-3">{[[pending.length,'Pending',Clock3],[rows.filter(r=>r.status==='approved').length,'Approved',Check],[rows.filter(r=>r.status==='rejected').length,'Rejected',X]].map(([v,l,Icon]:any)=><article key={l} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Icon size={19} className="text-[#0071e3]"/><strong className="mt-5 block font-[var(--font-inter)] text-3xl font-black">{v}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{l}</span></article>)}</section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card"><div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-black">طلبات تحتاج قرار</h3><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">{pending.length} Pending</span></div>{loading?<div className="p-10 text-center text-sm font-bold text-slate-400">جاري تحميل الموافقات…</div>:pending.length?<div className="space-y-3">{pending.map(r=><article key={r.id} className="rounded-[22px] border border-slate-200 bg-slate-50 p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-3xl"><div className="text-[10px] font-black tracking-[.14em] text-[#0071e3]">{r.approval_type} {r.entity_type?`• ${r.entity_type}`:''}</div><h4 className="mt-2 text-lg font-black">{r.title}</h4><p className="mt-2 text-sm leading-7 text-slate-500">{r.description||'بدون وصف إضافي.'}</p><span className="mt-3 block text-[11px] font-bold text-slate-400">{new Date(r.created_at).toLocaleString('ar-IQ')}</span></div><div className="flex shrink-0 gap-2"><button disabled={busy===r.id} onClick={()=>review(r,'rejected')} className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-700 disabled:opacity-50"><X size={16}/> رفض</button><button disabled={busy===r.id} onClick={()=>review(r,'approved')} className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-black text-white disabled:opacity-50"><Check size={16}/> موافقة</button></div></div></article>)}</div>:<div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-400">لا توجد موافقات معلقة.</div>}</section>
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-card"><h3 className="text-lg font-black">السجل الأخير</h3><div className="mt-4 divide-y divide-slate-100">{rows.filter(r=>r.status!=='pending').slice(0,30).map(r=><div key={r.id} className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between"><div><strong className="text-sm">{r.title}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{r.approval_type}</span></div><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${r.status==='approved'?'bg-emerald-50 text-emerald-700':'bg-red-50 text-red-700'}`}>{r.status}</span></div>)}</div></section>
  </div>
}
