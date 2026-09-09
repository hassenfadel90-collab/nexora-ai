import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata:Metadata={
  title:'NEXORA AI — Software, AI & Automation',
  description:'Custom software, AI agents, business systems and automation for modern companies.',
  alternates:{canonical:'/en',languages:{'ar-IQ':'/','en':'/en'}},
  openGraph:{title:'NEXORA AI — Software, AI & Automation',description:'Build, automate and scale with connected software and AI systems.',locale:'en_US',type:'website'},
}

export default function EnglishLayout({children}:{children:ReactNode}){
  return <div dir="ltr" lang="en">{children}</div>
}
