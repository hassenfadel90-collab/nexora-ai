import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const basePath=process.env.NEXT_PUBLIC_BASE_PATH||''

export const metadata:Metadata={
  title:'NEXORA AI — Software, AI & Automation',
  description:'Custom software, AI agents, business systems and automation for modern companies.',
  alternates:{canonical:`${basePath}/en/`,languages:{'ar-IQ':`${basePath}/`,'en':`${basePath}/en/`}},
  openGraph:{title:'NEXORA AI — Software, AI & Automation',description:'Build, automate and scale with connected software and AI systems.',locale:'en_US',type:'website',url:`${basePath}/en/`},
}

export default function EnglishLayout({children}:{children:ReactNode}){
  return <div dir="ltr" lang="en">{children}</div>
}
