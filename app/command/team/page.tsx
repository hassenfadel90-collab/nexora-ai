'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Copy, Plus, Search, Shield, UserCog, UserPlus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { withBasePath } from '@/lib/base-path'

type Member={id:string;email:string;full_name:string|null;role:string;active:boolean;position:string|null;created_at:string}
type Access={email:string;role:string;active:boolean;full_name:string|null;created_at:string;updated_at:string}
const roles=['admin','manager','sales','developer']
const roleLabel:Record<string,string>={owner:'Owner',admin:'Admin',manager:'Manager',sales:'Sales',developer:'Developer'}

export default function TeamPage(){
  const [rows,setRows]=useState<Member[]>([])
  const [access,setAccess]=useState<Access[]>([])
  const [query,setQuery]=useState('')
  const [open,setOpen]=useState(false)
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState('')
  const [error,setError]=useState('')
  const [success,setSuccess]=useState('')

  async function load(){
    setLoading(true);setError('')
    const sb=createClient()
    const [p,a]=await Promise.all([
      sb.from('profiles').select('id,email,full_name,role,active,position,created_at').order('created_at',{ascending:true}),
      sb.from('team_access').select('email,role,active,full_name,created_at,updated_at').order('created_at',{ascending:true})
    ])
    if(p.error||a.error)setError((p.error||a.error)?.message||'تعذر تحميل الفريق.')
    setRows((p.data||[]) as Member[]);setAccess((a.data||[]) as Access[]);setLoading(false)
  }
  useEffect(()=>{load()},[])

  const profileEmails=useMemo(()=>new Set(rows.map(r=>r.email.toLowerCase())),[rows])
  const pending=useMemo(()=>access.filter(a=>!profileEmails.has(a.email.toLowerCase())),[access,profileEmails])
  const filtered=useMemo(()=>{const n=query.trim().toLowerCase();if(!n)return rows;return rows.filter(r=>[r.full_name,r.email,r.role,r.position].some(v=>String(v||'').toLowerCase().includes(n)))},[rows,query])

  async function addMember(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy('add');setError('');setSuccess('')
    const fd=new FormData(e.currentTarget),sb=createClient()
    const email=String(fd.get('email')||'').trim().toLowerCase().replace('@gmai.com','@gmail.com').replace('@gmial.com','@gmail.com')
    const full_name=String(fd.get('full_name')||'').trim()||null,role=String(fd.get('role')||'sales')
    const {error}=await sb.rpc('admin_add_employee',{p_email:email,p_role:role,p_full_name:full_name})
    setBusy('');if(error)return setError(error.message)
    setSuccess(`تم اعتماد ${email}. يظهر الآن ضمن Pending Activation إلى أن ينشئ حسابه بنفس البريد.`);setOpen(false);await load()
  }

  async function setRole(member:Member,role:string){if(member.role==='owner')return;setBusy(member.id);setError('');const sb=createClient();const {error}=await sb.rpc('admin_set_employee_role',{p_user_id:member.id,p_role:role});setBusy('');if(error)return setError(error.message);await load()}
  async function setActive(member:Member,active:boolean){if(member.role==='owner'&&!active)return;setBusy(member.id);setError('');const sb=createClient();const {error}=await sb.rpc('admin_set_employee_active',{p_user_id:member.id,p_active:active});setBusy('');if(error)return setError(error.message);await load()}
  async function updatePending(row:Access,patch:{role?:string;active?:boolean}){
    setBusy(`p-${row.email}`);setError('')
    const sb=createClient()
    if(patch.role){const {error}=await sb.rpc('admin_add_employee',{p_email:row.email,p_role:patch.role,p_full_name:row.full_name});if(error){setBusy('');return setError(error.message)}}
    if(typeof patch.active==='boolean'){const {error}=await sb.from('team_access').update({active:patch.active}).eq('email',row.email);if(error){setBusy('');return setError(error.message)}}
    setBusy('');await load()
  }
  async function copyActivation(row:Access){
    const link=`${window.location.origin}${withBasePath(`/login?mode=activate&email=${encodeURIComponent(row.email)}`)}`
    await navigator.clipboard.writeText(link);setSuccess(`تم نسخ رابط تفعيل ${row.email}`)
  }

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="eyebrow">TEAM & ACCESS</div><h2 className="mt-5 text-3xl font-black md:text-4xl">الفريق والصلاحيات</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">الإضافة تمر عبر RPC محمية. البريد يظهر Pending فوراً، وبعد تفعيل الحساب يتحول تلقائياً إلى عضو كامل في Profiles.</p></div><button onClick={()=>setOpen(true)} className="btn-primary"><UserPlus size={17}/> إضافة موظف</button></div></section>

    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[['إجمالي الحسابات',rows.length,UserCog],['نشط',rows.filter(x=>x.active).length,CheckCircle2],['إدارة',rows.filter(x=>['owner','admin'].includes(x.role)).length,Shield],['قيد التفعيل',pending.filter(x=>x.active).length,Plus]].map(([label,value,Icon]:any)=><article key={label} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-card"><Icon size={19} className="text-[#0071e3]"/><strong className="mt-5 block font-[var(--font-inter)] text-3xl font-black">{value}</strong><span className="mt-1 block text-xs font-bold text-slate-400">{label}</span></article>)}</section>

    <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-card"><div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4"><Search size={17} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent outline-none" placeholder="بحث بالاسم، البريد أو الدور…"/></div></section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
    {success&&<div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{success}</div>}

    {pending.length>0&&<section className="overflow-hidden rounded-[28px] border border-amber-200 bg-white shadow-card"><div className="border-b border-amber-100 bg-amber-50 px-5 py-4"><h3 className="font-black text-amber-900">Pending Activation</h3><p className="mt-1 text-xs font-bold text-amber-700">هؤلاء تمت إضافتهم للصلاحيات لكن لم ينشئوا حساب Auth بنفس البريد بعد.</p></div><div className="divide-y divide-slate-100">{pending.map(p=><article key={p.email} className="grid gap-4 p-5 lg:grid-cols-[1.3fr_.65fr_.55fr_.9fr] lg:items-center"><div><strong className="block text-sm">{p.full_name||'بانتظار الاسم'}</strong><span className="mt-1 block text-xs font-semibold text-slate-400">{p.email}</span></div><select value={p.role} disabled={busy===`p-${p.email}`} onChange={e=>updatePending(p,{role:e.target.value})} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black outline-none">{roles.map(r=><option key={r} value={r}>{roleLabel[r]}</option>)}</select><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${p.active?'bg-amber-50 text-amber-700':'bg-slate-100 text-slate-500'}`}>{p.active?'Pending':'Disabled'}</span><div className="flex flex-wrap gap-2"><button onClick={()=>copyActivation(p)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600"><Copy size={14}/> نسخ رابط التفعيل</button><button disabled={busy===`p-${p.email}`} onClick={()=>updatePending(p,{active:!p.active})} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600">{p.active?'تعطيل':'تفعيل'}</button></div></article>)}</div></section>}

    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card"><div className="hidden grid-cols-[1.25fr_.7fr_.7fr_.8fr] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-black text-slate-400 md:grid"><span>المستخدم</span><span>الدور</span><span>الحالة</span><span>إجراءات</span></div><div className="divide-y divide-slate-100">{loading?<div className="p-10 text-center text-sm font-bold text-slate-400">جاري تحميل الفريق…</div>:filtered.map(m=><article key={m.id} className="grid gap-4 p-5 md:grid-cols-[1.25fr_.7fr_.7fr_.8fr] md:items-center"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 font-black text-[#0071e3]">{(m.full_name||m.email).slice(0,1).toUpperCase()}</div><div><strong className="block text-sm">{m.full_name||'بدون اسم'}</strong><span className="mt-1 block text-xs font-semibold text-slate-400">{m.email}</span></div></div><div>{m.role==='owner'?<span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-black text-white">Owner</span>:<select value={m.role} disabled={busy===m.id} onChange={e=>setRole(m,e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black outline-none">{roles.map(r=><option key={r} value={r}>{roleLabel[r]}</option>)}</select>}</div><span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-black ${m.active?'bg-emerald-50 text-emerald-700':'bg-slate-100 text-slate-500'}`}>{m.active?'Active':'Inactive'}</span><div>{m.role==='owner'?<span className="text-xs font-bold text-slate-400">محمي</span>:<button disabled={busy===m.id} onClick={()=>setActive(m,!m.active)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50">{m.active?'تعطيل':'تفعيل'}</button>}</div></article>)}</div></section>

    {open&&<div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/25 p-4 backdrop-blur-sm"><form onSubmit={addMember} className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-6 shadow-soft md:p-8"><div className="flex items-start justify-between"><div><div className="eyebrow">TEAM ACCESS</div><h3 className="mt-4 text-2xl font-black">إضافة عضو للفريق</h3><p className="mt-2 text-sm leading-7 text-slate-500">بعد الإضافة أرسل رابط التفعيل للموظف. دور Admin لا يمكن منحه إلا بواسطة Owner.</p></div><button type="button" onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><X size={18}/></button></div><div className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-sm font-extrabold">الاسم</span><input name="full_name" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">البريد الإلكتروني</span><input name="email" required type="email" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none"/></label><label className="block"><span className="mb-2 block text-sm font-extrabold">الدور</span><select name="role" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 outline-none">{roles.map(r=><option key={r} value={r}>{roleLabel[r]}</option>)}</select></label></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="btn-secondary">إلغاء</button><button disabled={busy==='add'} className="btn-primary disabled:opacity-50">{busy==='add'?'جاري الإضافة…':'إضافة للفريق'}</button></div></form></div>}
  </div>
}
