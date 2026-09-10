import Link from 'next/link'
import { ArrowUpLeft, CircleCheck, ExternalLink, LayoutDashboard, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const targets=[
  {icon:CircleCheck,title:'الموقع الرئيسي',text:'واجهة NEXORA العامة والطلب المباشر.',href:'/'},
  {icon:LayoutDashboard,title:'NEXORA Command',text:'تسجيل دخول الإدارة والفريق ومساحة التشغيل.',href:'/login'},
  {icon:UserRoundCheck,title:'Client Portal',text:'دخول العميل ومشاريعه وملفاته وتحديثاته.',href:'/portal'},
  {icon:ShieldCheck,title:'Security Center',text:'ملخص ضوابط الوصول وعزل البيانات والموافقات.',href:'/security'},
]

export default function StatusPage(){
  return <main className="min-h-screen"><SiteHeader/><section className="container-shell py-20 md:py-28"><div className="max-w-4xl"><div className="eyebrow"><span className="brand-dot"/> PUBLIC STATUS</div><h1 className="mt-6 text-[clamp(44px,7vw,82px)] font-black leading-[1.02] tracking-[-.045em] text-[#071428]">روابط التحقق المباشر.</h1><p className="mt-6 max-w-3xl text-lg leading-9 text-slate-500">بدل عرض أرقام حالة تجريبية، هذه الصفحة توصلك مباشرة إلى الأجزاء الأساسية من NEXORA للتحقق من الوصول إليها.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2">{targets.map(({icon:Icon,title,text,href})=><article key={title} className="nx-card-soft flex min-h-[210px] flex-col p-7"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-600"><Icon size={20}/></span><span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700"><span className="brand-dot !h-1.5 !w-1.5"/> AVAILABLE</span></div><h2 className="mt-8 text-xl font-black text-[#071428]">{title}</h2><p className="mt-2 text-sm leading-7 text-slate-500">{text}</p><Link href={href} className="mt-auto inline-flex items-center gap-2 pt-6 text-xs font-black text-[#0071e3]">فتح <ExternalLink size={14}/></Link></article>)}</div><div className="mt-10"><Link href="/" className="btn-primary">العودة للموقع <ArrowUpLeft size={17}/></Link></div></section></main>
}
