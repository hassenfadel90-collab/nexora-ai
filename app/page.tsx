import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, Bot, Boxes, ChartNoAxesCombined, CheckCircle2, CircleGauge, Cpu, FileStack, Gauge, Layers3, MessageSquareMore, ShieldCheck, Sparkles, Workflow, Zap } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { ContactForm } from '@/components/contact-form'

const services = [
  { icon: Layers3, code:'01', title:'منصات وتجارب رقمية', text:'مواقع ومنتجات SaaS وPortals سريعة، واضحة ومصممة للتحويل والنمو.', tags:['UI/UX','Web Apps','SaaS'] },
  { icon: Boxes, code:'02', title:'أنظمة أعمال مخصصة', text:'CRM، مشاريع، موظفين، ملفات، تقارير وصلاحيات مبنية حول سير عمل شركتك.', tags:['CRM','Dashboards','API'] },
  { icon: Bot, code:'03', title:'وكلاء ذكاء اصطناعي', text:'AI Agents للمبيعات والدعم والبحث والتحليل، مع موافقات بشرية قبل الإجراءات الحساسة.', tags:['AI Agents','Copilot','RAG'] },
  { icon: Workflow, code:'04', title:'أتمتة العمليات', text:'نربط النماذج والبريد وقواعد البيانات والخدمات الخارجية في Workflow واحد.', tags:['Automation','Integrations','Ops'] },
]

