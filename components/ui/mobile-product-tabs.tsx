"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MobileProductTabsProps {
  productDetail: any
}

export function MobileProductTabs({ productDetail }: MobileProductTabsProps) {
  const [activeSection, setActiveSection] = useState<string | null>("specifications")

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  return (
    <div className="md:hidden space-y-4">
      {/* Specifications */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection("specifications")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Thông số kỹ thuật</CardTitle>
            {activeSection === "specifications" ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {activeSection === "specifications" && (
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Chất liệu:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.material}</span>
              </div>
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Xuất xứ:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.origin}</span>
              </div>
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Bảo hành:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.warranty}</span>
              </div>
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Chống cháy:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.fireResistant}</span>
              </div>
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Chống ẩm:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.moistureResistant}</span>
              </div>
              <div className="flex flex-col py-2 border-b">
                <span className="font-medium text-sm mb-1">Cách lắp đặt:</span>
                <span className="text-sm text-gray-600">{productDetail.specifications.installation}</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Installation */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection("installation")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Hướng dẫn lắp đặt</CardTitle>
            {activeSection === "installation" ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {activeSection === "installation" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <span className="bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">1</span>
                  Chuẩn bị bề mặt
                </h4>
                <p className="text-gray-600 text-sm ml-7">Làm sạch bề mặt tường, đảm bảo khô ráo và phẳng.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <span className="bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">2</span>
                  Đo đạc và cắt
                </h4>
                <p className="text-gray-600 text-sm ml-7">
                  Đo kích thước chính xác và cắt tấm gỗ ép theo kích thước cần thiết.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <span className="bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">3</span>
                  Lắp đặt
                </h4>
                <p className="text-gray-600 text-sm ml-7">
                  Sử dụng keo chuyên dụng hoặc ốc vít để cố định tấm gỗ ép lên tường.
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm flex items-center">
                  <span className="bg-amber-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2">4</span>
                  Hoàn thiện
                </h4>
                <p className="text-gray-600 text-sm ml-7">Kiểm tra và hoàn thiện các mối nối, làm sạch bề mặt.</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Reviews */}
      <Card>
        <CardHeader 
          className="cursor-pointer"
          onClick={() => toggleSection("reviews")}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Đánh giá ({productDetail.reviewCount})</CardTitle>
            {activeSection === "reviews" ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {activeSection === "reviews" && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Rating Summary */}
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">{productDetail.rating}</div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(productDetail.rating) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">{productDetail.reviewCount} đánh giá</p>
                </div>
              </div>

              {/* Sample reviews */}
              <div className="space-y-3">
                <div className="border-b pb-3">
                  <div className="flex flex-col mb-2">
                    <span className="font-medium text-sm">Nguyễn Văn A</span>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-xs text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Sản phẩm chất lượng tốt, màu sắc đẹp, lắp đặt dễ dàng. Rất hài lòng!
                  </p>
                </div>

                <div className="border-b pb-3">
                  <div className="flex flex-col mb-2">
                    <span className="font-medium text-sm">Trần Thị B</span>
                    <div className="flex items-center mt-1">
                      {[...Array(4)].map((_, i) => (
                        <span key={i} className="text-xs text-yellow-400">★</span>
                      ))}
                      <span className="text-xs text-gray-300">★</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Gỗ ép đẹp, vân tự nhiên. Dịch vụ tư vấn nhiệt tình.</p>
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
