import Link from 'next/link'
import { ArrowLeft, BrainCircuit, Globe2, ShieldCheck, Workflow } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const insights=[
  {n:'01',icon:Globe2,kicker:'WEB SYSTEMS',title:'الموقع مو مجرد واجهة.',text:'الموقع الأقوى يربط التسويق بالبيانات والمتابعة والعمليات. الواجهة تصبح مدخلًا إلى نظام واضح بدل أن تكون صفحات منفصلة.'},
  {n:'02',icon:BrainCircuit,kicker:'AI',title:'الذكاء الاصطناعي يحتاج ضوابط.',text:'نستخدم AI للتحليل والتجهيز والاقتراح، ونبقي الإجراءات الحساسة خلف موافقة بشرية واضحة وقابلة للمراجعة.'},
  {n:'03',icon:Workflow,kicker:'AUTOMATION',title:'الأتمتة تبدأ من الاختناق.',text:'نبدأ من الخطوة التي تستهلك وقتًا أو تسبب أخطاء متكررة، ثم نبني Workflow قابلًا للقياس والتوسع.'},
  {n:'04',icon:ShieldCheck,kicker:'OPERATIONS',title:'الوضوح جزء من المنتج.',text:'لوحة الإدارة وبوابة العميل والصلاحيات ليست إضافات جانبية؛ هي جزء من تجربة التشغيل التي تجعل النظام قابلًا للاستخدام يوميًا.'},
]

export default function InsightsPage(){
  return <main className="min-h-screen"><SiteHeader/><section className="container-shell py-20 md:py-28"><div className="max-w-4xl"><div className="eyebrow">NEXORA INSIGHTS</div><h1 className="mt-6 text-[clamp(44px,7vw,82px)] font-black leading-[1.02] tracking-[-.045em] text-[#071428]">أفكار عملية لبناء أنظمة أعمال أذكى.</h1><p className="mt-6 max-w-3xl text-lg leading-9 text-slate-500">ملاحظات قصيرة من فلسفة NEXORA حول تصميم المنتجات، الذكاء الاصطناعي، الأتمتة وتشغيل الأعمال.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2">{insights.map(({n,icon:Icon,kicker,title,text})=><article key={n} className="nx-card-soft min-h-[300px] p-7 md:p-9"><div className="flex items-start justify-between"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0071e3]"><Icon size={22}/></span><span className="nx-kicker text-slate-300">{n}</span></div><div className="nx-kicker mt-12 text-[#0071e3]">{kicker}</div><h2 className="mt-3 text-2xl font-black text-[#071428]">{title}</h2><p className="mt-4 text-sm font-medium leading-8 text-slate-500">{text}</p></article>)}</div><div className="mt-10 flex flex-wrap gap-2"><Link href="/#contact" className="btn-primary">ابدأ مشروعك</Link><Link href="/security" className="btn-secondary">Security Center <ArrowLeft size={16}/></Link></div></section></main>
}
