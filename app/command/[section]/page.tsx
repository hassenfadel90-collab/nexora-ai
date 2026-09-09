import { Bot, BriefcaseBusiness, ChartNoAxesCombined, CheckSquare2, CircleDollarSign, FileText, Gauge, Settings, ShieldCheck, Users, Workflow, Activity } from 'lucide-react'

const sections: Record<string,{title:string;description:string;icon:any}> = {
  leads:{title:'CRM / Leads',description:'إدارة العملاء المحتملين، المراحل، التعيين، التحليل والمتابعة.',icon:Gauge},
  projects:{title:'المشاريع',description:'إدارة المشاريع، المراحل، الفريق، المواعيد والتسليم.',icon:BriefcaseBusiness},
  tasks:{title:'المهام',description:'قائمة وKanban وتقويم للمهام، الأولويات والمراجعات.',icon:CheckSquare2},
  team:{title:'الفريق',description:'الموظفون، الأدوار، الصلاحيات، الحالة والقدرة التشغيلية.',icon:Users},
  proposals:{title:'العروض',description:'إنشاء ومراجعة وتتبع عروض المشاريع وربطها بالعملاء.',icon:FileText},
  invoices:{title:'الفواتير',description:'الفواتير، الدفعات، الحالة والسجل المالي للمشاريع.',icon:CircleDollarSign},
  agents:{title:'AI Agents',description:'إدارة وكلاء الذكاء الاصطناعي، المهام، السجلات والحالة.',icon:Bot},
  automations:{title:'Automations',description:'المسارات، المشغلات، حالة التشغيل، الأخطاء وآخر التنفيذات.',icon:Workflow},
  approvals:{title:'الموافقات',description:'موافقات التصميم، العروض، الدفعات، الطلبات والتسليم.',icon:ShieldCheck},
  analytics:{title:'التحليلات',description:'تقارير المشاريع، التحويل، الإيراد، الإنتاجية وصحة العمليات.',icon:ChartNoAxesCombined},
  activity:{title:'سجل النشاط',description:'سجل موحد للأحداث المهمة والتغييرات والإجراءات.',icon:Activity},
  settings:{title:'الإعدادات',description:'إعدادات الشركة، الصلاحيات، التكاملات والتفضيلات.',icon:Settings},
}

export default async function CommandSectionPage({params}:{params:Promise<{section:string}>}){
  const {section}=await params
  const item=sections[section]
  if(!item)return <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-card"><h2 className="text-2xl font-black">الصفحة غير موجودة</h2></div>
  const Icon=item.icon
  return <div className="mx-auto max-w-[1500px] space-y-5">
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card md:p-8"><div className="flex items-start justify-between gap-6"><div><div className="eyebrow">NEXORA COMMAND</div><h2 className="mt-5 text-3xl font-black tracking-[-.025em] md:text-4xl">{item.title}</h2><p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-500">{item.description}</p></div><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-[#0071e3]"><Icon size={24}/></div></div></section>
    <section className="grid gap-4 xl:grid-cols-[1fr_340px]"><article className="min-h-[520px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-card"><div className="flex items-center justify-between"><h3 className="text-lg font-black">Workspace</h3><button className="btn-primary">+ إضافة جديد</button></div><div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center"><strong className="text-lg">هيكل {item.title} جاهز</strong><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">المرحلة التالية تستبدل هذا الجزء بالمكونات المرتبطة مباشرة بجداول وRPC Supabase الحالية.</p></div></article><aside className="space-y-4"><article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-card"><span className="text-xs font-black text-slate-400">QUICK STATUS</span><strong className="mt-3 block text-2xl font-black">Ready</strong><p className="mt-2 text-xs leading-6 text-slate-400">Route, layout and permission shell are active.</p></article><article className="rounded-[24px] border border-slate-200 bg-[#07111f] p-5 text-white shadow-card"><span className="text-xs font-black text-blue-300">V2 ARCHITECTURE</span><p className="mt-4 text-sm leading-7 text-slate-300">كل Module صار Route مستقل بدل ملف JavaScript ضخم واحد.</p></article></aside></section>
  </div>
}
