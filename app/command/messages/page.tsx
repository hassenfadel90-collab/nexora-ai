'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { MessageSquareMore, Search, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Project={id:string;title:string;status:string}
type Comment={id:string;entity_id:string;body:string;author_id:string;created_at:string}
type Person={id:string;email:string;full_name:string|null}

export default function MessagesPage(){
  const [projects,setProjects]=useState<Project[]>([])
  const [comments,setComments]=useState<Comment[]>([])
  const [people,setPeople]=useState<Record<string,Person>>({})
  const [selected,setSelected]=useState('')
  const [query,setQuery]=useState('')
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function load(){
    const sb=createClient();setError('')
    const [p,c,staff,clients]=await Promise.all([
      sb.from('projects').select('id,title,status').order('updated_at',{ascending:false}),
      sb.from('comments').select('id,entity_id,body,author_id,created_at').eq('entity_type','project').eq('visibility','client').order('created_at',{ascending:true}).limit(500),
      sb.from('profiles').select('id,email,full_name'),
      sb.from('client_profiles').select('id,email,full_name').eq('active',true)
    ])
    const first=p.error||c.error||staff.error||clients.error;if(first)setError(first.message)
    setProjects((p.data||[]) as Project[]);setComments((c.data||[]) as Comment[])
    const all=[...(staff.data||[]),...(clients.data||[])] as Person[];setPeople(Object.fromEntries(all.map(x=>[x.id,x])))
    if(!selected&&p.data?.length)setSelected(p.data[0].id)
  }
  useEffect(()=>{load()},[])

  const projectRows=useMemo(()=>{const q=query.trim().toLowerCase();return q?projects.filter(p=>p.title.toLowerCase().includes(q)):projects},[projects,query])
  const thread=comments.filter(c=>c.entity_id===selected)
  const lastByProject=useMemo(()=>{const map:Record<string,Comment>={};for(const c of comments)map[c.entity_id]=c;return map},[comments])

  async function send(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!selected||busy)return;setBusy(true);setError('')
    const form=e.currentTarget,body=String(new FormData(form).get('body')||'').trim()
    if(body.length<1){setBusy(false);return}
    try{
      const sb=createClient();const {data:{user}}=await sb.auth.getUser();if(!user)throw new Error('انتهت الجلسة.')
      const {error}=await sb.from('comments').insert({entity_type:'project',entity_id:selected,body:body.slice(0,5000),visibility:'client',author_id:user.id})
      if(error)throw error
      form.reset();await load()
    }catch(err:any){setError(String(err?.message||err))}finally{setBusy(false)}
  }

  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="eyebrow">CLIENT COMMUNICATION</div><h2 className="mt-5 text-3xl font-black md:text-4xl">رسائل المشاريع</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">محادثات مرتبطة بالمشروع ومرئية للعميل. الملاحظات الداخلية تبقى خارج هذا القسم.</p></section>
    {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</div>}
    <section className="grid min-h-[650px] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-card lg:grid-cols-[340px_1fr]">
      <aside className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-l"><div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3"><Search size={16} className="text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="h-11 w-full bg-transparent text-sm outline-none" placeholder="بحث بالمشروع…"/></div><div className="mt-3 max-h-[560px] space-y-1 overflow-y-auto">{projectRows.map(p=>{const last=lastByProject[p.id];return <button key={p.id} onClick={()=>setSelected(p.id)} className={`block w-full rounded-2xl p-3 text-right transition ${selected===p.id?'bg-blue-50':'hover:bg-slate-50'}`}><div className="flex items-center gap-3"><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected===p.id?'bg-[#0071e3] text-white':'bg-slate-100 text-slate-500'}`}><MessageSquareMore size={17}/></span><div className="min-w-0 flex-1"><strong className="block truncate text-sm">{p.title}</strong><span className="mt-1 block truncate text-[11px] font-semibold text-slate-400">{last?last.body:'لا توجد رسائل بعد'}</span></div></div></button>})}</div></aside>
      <div className="flex min-h-[560px] flex-col"><header className="border-b border-slate-100 p-5"><strong>{projects.find(p=>p.id===selected)?.title||'اختر مشروعاً'}</strong><span className="mt-1 block text-xs font-bold text-slate-400">Client-visible project thread</span></header><div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-5">{thread.length?thread.map(c=>{const person=people[c.author_id];return <article key={c.id} className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-4"><div className="flex items-center justify-between gap-3"><strong className="text-xs">{person?.full_name||person?.email||'NEXORA user'}</strong><span className="text-[10px] font-bold text-slate-400">{new Date(c.created_at).toLocaleString('ar-IQ')}</span></div><p className="mt-3 whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">{c.body}</p></article>}):<div className="grid h-full min-h-[300px] place-items-center text-sm font-bold text-slate-400">ابدأ أول رسالة لهذا المشروع.</div>}</div><form onSubmit={send} className="flex gap-2 border-t border-slate-100 bg-white p-4"><textarea name="body" required disabled={!selected} rows={2} maxLength={5000} className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400" placeholder="اكتب رسالة أو تحديثاً للعميل…"/><button disabled={!selected||busy} className="grid w-14 shrink-0 place-items-center rounded-2xl bg-[#0071e3] text-white disabled:opacity-40"><Send size={18}/></button></form></div>
    </section>
  </div>
}
