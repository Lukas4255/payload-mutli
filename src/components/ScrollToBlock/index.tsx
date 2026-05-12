'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export const ScrollToBlock: React.FC<{ scrollTo?: string }> = ({ scrollTo }) => {
  const pathname = usePathname()

  useEffect(() => {
    if (!scrollTo) return

    const el = document.getElementById(scrollTo)
    if (el) {
      // Small delay to let the page finish painting before scrolling
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth' })
        history.replaceState(null, '', pathname)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [scrollTo, pathname])

  return null
}
