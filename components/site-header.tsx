'use client'

import Link from 'next/link'
import { ArrowUpLeft, Languages, Menu, X } from 'lucide-react'
import { useState } from 'react'

type Locale='ar'|'en'

export function SiteHeader({locale='ar'}:{locale?:Locale}) {
  const [open,setOpen]=useState(false)
  const ar=locale==='ar'
  const labels=ar
    ? {services:'الخدمات',platform:'المنصة',process:'كيف نعمل',contact:'ابدأ مشروعك',portal:'بوابة العملاء',login:'دخول الإدارة',switch:'EN'}
    : {services:'Services',platform:'Platform',process:'How we work',contact:'Start a project',portal:'Client portal',login:'Staff login',switch:'AR'}

  const nav=<>
    <a href="#services" onClick={()=>setOpen(false)}>{labels.services}</a>
    <a href="#platform" onClick={()=>setOpen(false)}>{labels.platform}</a>
    <a href="#process" onClick={()=>setOpen(false)}>{labels.process}</a>
    <a href="#contact" onClick={()=>setOpen(false)}>{labels.contact}</a>
    <Link href="/portal" onClick={()=>setOpen(false)}>{labels.portal}</Link>
  </>

  return <header className="sticky top-3 z-50 pt-3" dir={ar?'rtl':'ltr'}>
    <div className="container-shell glass relative flex min-h-[72px] items-center justify-between rounded-[22px] px-3 md:px-6">
      <Link href={ar?'/':'/en'} className="flex items-center gap-3" aria-label="NEXORA AI">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-100 bg-white shadow-card"><img src="/nexora-mark.svg" alt="NEXORA" className="h-9 w-9"/></span>
        <span className="hidden font-[var(--font-inter)] text-[15px] font-extrabold tracking-[.18em] text-slate-950 sm:inline">NEXORA <b className="text-[#0071e3]">AI</b></span>
      </Link>

      <nav className="hidden items-center gap-7 text-[13px] font-bold text-slate-500 lg:flex">{nav}</nav>

      <div className="flex items-center gap-2">
        <Link href={ar?'/en':'/'} className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 sm:flex"><Languages size={16}/>{labels.switch}</Link>
        <Link href="/login" className="btn-primary min-h-11 px-3 text-xs sm:px-4 sm:text-sm">{labels.login}<ArrowUpLeft size={16}/></Link>
        <button type="button" onClick={()=>setOpen(v=>!v)} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden" aria-label="Menu">{open?<X size={19}/>:<Menu size={19}/>}</button>
      </div>

      {open&&<div className="absolute left-0 right-0 top-[78px] rounded-[22px] border border-slate-200 bg-white p-3 shadow-soft lg:hidden"><nav className="grid gap-1 text-sm font-extrabold text-slate-600 [&_a]:rounded-xl [&_a]:px-4 [&_a]:py-3 [&_a:hover]:bg-slate-50">{nav}<Link href={ar?'/en':'/'} onClick={()=>setOpen(false)} className="flex items-center gap-2"><Languages size={16}/>{ar?'English':'العربية'}</Link></nav></div>}
    </div>
  </header>
}
