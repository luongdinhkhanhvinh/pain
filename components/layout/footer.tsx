"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname()
  
  // Don't show footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/SILKLUX-03.png"
                alt="Silklux Logo"
                width={120}
                height={120}
                className="h-14 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-4">
              Chuyên cung cấp giải pháp nội thất cao cấp với thiết kế sang trọng và chất liệu premium.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Sản Phẩm</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Premium Collection
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Luxury Series
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Elite Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Tư vấn thiết kế
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Lắp đặt
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Bảo hành
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên Hệ</h3>
            <div className="space-y-2 text-gray-300">
              <p>TP. Hồ Chí Minh</p>
              <p>0123 456 789</p>
              <p>info@silklux.vn</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
          <p>&copy; 2025 Silklux. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  )
}
