import Link from 'next/link'
import { ArrowUpLeft, Languages } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-50 pt-4">
      <div className="container-shell glass flex min-h-[72px] items-center justify-between rounded-[22px] px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="NEXORA AI">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#07111f] text-lg font-black text-white shadow-card">N</span>
          <span className="font-[var(--font-inter)] text-[15px] font-extrabold tracking-[.18em] text-slate-950">NEXORA <b className="text-[#0071e3]">AI</b></span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] font-bold text-slate-500 lg:flex">
          <a href="#services">الخدمات</a>
          <a href="#platform">المنصة</a>
          <a href="#process">كيف نعمل</a>
          <a href="#contact">ابدأ مشروعك</a>
          <Link href="/portal">بوابة العملاء</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 sm:flex">
            <Languages size={16} /> EN
          </button>
          <Link href="/login" className="btn-primary text-sm">دخول الإدارة <ArrowUpLeft size={16} /></Link>
        </div>
      </div>
    </header>
  )
}
