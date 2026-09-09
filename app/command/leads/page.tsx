'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Filter, Plus, Search, Sparkles, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Lead={id:string;name:string;business:string|null;country:string|null;contact:string|null;service:string|null;score:number|null;status:string;priority:string;source:string;temperature:string|null;estimated_value:number|null;estimated_currency:string;created_at:string}

const statuses=['all','new','analyzed','demo_ready','contacted','interested','paid','delivered','lost']
const statusAr:Record<string,string>={all:'كل الحالات',new:'جديد',analyzed:'محلل',demo_ready:'عرض تجريبي',contacted:'تم التواصل',interested:'مهتم',paid:'مدفوع',delivered:'تم التسليم',lost:'مفقود'}

export default function LeadsPage(){
  const [rows,setRows]=useState<Lead[]>([])
  const [loading,setLoading]=useState(true)
  const [query,setQuery]=useState('')
  const [status,setStatus]=useState('all')
  const [open,setOpen]=useState(false)
  const [error,setError]=useState('')

  async function load(){setLoading(true);const sb=createClient();let q=sb.from('leads').select('id,name,business,country,contact,service,score,status,priority,source,temperature,estimated_value,estimated_currency,created_at').order('created_at',{ascending:false}).limit(200);if(status!=='all')q=q.eq('status',status);const {data,error}=await q;if(error)setError(error.message);else{setRows((data||[]) as Lead[]);setError('')}setLoading(false)}
  useEffect(()=>{load()},[status])

  const filtered=useMemo(()=>{const needle=query.trim().toLowerCase();if(!needle)return rows;return rows.filter(r=>[r.name,r.business,r.country,r.contact,r.service].some(v=>String(v||'').toLowerCase().includes(needle)))},[rows,query])

  async function createLead(e:FormEvent<HTMLFormElement>){e.preventDefault();const fd=new FormData(e.currentTarget);const sb=createClient();const {data:{user}}=await sb.auth.getUser();const payload={name:String(fd.get('name')||'').trim(),business:String(fd.get('business')||'').trim()||null,country:String(fd.get('country')||'').trim()||null,contact:String(fd.get('contact')||'').trim()||null,service:String(fd.get('service')||'').trim()||null,message:String(fd.get('message')||'').trim()||null,priority:String(fd.get('priority')||'normal'),source:'dashboard',created_by:user?.id||null};const {error}=await sb.from('leads').insert(payload);if(error)return setError(error.message);setOpen(false);await load()}

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">CRM / LEADS</div><h2 className="mt-5 text-3xl font-black md:text-4xl">العملاء المحتملون</h2><p className="mt-3 text-sm leading-7 text-slate-500">إدارة الفرص الحقيقية من جدول leads الحالي، مع البحث والتصفية والإضافة.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><Plus size={17}/> Lead جديد</button></div></section>

    <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-card md:p-5"><div className="flex flex-col gap-3 md:flex-row"><div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="بحث بالاسم، الشركة، الدولة، التواصل أو الخدمة…"/></div><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><Filter size={16} className="text-slate-400"/><select value={status} onChange={e=>setStatus(e.target.value)} className="h-11 bg-transparent text-sm font-bold outline-none">{statuses.map(s=><option key={s} value={s}>{statusAr[s]}</option>)}</select></div></div></section>

    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card">
      <div className="hidden grid-cols-[1.2fr_1fr_.7fr_.8fr_.65fr_.6fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black text-slate-400 md:grid"><span>العميل</span><span>الخدمة</span><span>الحالة</span><span>القيمة</span><span>Score</span><span>المصدر</span></div>
      <div className="divide-y divide-slate-100">{loading?<div className="p-10 text-center text-sm font-bold text-slate-400">جاري تحميل الـLeads…</div>:filtered.length?filtered.map(r=><article key={r.id} className="grid gap-3 p-5 md:grid-cols-[1.2fr_1fr_.7fr_.8fr_.65fr_.6fr] md:items-center md:gap-4"><div><strong className="block text-sm">{r.name}</strong><span className="mt-1 block text-xs font-semibold text-slate-400">{r.business||r.contact||'—'}</span></div><span className="text-sm font-bold text-slate-600">{r.service||'—'}</span><span className="w-fit rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-[#0071e3]">{statusAr[r.status]||r.status}</span><span className="font-[var(--font-inter)] text-sm font-extrabold">{r.estimated_value!=null?`${r.estimated_currency||'USD'} ${Number(r.estimated_value).toLocaleString()}`:'—'}</span><span className="inline-flex w-fit items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-black text-violet-700"><Sparkles size={12}/>{r.score??'—'}</span><span className="text-xs font-bold text-slate-400">{r.source}</span></article>):<div className="p-10 text-center text-sm font-bold text-slate-400">لا توجد نتائج.</div>}</div>
    </section>

    {open&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><form onSubmit={createLead} className="w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">NEW LEAD</div><h3 className="mt-4 text-2xl font-black">إضافة Lead جديد</h3></div><button type="button" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div><div className="mt-7 grid gap-4 md:grid-cols-2"><Field name="name" label="الاسم" required/><Field name="business" label="الشركة / النشاط"/><Field name="country" label="الدولة"/><Field name="contact" label="البريد أو الهاتف"/><Field name="service" label="الخدمة المطلوبة"/><label className="block"><span className="mb-2 block text-sm font-extrabold">الأولوية</span><select name="priority" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className="md:col-span-2"><span className="mb-2 block text-sm font-extrabold">ملاحظات</span><textarea name="message" rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 outline-none"/></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="btn-secondary">إلغاء</button><button className="btn-primary">حفظ Lead</button></div></form></div>}
  </div>
}

function Field({name,label,required=false}:{name:string;label:string;required?:boolean}){return <label className="block"><span className="mb-2 block text-sm font-extrabold">{label}</span><input name={name} required={required} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none focus:border-[#0071e3]"/></label>}
