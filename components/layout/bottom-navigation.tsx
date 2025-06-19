"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Package, Info, MessageCircle, User } from "lucide-react"

const navItems = [
  {
    href: "/",
    label: "Trang chủ",
    icon: Home,
  },
  {
    href: "/products",
    label: "Sản phẩm",
    icon: Package,
  },
  {
    href: "/about",
    label: "Giới thiệu",
    icon: Info,
  },
  {
    href: "/contact",
    label: "Liên hệ",
    icon: MessageCircle,
  },
]

export function BottomNavigation() {
  const pathname = usePathname()

  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname?.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? "text-amber-600 bg-amber-50"
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-amber-600" : "text-gray-600"}`} />
              <span className={`text-xs font-medium ${isActive ? "text-amber-600" : "text-gray-600"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
