import Link from 'next/link'
import { ArrowLeft, ArrowUpLeft, Bot, Boxes, ChartNoAxesCombined, CheckCircle2, Cpu, Gauge, Layers3, MessageSquareMore, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'

const services = [
  { icon: Boxes, title: 'أنظمة أعمال مخصصة', text: 'نحوّل سير العمل إلى نظام واضح: CRM، مشاريع، موظفين، ملفات، تقارير وصلاحيات.' },
  { icon: Bot, title: 'وكلاء ذكاء اصطناعي', text: 'AI Agents للمبيعات، البحث، الدعم والتحليل مع موافقات بشرية قبل الإجراءات الحساسة.' },
  { icon: Workflow, title: 'أتمتة العمليات', text: 'ربط النماذج، البريد، قواعد البيانات، CRM والخدمات الخارجية في مسارات تعمل تلقائياً.' },
  { icon: Layers3, title: 'منصات وواجهات رقمية', text: 'مواقع ومنتجات SaaS وPortals سريعة، Mobile-first وقابلة للتوسع.' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <SiteHeader />

      <section className="container-shell grid min-h-[780px] items-center gap-10 py-20 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
        <div className="order-2 lg:order-1">
          <div className="eyebrow"><span className="brand-dot" /> NEXORA BUSINESS OS</div>
          <h1 className="mt-7 max-w-[760px] text-[clamp(52px,7vw,104px)] font-black leading-[.98] tracking-[-.045em] text-slate-950">
            نبني أنظمة
            <span className="block bg-gradient-to-l from-[#0071e3] to-[#5d3fd3] bg-clip-text text-transparent">تبيع، تعمل،</span>
            وتتطور معك.
          </h1>
          <p className="mt-7 max-w-[690px] text-[17px] font-medium leading-9 text-slate-500 md:text-[20px]">
            برمجيات، ذكاء اصطناعي وأتمتة في منصة واحدة. نصمم تجربة حديثة للعميل ونبني خلفها نظام تشغيل حقيقي للفريق والإدارة.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#contact" className="btn-primary min-w-[160px]">ابدأ مشروعك <ArrowUpLeft size={18} /></a>
            <Link href="/command" className="btn-secondary min-w-[160px]">شاهد NEXORA Command <ArrowLeft size={18} /></Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm font-bold text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> عربي / English</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> Role-based access</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-emerald-500" /> AI + Automation</span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="card relative overflow-hidden p-3 md:p-5">
            <div className="absolute inset-0 grid-dots opacity-40" />
            <div className="relative rounded-[24px] border border-slate-200 bg-white p-4 shadow-soft md:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-[10px] font-black tracking-[.18em] text-[#0071e3]">NEXORA COMMAND</div>
                  <h2 className="mt-1 text-lg font-extrabold">Executive Overview</h2>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold text-emerald-700"><span className="brand-dot !h-2 !w-2" /> Live</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[['24','Leads'],['12','Projects'],['36','Automations'],['8','Team']].map(([n,l]) => <div className="metric-tile" key={l}><strong className="font-[var(--font-inter)] text-3xl font-black">{n}</strong><span className="mt-2 block text-xs font-bold text-slate-400">{l}</span></div>)}
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-[1.35fr_.65fr]">
                <div className="metric-tile min-h-[260px]">
                  <div className="flex items-center justify-between"><span className="text-sm font-extrabold">Lead pipeline</span><ChartNoAxesCombined size={18} className="text-[#0071e3]" /></div>
                  <div className="mt-8 flex h-36 items-end gap-2">
                    {[44,72,58,88,64,48,76].map((h,i)=><i key={i} style={{height:`${h}%`}} className="flex-1 rounded-t-lg bg-gradient-to-t from-[#0071e3] to-[#72b7ff]" />)}
                  </div>
                  <div className="mt-5 flex justify-between text-[11px] font-bold text-slate-400"><span>New</span><span>Qualified</span><span>Proposal</span><span>Won</span></div>
                </div>
                <div className="space-y-3">
                  <div className="metric-tile"><Sparkles size={18} className="text-violet-600" /><b className="mt-5 block text-sm">AI Assistant</b><p className="mt-1 text-xs leading-6 text-slate-400">3 actions ready for review.</p></div>
                  <div className="metric-tile"><ShieldCheck size={18} className="text-emerald-600" /><b className="mt-5 block text-sm">System Health</b><p className="mt-1 text-xs leading-6 text-slate-400">All core services healthy.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="container-shell py-24 md:py-32">
        <div className="max-w-3xl"><div className="eyebrow">WHAT WE BUILD</div><h2 className="mt-6 text-[clamp(38px,5vw,70px)] font-black leading-[1.06] tracking-[-.035em]">مو مجرد موقع. نبني طبقة تشغيل كاملة للعمل.</h2><p className="mt-5 text-lg leading-9 text-slate-500">واجهة قوية للعميل، ونظام منظم للفريق، وبيانات واضحة للإدارة.</p></div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map(({icon:Icon,title,text}) => <article key={title} className="card min-h-[280px] p-7 md:p-9"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0071e3]"><Icon size={23} /></div><h3 className="mt-12 text-2xl font-black">{title}</h3><p className="mt-4 max-w-xl text-[15px] font-medium leading-8 text-slate-500">{text}</p></article>)}
        </div>
      </section>

      <section id="platform" className="container-shell py-24 md:py-32">
        <div className="card overflow-hidden p-8 md:p-12 lg:p-16">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div><div className="eyebrow">ONE CONNECTED SYSTEM</div><h2 className="mt-6 text-[clamp(40px,5vw,72px)] font-black leading-[1.03] tracking-[-.04em]">كل شيء متصل. بدون فوضى الأدوات.</h2><p className="mt-6 text-lg leading-9 text-slate-500">Website → Leads → AI → Automation → Projects → Analytics. منصة واحدة تربط رحلة العميل بالعمل الداخلي.</p></div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[['CRM',Gauge],['AI Workforce',Cpu],['Approvals',ShieldCheck],['Client Portal',MessageSquareMore]].map(([label,Icon]:any)=><div key={label} className="metric-tile flex min-h-[140px] flex-col justify-between"><Icon size={22} className="text-[#0071e3]"/><b className="text-lg">{label}</b></div>)}
            </div>
          </div>
        </div>
      </section>

      <section id="process" className="container-shell py-24 md:py-32">
        <div className="max-w-3xl"><div className="eyebrow">PROCESS</div><h2 className="mt-6 text-[clamp(38px,5vw,66px)] font-black tracking-[-.035em]">من الفكرة إلى نظام جاهز للنمو.</h2></div>
        <div className="mt-12 grid gap-3 md:grid-cols-4">{[['01','Discover'],['02','Design'],['03','Build'],['04','Scale']].map(([n,t])=><div key={n} className="card min-h-[210px] p-7"><span className="font-[var(--font-inter)] text-xs font-black text-[#0071e3]">{n}</span><h3 className="mt-20 text-2xl font-black">{t}</h3></div>)}</div>
      </section>

      <section id="contact" className="container-shell pb-28 pt-20">
        <div className="rounded-[36px] bg-[#07111f] p-8 text-white shadow-soft md:p-14 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="text-xs font-black tracking-[.18em] text-blue-300">READY TO BUILD?</div><h2 className="mt-5 max-w-4xl text-[clamp(40px,5vw,76px)] font-black leading-[1.03] tracking-[-.04em]">جاهز نبني الشيء القادم؟</h2><p className="mt-5 max-w-2xl text-lg leading-9 text-slate-300">قل لنا شنو تريد تبني، تأتمت أو تطور. نرتب الفكرة ونحوّلها إلى نظام واضح.</p></div><a href="mailto:hello@nexora.ai" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-6 font-black text-slate-950">ابدأ الآن <ArrowUpLeft size={18}/></a></div>
        </div>
      </section>

      <footer className="container-shell flex flex-col gap-4 border-t border-slate-200 py-8 text-sm font-semibold text-slate-400 md:flex-row md:items-center md:justify-between"><span>NEXORA AI © 2026</span><span>Software • AI • Automation</span></footer>
    </main>
  )
}
