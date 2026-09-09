'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Plus, Search, Shield, UserCog, UserPlus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Member={id:string;email:string;full_name:string|null;role:string;active:boolean;position:string|null;created_at:string}
const roles=['admin','manager','sales','developer']
const roleLabel:Record<string,string>={owner:'Owner',admin:'Admin',manager:'Manager',sales:'Sales',developer:'Developer'}

export default function TeamPage(){
  const [rows,setRows]=useState<Member[]>([])
  const [query,setQuery]=useState('')
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')

  async function load(){setLoading(true);const sb=createClient();const {data,error}=await sb.from('profiles').select('id,email,full_name,role,active,position,created_at').order('created_at',{ascending:true});if(error)setError(error.message);else{setRows((data||[]) as Member[]);setError('')}setLoading(false)}
  useEffect(()=>{load()},[])
  const filtered=useMemo(()=>{const n=query.trim().toLowerCase();if(!n)return rows;return rows.filter(r=>[r.full_name,r.email,r.role,r.position].some(v=>String(v||'').toLowerCase().includes(n)))},[rows,query])

  async function addMember(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy('add');setError('');const fd=new FormData(e.currentTarget);const sb=createClient();const email=String(fd.get('email')||'').trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com');const full_name=String(fd.get('full_name')||'').trim()||null;const role=String(fd.get('role')||'sales');const {error}=await sb.rpc('admin_add_employee',{p_email:email,p_role:role,p_full_name:full_name});setBusy('');if(error)return setError(error.message);setOpen(false);await load()}

  async function setRole(member:Member,role:string){if(member.role==='owner')return;setBusy(member.id);setError('');const sb=createClient();const {error}=await sb.rpc('admin_set_employee_role',{p_user_id:member.id,p_role:role});setBusy('');if(error)return setError(error.message);await load()}
  async function setActive(member:Member,active:boolean){if(member.role==='owner'&&!active)return;setBusy(member.id);setError('');const sb=createClient();const {error}=await sb.rpc('admin_set_employee_active',{p_user_id:member.id,p_active:active});setBusy('');if(error)return setError(error.message);await load()}

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">TEAM & ACCESS</div><h2 className="mt-5 text-3xl font-black md:text-4xl">الفريق والصلاحيات</h2><p className="mt-3 text-sm leading-7 text-slate-500">إضافة وإدارة الفريق عبر RPCs محمية في Supabase، بدل الكتابة المباشرة إلى جداول الصلاحيات.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><UserPlus size={17}/> إضافة موظف</button></div></section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['إجمالي الفريق',rows.length,UserCog],['نشط',rows.filter(x=>x.active).length,CheckCircle2],['إدارة',rows.filter(x=>['owner','admin'].includes(x.role)).length,Shield],['قيد الإعداد',0,Plus]].map(([label,value,Icon]:any)=><article key={label} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Icon size={19} className="text-[#0071e3]"/><strong className="mt-5 block font-[var(--font-inter)] text-3xl font-black">{value}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{label}</span></article>)}</section>

    <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="بحث بالاسم، البريد أو الدور…"/></div></section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}

    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card"><div className="hidden grid-cols-[1.25fr_.7fr_.7fr_.8fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black text-slate-400 md:grid"><span>المستخدم</span><span>الدور</span><span>الحالة</span><span>إجراءات</span></div><div className="divide-y divide-slate-100">{loading?<div className="p-10 text-center text-sm font-bold text-slate-400">جاري تحميل الفريق…</div>:filtered.map(m=><article key={m.id} className="grid gap-4 p-5 md:grid-cols-[1.25fr_.7fr_.7fr_.8fr] md:items-center"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-black text-[#0071e3]">{(m.full_name||m.email).slice(0,1).toUpperCase()}</div><div><strong className="block text-sm">{m.full_name||'بدون اسم'}</strong><span className="mt-1 block text-xs font-semibold text-slate-400">{m.email}</span></div></div><div>{m.role==='owner'?<span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-black text-white">Owner</span>:<select value={m.role} disabled={busy===m.id} onChange={e=>setRole(m,e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black outline-none">{roles.map(r=><option key={r} value={r}>{roleLabel[r]}</option>)}</select>}</div><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${m.active?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{m.active?'Active':'Inactive'}</span><div>{m.role==='owner'?<span className="text-xs font-bold text-slate-400">محمي</span>:<button disabled={busy===m.id} onClick={()=>setActive(m,!m.active)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">{m.active?'تعطيل':'تفعيل'}</button>}</div></article>)}</div></section>

    {open&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><form onSubmit={addMember} className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">TEAM ACCESS</div><h3 className="mt-4 text-2xl font-black">إضافة عضو للفريق</h3><p className="mt-2 text-sm leading-7 text-slate-500">يتم إنشاء Access آمن. المستخدم يفعّل حسابه لاحقًا بنفس البريد.</p></div><button type="button" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div><div className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-extrabold">الاسم</span><input name="full_name" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">البريد الإلكتروني</span><input name="email" required type="email" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">الدور</span><select name="role" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none">{roles.map(r=><option key={r} value={r}>{roleLabel[r]}</option>)}</select></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="btn-secondary">إلغاء</button><button disabled={busy==='add'} className="btn-primary disabled:opacity-50">{busy==='add'?'جاري الإضافة…':'إضافة للفريق'}</button></div></form></div>}
  </div>
}
