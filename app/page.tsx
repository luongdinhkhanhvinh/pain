"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowRight, Shield, Truck, Award, Users } from "lucide-react"
import { MobileHeader } from "@/components/layout/mobile-header"
import { useTranslation } from "@/lib/i18n/context"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="bg-white">
      {/* Mobile Header */}
      <MobileHeader showSearch={false} />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products">
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                    {t('home.hero.cta')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline">
                  {t('home.hero.contact')}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">{t('home.hero.rating')}</span>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/SILKLUX-01.png"
                alt="Silklux Premium Interior"
                width={600}
                height={500}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('home.products.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.products.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: "1",
                name: "Silklux Premium Collection",
                description: "Bộ sưu tập nội thất cao cấp với thiết kế sang trọng",
                price: 2500000,
                originalPrice: 3000000,
                discount: 17,
                rating: 4.9,
                reviewCount: 156,
                image: "/SILKLUX-01.png",
                category: "Premium"
              },
              {
                id: "2",
                name: "Silklux Luxury Series",
                description: "Dòng sản phẩm luxury với chất liệu cao cấp nhất",
                price: 3200000,
                originalPrice: 3800000,
                discount: 16,
                rating: 4.8,
                reviewCount: 89,
                image: "/SILKLUX-02.png",
                category: "Luxury"
              },
              {
                id: "3",
                name: "Silklux Elite Design",
                description: "Thiết kế elite cho không gian đẳng cấp",
                price: 1800000,
                originalPrice: 2200000,
                discount: 18,
                rating: 4.7,
                reviewCount: 203,
                image: "/SILKLUX-03.png",
                category: "Elite"
              }
            ].map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500">
                    -{product.discount}%
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{product.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-amber-600">
                        {product.price.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="text-sm text-gray-500 line-through ml-2">
                        {product.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Button className="w-full">
                      {t('products.card.viewDetails')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                {t('home.products.viewAll')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t('home.features.title')}</h2>
            <p className="text-xl text-gray-600">{t('home.features.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.quality.title')}</h3>
              <p className="text-gray-600">{t('home.features.quality.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.delivery.title')}</h3>
              <p className="text-gray-600">{t('home.features.delivery.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.warranty.title')}</h3>
              <p className="text-gray-600">{t('home.features.warranty.description')}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.features.support.title')}</h3>
              <p className="text-gray-600">{t('home.features.support.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
