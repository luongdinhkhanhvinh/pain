"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileHeader } from "@/components/layout/mobile-header"
import { useTranslation } from "@/lib/i18n/context"

interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  category: string
  colors: string[]
  sizes: string[]
  thickness: string[]
  features: string[]
  images: string[]
}

export default function ProductDetail() {
  const { t } = useTranslation()
  const params = useParams()
  const productId = params.id as string
  
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('Fetching product:', productId)
        const response = await fetch(`/api/products/${productId}`)
        const result = await response.json()
        console.log('API Response:', result)

        if (result.success) {
          const product = result.data
          
          // Transform API data to match our interface
          const transformedProduct: ProductDetail = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: Number(product.price),
            category: product.category,
            colors: product.colors || [],
            sizes: product.sizes || [],
            thickness: product.thickness || [],
            features: product.features || [],
            images: product.images || []
          }

          setProductDetail(transformedProduct)
          console.log('Product loaded:', transformedProduct)
        } else {
          console.error('Failed to fetch product:', result.error)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <MobileHeader showBack={true} showActions={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state if product not found
  if (!productDetail) {
    return (
      <div className="min-h-screen bg-white">
        <MobileHeader showBack={true} showActions={false} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{t('products.results.noResults')}</p>
              <Button onClick={() => window.history.back()}>
                {t('common.back')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formattedPrice = productDetail.price.toLocaleString("vi-VN")

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader showBack={true} showActions={false} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={productDetail.images[selectedImage] || "/placeholder.svg"}
                alt={productDetail.name}
                fill
                className="object-cover"
              />
            </div>

            {productDetail.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productDetail.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-amber-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${productDetail.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{productDetail.category}</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{productDetail.name}</h1>
              <p className="text-gray-600 leading-relaxed">{productDetail.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-amber-600">{formattedPrice}đ</span>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {productDetail.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.colors')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.colors.map((color) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {productDetail.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.sizes')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.sizes.map((size) => (
                      <Badge key={size} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {productDetail.thickness.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.thickness')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {productDetail.thickness.map((thickness) => (
                      <Badge key={thickness} variant="outline">
                        {thickness}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {productDetail.features.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">{t('productDetail.features')}:</h3>
                <div className="flex flex-wrap gap-2">
                  {productDetail.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {t('products.card.contact')}
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          <p>Product ID: {productId}</p>
          <p>Product Name: {productDetail.name}</p>
          <p>Images Count: {productDetail.images.length}</p>
          <p>Colors: {productDetail.colors.join(', ')}</p>
          <p>Sizes: {productDetail.sizes.join(', ')}</p>
          <p>Thickness: {productDetail.thickness.join(', ')}</p>
        </div>
      </div>
    </div>
  )
}
