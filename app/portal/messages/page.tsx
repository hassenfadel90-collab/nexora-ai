'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LogOut, MessageSquareMore, Send } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Project={id:string;title:string;status:string}
type Comment={id:string;entity_id:string;body:string;author_id:string;created_at:string}
type ClientProfile={id:string;email:string;full_name:string|null;active:boolean}

export default function ClientMessagesPage(){
  const [profile,setProfile]=useState<ClientProfile|null>(null)
  const [projects,setProjects]=useState<Project[]>([])
  const [comments,setComments]=useState<Comment[]>([])
  const [selected,setSelected]=useState('')
  const [loading,setLoading]=useState(true)
  const [busy,setBusy]=useState(false)
  const [error,setError]=useState('')

  async function load(){
    const sb=createClient();setError('')
    const {data:{user}}=await sb.auth.getUser();if(!user){setLoading(false);return}
    const {data:p}=await sb.from('client_profiles').select('id,email,full_name,active').eq('id',user.id).maybeSingle();if(!p?.active){setLoading(false);return}
    setProfile(p as ClientProfile)
    const [pr,co]=await Promise.all([
      sb.from('projects').select('id,title,status').order('updated_at',{ascending:false}),
      sb.from('comments').select('id,entity_id,body,author_id,created_at').eq('entity_type','project').eq('visibility','client').order('created_at',{ascending:true}).limit(500)
    ])
    if(pr.error||co.error)setError((pr.error||co.error)?.message||'تعذر تحميل الرسائل.')
    setProjects((pr.data||[]) as Project[]);setComments((co.data||[]) as Comment[])
    if(!selected&&pr.data?.length)setSelected(pr.data[0].id)
    setLoading(false)
  }
  useEffect(()=>{load()},[])
  const thread=useMemo(()=>comments.filter(c=>c.entity_id===selected),[comments,selected])

  async function send(e:FormEvent<HTMLFormElement>){
    e.preventDefault();if(!selected||busy||!profile)return
    const form=e.currentTarget,body=String(new FormData(form).get('body')||'').trim();if(!body)return
    setBusy(true);setError('')
    const sb=createClient();const {error}=await sb.from('comments').insert({entity_type:'project',entity_id:selected,body:body.slice(0,5000),visibility:'client',author_id:profile.id})
    setBusy(false);if(error)return setError(error.message);form.reset();await load()
  }
  async function logout(){const sb=createClient();await sb.auth.signOut();location.href='/portal/login'}

  if(loading)return <main className="grid min-h-screen place-items-center bg-[#f6f7f9]"><div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 font-bold text-slate-500 shadow-card">جاري تحميل الرسائل…</div></main>
  if(!profile)return <main className="grid min-h-screen place-items-center bg-[#f6f7f9] px-4"><div className="w-full max-w-lg rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-soft"><h1 className="text-2xl font-black">يجب تسجيل دخول العميل</h1><Link href="/portal/login" className="btn-primary mt-6">تسجيل الدخول</Link></div></main>

  return <main className="min-h-screen bg-[#f6f7f9]">
    <header className="border-b border-slate-200 bg-white"><div className="container-shell flex min-h-[76px] items-center justify-between"><div className="flex items-center gap-3"><Link href="/portal" className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200"><ArrowLeft size={17}/></Link><div><div className="text-[10px] font-black tracking-[.16em] text-[#0071e3]">NEXORA PORTAL</div><strong>Project Messages</strong></div></div><button onClick={logout} className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500"><LogOut size={17}/></button></div></header>
    <div className="container-shell py-8"><section className="grid min-h-[680px] overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-card lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-slate-200 p-3 lg:border-b-0 lg:border-l"><div className="px-2 py-3"><h1 className="text-xl font-black">رسائل المشاريع</h1><p className="mt-2 text-xs font-bold leading-6 text-slate-400">اختر المشروع الذي تريد التواصل بشأنه.</p></div><div className="mt-2 space-y-1">{projects.map(p=><button key={p.id} onClick={()=>setSelected(p.id)} className={`flex w-full items-center gap-3 rounded-2xl p-3 text-right ${selected===p.id?'bg-blue-50':'hover:bg-slate-50'}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${selected===p.id?'bg-[#0071e3] text-white':'bg-slate-100 text-slate-500'}`}><MessageSquareMore size={17}/></span><div className="min-w-0"><strong className="block truncate text-sm">{p.title}</strong><span className="mt-1 block text-[11px] font-bold text-slate-400">{p.status}</span></div></button>)}</div></aside>
      <div className="flex min-h-[600px] flex-col"><header className="border-b border-slate-100 p-5"><strong>{projects.find(p=>p.id===selected)?.title||'اختر مشروعاً'}</strong><span className="mt-1 block text-xs font-bold text-slate-400">المحادثة مرئية لك ولفريق NEXORA فقط.</span></header>{error&&<div className="m-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}<div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/60 p-5">{thread.length?thread.map(c=>{const mine=c.author_id===profile.id;return <article key={c.id} className={`max-w-[85%] rounded-2xl border p-4 ${mine?'mr-auto border-blue-100 bg-blue-50':'ml-auto border-slate-200 bg-white'}`}><div className="flex items-center justify-between gap-4"><strong className="text-[11px]">{mine?'أنت':'NEXORA'}</strong><span className="text-[10px] font-bold text-slate-400">{new Date(c.created_at).toLocaleString('ar-IQ')}</span></div><p className="mt-2 whitespace-pre-line text-sm font-semibold leading-7 text-slate-700">{c.body}</p></article>}):<div className="grid h-full min-h-[320px] place-items-center text-sm font-bold text-slate-400">لا توجد رسائل في هذا المشروع بعد.</div>}</div><form onSubmit={send} className="flex gap-2 border-t border-slate-100 bg-white p-4"><textarea name="body" required disabled={!selected} rows={2} maxLength={5000} className="min-h-12 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-blue-400" placeholder="اكتب رسالتك لفريق NEXORA…"/><button disabled={!selected||busy} className="grid w-14 shrink-0 place-items-center rounded-2xl bg-[#0071e3] text-white disabled:opacity-40"><Send size={18}/></button></form></div>
    </section></div>
  </main>
}
