import { CommandShell } from '@/components/command-shell'

export default function CommandLayout({children}:{children:React.ReactNode}){
  return <CommandShell>{children}</CommandShell>
}
