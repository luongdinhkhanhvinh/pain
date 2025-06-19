"use client"

import { ArrowLeft, Search, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/ui/language-switcher"

interface MobileHeaderProps {
  title?: string
  showBack?: boolean
  showSearch?: boolean
  showActions?: boolean
  transparent?: boolean
}

export function MobileHeader({ 
  title, 
  showBack = false, 
  showSearch = false, 
  showActions = false,
  transparent = false 
}: MobileHeaderProps) {
  const router = useRouter()

  return (
    <div className={`md:hidden sticky top-0 z-40 ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200'}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <Link href="/" className="flex items-center">
              <Image
                src="/SILKLUX-02.png"
                alt="Silklux"
                width={80}
                height={32}
                className="h-12 w-auto object-contain"
              />
            </Link>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-5 w-5" />
            </Button>
          )}

          {showActions && (
            <>
              <Button variant="ghost" size="sm" className="p-2">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Share2 className="h-5 w-5" />
              </Button>
            </>
          )}

          <LanguageSwitcher />
        </div>
      </div>
    </div>
  )
}