const flow = [
  ['Website','التقاط الطلب والنية'],['CRM','تنظيم العميل والفرصة'],['AI','تحليل وتجهيز ذكي'],['Automation','تنفيذ الخطوات المتكررة'],['Projects','تسليم منظم'],['Analytics','قرار مبني على البيانات']
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <section className="container-shell grid min-h-[820px] items-center gap-12 py-16 lg:grid-cols-[.88fr_1.12fr] lg:py-20">
        <div className="order-2 lg:order-1">
          <div className="eyebrow"><span className="brand-dot"/> AI / SOFTWARE / AUTOMATION</div>
          <h1 className="mt-7 max-w-[760px] text-[clamp(52px,6.8vw,96px)] font-black leading-[.97] tracking-[-.05em] text-[#071428]">
            من الأفكار
            <span className="nx-gradient-text block">إلى فعل ذكي.</span>
          </h1>
          <p className="mt-7 max-w-[690px] text-[17px] font-medium leading-9 text-slate-500 md:text-[20px]">
            NEXORA تبني البرمجيات والذكاء الاصطناعي والأتمتة كنظام واحد: واجهة راقية للعميل، وتشغيل واضح للفريق، وبيانات حقيقية للإدارة.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary min-w-[164px]">ابدأ مشروعك <ArrowUpLeft size={18}/></a>
            <Link href="/portal" className="btn-secondary min-w-[164px]">بوابة العملاء <ArrowLeft size={18}/></Link>
          </div>
          <div className="mt-10 grid max-w-[650px] grid-cols-1 gap-3 text-sm font-extrabold text-slate-500 sm:grid-cols-3">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500"/> نظام موحّد</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500"/> صلاحيات آمنة</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500"/> Mobile-first</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto max-w-[790px]">
            <div className="absolute -inset-10 -z-10 rounded-full bg-blue-300/20 blur-3xl"/>
            <div className="nx-card nx-shadow overflow-hidden p-3 md:p-4">
              <div className="nx-mesh relative overflow-hidden rounded-[24px] border border-slate-200/80 bg-[#fbfdff] p-4 md:p-6">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[13px] border border-blue-100 bg-white p-1.5 shadow-card"><img src="nexora-mark.svg" alt="NEXORA" className="h-full w-full"/></div>
                    <div><div className="nx-kicker text-[#0071e3]">NEXORA COMMAND</div><h2 className="mt-1 text-sm font-black md:text-base">Executive Overview</h2></div>
                  </div>
                  <span className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700"><span className="brand-dot !h-1.5 !w-1.5"/> LIVE</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
                  {[['12','Active Projects'],['18','New Leads'],['7','Tasks Due'],['36','Automations'],['8','Team Active']].map(([n,l])=><div className="metric-tile" key={l}><strong className="font-[var(--font-inter)] text-2xl font-black text-[#071428]">{n}</strong><span className="mt-2 block text-[10px] font-extrabold leading-4 text-slate-400">{l}</span></div>)}
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_.82fr]">
                  <div className="metric-tile min-h-[280px]">
                    <div className="flex items-center justify-between"><div><span className="nx-kicker text-slate-400">PROJECT STATUS</span><h3 className="mt-1 text-sm font-black">Portfolio health</h3></div><CircleGauge size={19} className="text-[#0071e3]"/></div>
                    <div className="mt-8 grid grid-cols-[145px_1fr] items-center gap-5">
                      <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full" style={{background:'conic-gradient(#0071e3 0 62%, #55c8ff 62% 82%, #e8edf4 82% 100%)'}}><div className="grid h-20 w-20 place-items-center rounded-full bg-white"><div className="text-center"><b className="font-[var(--font-inter)] text-2xl">82%</b><span className="block text-[9px] font-bold text-slate-400">ON TRACK</span></div></div></div>
                      <div className="space-y-3 text-xs font-extrabold text-slate-500"><div className="flex justify-between"><span>Active</span><b className="text-slate-900">8</b></div><div className="flex justify-between"><span>Review</span><b className="text-slate-900">3</b></div><div className="flex justify-between"><span>Planning</span><b className="text-slate-900">1</b></div></div>
                    </div>
                  </div>

                  <div className="metric-tile min-h-[280px]">
                    <div className="flex items-center justify-between"><div><span className="nx-kicker text-slate-400">LEAD PIPELINE</span><h3 className="mt-1 text-sm font-black">Conversion flow</h3></div><ChartNoAxesCombined size={19} className="text-[#0071e3]"/></div>
                    <div className="mt-8 flex h-36 items-end gap-2">{[38,64,48,82,58,72,91].map((h,i)=><i key={i} style={{height:`${h}%`}} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#006bd8] to-[#70c9ff]"/>)}</div>
                    <div className="mt-4 flex justify-between text-[9px] font-extrabold text-slate-400"><span>NEW</span><span>QUALIFIED</span><span>PROPOSAL</span><span>WON</span></div>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="metric-tile"><Sparkles size={18} className="text-[#0071e3]"/><b className="mt-5 block text-sm">AI Assistant</b><p className="mt-1 text-[11px] leading-5 text-slate-400">3 actions ready for review.</p></div>
                  <div className="metric-tile"><ShieldCheck size={18} className="text-emerald-600"/><b className="mt-5 block text-sm">System Health</b><p className="mt-1 text-[11px] leading-5 text-slate-400">Core services healthy.</p></div>
                  <div className="metric-tile"><Zap size={18} className="text-amber-500"/><b className="mt-5 block text-sm">Automation</b><p className="mt-1 text-[11px] leading-5 text-slate-400">7 workflows active today.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell pb-8"><div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-[20px] border border-slate-200/80 bg-white/75 px-5 py-5 text-[10px] font-black tracking-[.14em] text-slate-400 shadow-card"><span>WEB APPS</span><span>AI AGENTS</span><span>AUTOMATION</span><span>CRM</span><span>DASHBOARDS</span><span>CLIENT PORTALS</span><span>ANALYTICS</span></div></section>

      <section id="services" className="container-shell py-24 md:py-32">
        <div className="max-w-4xl"><div className="eyebrow">WHAT WE BUILD</div><h2 className="mt-6 text-[clamp(38px,5vw,70px)] font-black leading-[1.04] tracking-[-.04em] text-[#071428]">مو مجرد واجهة جميلة. نظام يشتغل فعلاً.</h2><p className="mt-5 max-w-3xl text-lg leading-9 text-slate-500">نبدأ من تجربة المستخدم، ثم نربطها بالبيانات والعمليات والذكاء الاصطناعي حتى يصير المشروع قابل للتشغيل والتوسع.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map(({icon:Icon,code,title,text,tags}) => <article key={title} className="nx-card-soft group min-h-[310px] p-7 transition hover:-translate-y-1 hover:shadow-soft md:p-9"><div className="flex items-start justify-between"><div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-[#0071e3]"><Icon size={23}/></div><span className="nx-kicker text-slate-300">{code}</span></div><h3 className="mt-14 text-2xl font-black text-[#071428]">{title}</h3><p className="mt-4 max-w-xl text-[15px] font-medium leading-8 text-slate-500">{text}</p><div className="mt-6 flex flex-wrap gap-2">{tags.map(tag=><span key={tag} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-black text-slate-500">{tag}</span>)}</div></article>)}
        </div>
      </section>

      <section id="platform" className="container-shell py-10 md:py-16">
        <div className="nx-dark overflow-hidden rounded-[36px] p-7 shadow-soft md:p-12 lg:p-16">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><div className="nx-kicker text-blue-300">ONE CONNECTED SYSTEM</div><h2 className="mt-5 text-[clamp(40px,5vw,72px)] font-black leading-[1.03] tracking-[-.04em]">من أول زيارة إلى آخر تقرير.</h2><p className="mt-6 max-w-xl text-lg leading-9 text-slate-300">كل مرحلة متصلة باللي بعدها. أقل تبديل بين الأدوات، أقل أخطاء، ووضوح أكبر للفريق والعميل.</p><Link href="/command" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-black text-[#071428]">استكشف NEXORA Command <ArrowLeft size={17}/></Link></div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{flow.map(([title,text],i)=><div key={title} className="min-h-[150px] rounded-[22px] border border-white/10 bg-white/[.055] p-5 backdrop-blur"><span className="nx-kicker text-blue-300">0{i+1}</span><b className="mt-10 block text-lg">{title}</b><p className="mt-1 text-xs leading-6 text-slate-400">{text}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="container-shell py-24 md:py-32">
        <div className="grid gap-4 lg:grid-cols-[1.12fr_.88fr]">
          <article className="nx-card-soft p-7 md:p-10"><div className="flex items-center justify-between"><div><div className="eyebrow">AI WORKFORCE</div><h2 className="mt-6 max-w-2xl text-[clamp(36px,4vw,58px)] font-black leading-[1.05] tracking-[-.035em]">ذكاء يساعد الفريق، مو يستبدل القرار.</h2></div><Cpu size={30} className="hidden text-[#0071e3] md:block"/></div><div className="mt-10 grid gap-3 sm:grid-cols-2">{[['Sales Copilot','ترتيب الفرص وتجهيز المتابعة',Gauge],['Operations AI','ملخص العمل والمخاطر',CircleGauge],['Knowledge Assistant','البحث داخل معلومات المشروع',FileStack],['Approval Guard','إيقاف الإجراء الحساس حتى الموافقة',ShieldCheck]].map(([title,text,Icon]:any)=><div key={title} className="rounded-[20px] border border-slate-200 bg-white p-5"><Icon size={18} className="text-[#0071e3]"/><b className="mt-6 block">{title}</b><p className="mt-2 text-xs leading-6 text-slate-500">{text}</p></div>)}</div></article>
          <article className="nx-card-soft p-7 md:p-10"><div className="eyebrow">CLIENT EXPERIENCE</div><h2 className="mt-6 text-[clamp(34px,4vw,52px)] font-black leading-[1.06] tracking-[-.03em]">العميل يشوف اللي يحتاجه فقط.</h2><p className="mt-5 text-base leading-8 text-slate-500">مشاريعه، ملفاته، التحديثات، العروض وطلبات التغيير في Portal مستقل وآمن.</p><div className="mt-10 space-y-3">{[['Project visibility',BriefcaseIconFallback],['Files & deliverables',FileStack],['Messages & updates',MessageSquareMore],['Controlled access',ShieldCheck]].map(([title,Icon]:any)=><div key={title} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0071e3]"><Icon size={18}/></span><b className="text-sm">{title}</b><CheckCircle2 size={17} className="mr-auto text-emerald-500"/></div>)}</div></article>
        </div>
      </section>

      <section id="process" className="container-shell py-20 md:py-28">
        <div className="max-w-3xl"><div className="eyebrow">PROCESS</div><h2 className="mt-6 text-[clamp(38px,5vw,64px)] font-black tracking-[-.04em] text-[#071428]">واضح من الفكرة إلى الإطلاق.</h2></div>
        <div className="mt-12 grid gap-3 md:grid-cols-4">{[['01','Discover','نفهم الهدف والاختناق الحقيقي.'],['02','Design','نبني تجربة ومسار استخدام واضح.'],['03','Build','نربط الواجهة بالبيانات والمنطق.'],['04','Scale','نقيس، نؤتمت ونطوّر.']].map(([n,t,d])=><div key={n} className="nx-card-soft min-h-[230px] p-7"><span className="nx-kicker text-[#0071e3]">{n}</span><h3 className="mt-20 text-2xl font-black">{t}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{d}</p></div>)}</div>
      </section>

      <section id="contact" className="container-shell pb-28 pt-16">
        <div className="nx-dark rounded-[38px] p-6 shadow-soft md:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[.88fr_1.12fr] lg:items-start">
            <div className="lg:sticky lg:top-28"><div className="nx-kicker text-blue-300">BUILDS WHAT&apos;S NEXT</div><h2 className="mt-5 max-w-3xl text-[clamp(40px,5vw,70px)] font-black leading-[1.03] tracking-[-.04em]">خلّي الفكرة تصير نظام.</h2><p className="mt-5 max-w-2xl text-lg leading-9 text-slate-300">احجيلنا شنو تريد تبني، تطور أو تأتمت. الطلب يدخل مباشرة إلى CRM حتى يبدأ بمسار متابعة واضح.</p><div className="mt-8 space-y-3 text-sm font-bold text-slate-300"><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400"/> تسجيل مباشر داخل CRM</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400"/> مراجعة بشرية قبل الإجراءات الحساسة</span><span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-400"/> لا نطلب كلمات مرور أو مفاتيح API</span></div></div>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer className="container-shell border-t border-slate-200 py-8"><div className="flex flex-col gap-5 text-sm font-semibold text-slate-400 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><img src="nexora-mark.svg" alt="NEXORA" className="h-8 w-8"/><span className="font-[var(--font-inter)] font-black tracking-[.16em] text-slate-700">NEXORA</span></div><div className="flex flex-wrap gap-5"><Link href="/insights">Insights</Link><Link href="/security">Security</Link><Link href="/status">Status</Link><Link href="/portal">Client Portal</Link></div><span>© 2026 NEXORA AI</span></div></footer>
    </main>
  )
}

function BriefcaseIconFallback({size=18}:{size?:number}){
  return <Boxes size={size}/>
}
