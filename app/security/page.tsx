import Link from 'next/link'
import { Activity, ArrowLeft, KeyRound, LockKeyhole, ShieldCheck, UserRoundCheck } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const controls=[
  {icon:KeyRound,title:'الوصول والصلاحيات',items:['Supabase Auth لحسابات الإدارة والعملاء.','أدوار منفصلة للإدارة والفريق.','الواجهة الإدارية تتحقق من الحساب والدور قبل فتح مساحة العمل.']},
  {icon:UserRoundCheck,title:'عزل بيانات العملاء',items:['Client Portal مستقل عن NEXORA Command.','الوصول إلى البيانات محكوم بصلاحيات قاعدة البيانات.','العميل يشاهد المحتوى المخصص لحسابه فقط.']},
  {icon:ShieldCheck,title:'الموافقات البشرية',items:['الإجراءات الحساسة تمر عبر Approval Center.','AI وAutomation يجهزان العمل بدون تجاوز قرار الإدارة.','لا نطلب كلمات مرور أو مفاتيح سرية عبر نموذج الموقع.']},
  {icon:Activity,title:'المراقبة',items:['سجل نشاط للأحداث المدعومة.','متابعة للمشاريع والموافقات والعمليات من داخل Command.','فحص بناء ونشر قبل إصدار GitHub Pages.']},
]

export default function SecurityPage(){
  return <main className="min-h-screen"><SiteHeader/><section className="container-shell py-20 md:py-28"><div className="max-w-4xl"><div className="eyebrow"><LockKeyhole size={14}/> SECURITY CENTER</div><h1 className="mt-6 text-[clamp(44px,7vw,82px)] font-black leading-[1.02] tracking-[-.045em] text-[#071428]">الأمان جزء من بنية النظام.</h1><p className="mt-6 max-w-3xl text-lg leading-9 text-slate-500">نصمم الوصول والصلاحيات وعزل بيانات العملاء كجزء من المنتج نفسه، مو كطبقة تجميل بعد الانتهاء.</p></div><div className="mt-14 grid gap-4 md:grid-cols-2">{controls.map(({icon:Icon,title,items})=><article key={title} className="nx-card-soft p-7 md:p-9"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0071e3]"><Icon size={22}/></span><h2 className="mt-8 text-2xl font-black text-[#071428]">{title}</h2><ul className="mt-5 space-y-3 text-sm font-medium leading-7 text-slate-500">{items.map(item=><li key={item} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0071e3]"/><span>{item}</span></li>)}</ul></article>)}</div><div className="mt-10 flex flex-wrap gap-2"><Link href="/status" className="btn-primary">حالة النظام</Link><Link href="/" className="btn-secondary">العودة للموقع <ArrowLeft size={16}/></Link></div></section></main>
}
