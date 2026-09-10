'use client'

import Link from 'next/link'
import { ArrowUpLeft, Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { withBasePath } from '@/lib/base-path'

type Locale='ar'|'en'

export function SiteHeader({locale='ar'}:{locale?:Locale}) {
  const [open,setOpen]=useState(false)
  const ar=locale==='ar'
  const labels=ar
    ? {services:'الخدمات',platform:'المنصة',process:'كيف نعمل',insights:'الرؤى',portal:'بوابة العملاء',login:'دخول الإدارة',switch:'EN'}
    : {services:'Services',platform:'Platform',process:'How we work',insights:'Insights',portal:'Client portal',login:'Staff login',switch:'AR'}

  const nav=<>
    <a href="#services" onClick={()=>setOpen(false)}>{labels.services}</a>
    <a href="#platform" onClick={()=>setOpen(false)}>{labels.platform}</a>
    <a href="#process" onClick={()=>setOpen(false)}>{labels.process}</a>
    <Link href="/insights" onClick={()=>setOpen(false)}>{labels.insights}</Link>
    <Link href="/portal" onClick={()=>setOpen(false)}>{labels.portal}</Link>
  </>

  return <header className="sticky top-0 z-50 pt-3" dir={ar?'rtl':'ltr'}>
    <div className="container-shell glass relative flex min-h-[70px] items-center justify-between rounded-[22px] px-3 md:px-5">
      <Link href={ar?'/':'/en'} className="flex items-center gap-3" aria-label="NEXORA AI">
        <span className="grid h-11 w-11 place-items-center rounded-[14px] border border-slate-200/70 bg-white p-1.5 shadow-card">
          <img src={withBasePath('/nexora-mark.svg')} alt="NEXORA" className="h-full w-full"/>
        </span>
        <span className="hidden font-[var(--font-inter)] text-[15px] font-black tracking-[.2em] text-[#071428] sm:inline">NEXORA</span>
      </Link>

      <nav className="hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1 text-[12px] font-extrabold text-slate-500 lg:flex [&_a]:rounded-full [&_a]:px-4 [&_a]:py-2 [&_a]:transition [&_a:hover]:bg-slate-50 [&_a:hover]:text-slate-950">{nav}</nav>

      <div className="flex items-center gap-2">
        <Link href={ar?'/en':'/'} className="hidden h-11 items-center gap-2 rounded-[13px] border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-600 sm:flex"><Languages size={16}/>{labels.switch}</Link>
        <Link href="/login" className="btn-primary min-h-11 px-3 text-xs sm:px-4 sm:text-sm">{labels.login}<ArrowUpLeft size={16}/></Link>
        <button type="button" onClick={()=>setOpen(v=>!v)} className="grid h-11 w-11 place-items-center rounded-[13px] border border-slate-200 bg-white text-slate-600 lg:hidden" aria-label={open?'Close menu':'Open menu'}>{open?<X size={19}/>:<Menu size={19}/>}</button>
      </div>

      {open&&<div className="absolute left-0 right-0 top-[78px] overflow-hidden rounded-[22px] border border-slate-200 bg-white p-3 shadow-soft lg:hidden"><nav className="grid gap-1 text-sm font-extrabold text-slate-600 [&_a]:rounded-xl [&_a]:px-4 [&_a]:py-3 [&_a:hover]:bg-slate-50">{nav}<Link href={ar?'/en':'/'} onClick={()=>setOpen(false)} className="flex items-center gap-2"><Languages size={16}/>{ar?'English':'العربية'}</Link></nav></div>}
    </div>
  </header>
}
