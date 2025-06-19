import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n/context"
import { MobileLayout } from "@/components/layout/mobile-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Silklux - Premium Luxury Interior Solutions | Nội Thất Cao Cấp",
  description:
    "Premium luxury interior solutions with diverse designs and premium materials. Quality guaranteed, long-term warranty, professional installation. | Chuyên cung cấp giải pháp nội thất cao cấp với đa dạng thiết kế và chất liệu premium. Chất lượng tốt nhất, giá cả hợp lý, bảo hành dài hạn.",
  keywords:
    "luxury interior, premium design, interior solutions, nội thất cao cấp, thiết kế sang trọng, giải pháp nội thất, trang trí nội thất",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <I18nProvider>
          <MobileLayout>
            {children}
          </MobileLayout>
        </I18nProvider>
      </body>
    </html>
  )
}
