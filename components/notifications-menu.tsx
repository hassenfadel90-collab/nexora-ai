'use client'

import { useEffect, useState } from 'react'
import { Bell, CheckCheck, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Notification={id:string;notification_type:string;title:string;body:string|null;entity_type:string|null;entity_id:string|null;read_at:string|null;created_at:string}

export function NotificationsMenu(){
  const [open,setOpen]=useState(false)
  const [rows,setRows]=useState<Notification[]>([])
  const [error,setError]=useState('')

  async function load(){
    const sb=createClient()
    const {data,error}=await sb.from('notifications').select('id,notification_type,title,body,entity_type,entity_id,read_at,created_at').order('created_at',{ascending:false}).limit(40)
    if(error){setError(error.message);return}
    setRows((data||[]) as Notification[]);setError('')
  }
  useEffect(()=>{load()},[])

  async function mark(row:Notification){
    if(row.read_at)return
    const sb=createClient();await sb.from('notifications').update({read_at:new Date().toISOString()}).eq('id',row.id);await load()
  }
  async function markAll(){
    const sb=createClient();const unread=rows.filter(x=>!x.read_at).map(x=>x.id);if(!unread.length)return
    await sb.from('notifications').update({read_at:new Date().toISOString()}).in('id',unread);await load()
  }
  const unread=rows.filter(x=>!x.read_at).length

  return <div className="relative">
    <button onClick={()=>{setOpen(v=>!v);if(!open)load()}} className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600" title="الإشعارات"><Bell size={18}/>{unread>0&&<span className="absolute -left-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{unread>99?'99+':unread}</span>}</button>
    {open&&<><button aria-label="إغلاق الإشعارات" onClick={()=>setOpen(false)} className="fixed inset-0 z-40"/><section className="absolute left-0 top-12 z-50 w-[min(92vw,390px)] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-soft"><header className="flex items-center justify-between border-b border-slate-100 p-4"><div><strong className="block">الإشعارات</strong><span className="text-[11px] font-bold text-slate-400">{unread} غير مقروء</span></div><div className="flex gap-1"><button onClick={markAll} className="grid h-9 w-9 place-items-center rounded-xl text-[#0071e3] hover:bg-blue-50" title="تعليم الكل كمقروء"><CheckCheck size={17}/></button><button onClick={()=>setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-50"><X size={17}/></button></div></header><div className="max-h-[60vh] overflow-y-auto p-2">{error?<div className="p-5 text-sm font-bold text-red-600">{error}</div>:rows.length?rows.map(r=><button key={r.id} onClick={()=>mark(r)} className={`block w-full rounded-2xl p-3 text-right transition hover:bg-slate-50 ${!r.read_at?'bg-blue-50/60':'bg-white'}`}><div className="flex items-start gap-3"><span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${!r.read_at?'bg-[#0071e3]':'bg-slate-200'}`}/><div className="min-w-0 flex-1"><strong className="block text-sm leading-6">{r.title}</strong>{r.body&&<p className="mt-1 line-clamp-2 text-xs font-semibold leading-6 text-slate-500">{r.body}</p>}<span className="mt-2 block text-[10px] font-bold text-slate-400">{new Date(r.created_at).toLocaleString('ar-IQ')}</span></div></div></button>):<div className="p-8 text-center text-sm font-bold text-slate-400">لا توجد إشعارات.</div>}</div></section></>}
  </div>
}
