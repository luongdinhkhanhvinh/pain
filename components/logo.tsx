import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white" | "dark"
  showText?: boolean
  href?: string
}

const sizeClasses = {
  sm: "h-8 w-auto",
  md: "h-12 w-auto", 
  lg: "h-16 w-auto"
}

const logoVariants = {
  default: "/SILKLUX-01.png",
  white: "/SILKLUX-02.png", 
  dark: "/SILKLUX-03.png"
}

export function Logo({ 
  className, 
  size = "md", 
  variant = "default",
  showText = true,
  href = "/"
}: LogoProps) {
  const logoSrc = logoVariants[variant]
  
  const LogoImage = () => (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src={logoSrc}
        alt="Silklux Logo"
        width={200}
        height={80}
        className={cn(sizeClasses[size], "object-contain")}
        priority
      />
      {showText && (
        <span className="text-2xl font-bold text-gray-800">
          Silklux
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        <LogoImage />
      </Link>
    )
  }

  return <LogoImage />
}
