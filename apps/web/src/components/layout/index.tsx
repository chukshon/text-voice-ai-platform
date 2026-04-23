import React from 'react'
import { NAV_LINKS } from '@/constants'
import { usePathname } from 'next/navigation'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname()

  return (
    <div>index</div>
  )
}

export default AppLayout