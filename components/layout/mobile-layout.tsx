"use client"

import { usePathname } from "next/navigation"
import { Header } from "./header"
import { Footer } from "./footer"
import { BottomNavigation } from "./bottom-navigation"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname()
  
  // Don't apply mobile layout on admin pages
  if (pathname?.startsWith('/admin')) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop: Show Header */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 md:pb-0 pb-16">
        {children}
      </main>
      
      {/* Desktop: Show Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>
      
      {/* Mobile: Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
