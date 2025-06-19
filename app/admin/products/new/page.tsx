import { ProductForm } from "@/components/admin/product-form"
import { MobileHeader } from "@/components/layout/mobile-header"

export default function NewProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader title="Tạo Sản Phẩm" showBack={true} />
      
      {/* Breadcrumb - Desktop only */}
      <div className="bg-white py-4 hidden md:block border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Admin</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Sản phẩm</span>
            <span className="text-gray-400">/</span>
            <span className="text-amber-600 font-medium">Tạo mới</span>
          </div>
        </div>
      </div>

      {/* Page Header - Desktop only */}
      <section className="py-8 bg-white hidden md:block">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Tạo Sản Phẩm Mới
            </h1>
            <p className="text-lg text-gray-600">
              Thêm sản phẩm mới vào hệ thống với hình ảnh và thông tin chi tiết
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          <ProductForm />
        </div>
      </section>
    </div>
  )
}
