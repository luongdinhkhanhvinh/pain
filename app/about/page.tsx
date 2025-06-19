"use client"

import Image from "next/image"
import { Award, Shield, Target, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MobileHeader } from "@/components/layout/mobile-header"
import { useTranslation } from "@/lib/i18n/context"

const getMilestones = (t: any) => [
  {
    year: "2009",
    title: t('about.timeline.milestones.2009.title'),
    description: t('about.timeline.milestones.2009.description'),
  },
  {
    year: "2012",
    title: t('about.timeline.milestones.2012.title'),
    description: t('about.timeline.milestones.2012.description'),
  },
  {
    year: "2015",
    title: t('about.timeline.milestones.2015.title'),
    description: t('about.timeline.milestones.2015.description'),
  },
  {
    year: "2018",
    title: t('about.timeline.milestones.2018.title'),
    description: t('about.timeline.milestones.2018.description'),
  },
  {
    year: "2021",
    title: t('about.timeline.milestones.2021.title'),
    description: t('about.timeline.milestones.2021.description'),
  },
  {
    year: "2024",
    title: t('about.timeline.milestones.2024.title'),
    description: t('about.timeline.milestones.2024.description'),
  },
]

const getValues = (t: any) => [
  {
    icon: Target,
    title: t('about.values.quality.title'),
    description: t('about.values.quality.description'),
  },
  {
    icon: Heart,
    title: t('about.values.dedication.title'),
    description: t('about.values.dedication.description'),
  },
  {
    icon: Shield,
    title: t('about.values.trust.title'),
    description: t('about.values.trust.description'),
  },
  {
    icon: Award,
    title: t('about.values.innovation.title'),
    description: t('about.values.innovation.description'),
  },
]

const team = [
  {
    name: "Nguyễn Văn A",
    position: "Giám đốc điều hành",
    image: "/placeholder.svg?height=300&width=300",
    description: "15+ năm kinh nghiệm trong ngành gỗ và nội thất",
  },
  {
    name: "Trần Thị B",
    position: "Giám đốc kỹ thuật",
    image: "/placeholder.svg?height=300&width=300",
    description: "Chuyên gia về công nghệ sản xuất gỗ ép",
  },
  {
    name: "Lê Văn C",
    position: "Giám đốc kinh doanh",
    image: "/placeholder.svg?height=300&width=300",
    description: "Dẫn dắt đội ngũ kinh doanh chuyên nghiệp",
  },
]

export default function AboutPage() {
  const { t } = useTranslation()
  const milestones = getMilestones(t)
  const values = getValues(t)

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Breadcrumb - Desktop only */}
      <div className="bg-gray-50 py-4 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Button variant="ghost" size="sm" className="p-0">
              <a href="/" className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                {t('navigation.home')}
              </a>
            </Button>
            <span className="text-gray-400">/</span>
            <span className="text-amber-600 font-medium">{t('navigation.about')}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-800 mb-4 md:mb-6">
              {t('about.title')}
            </h1>
            <p className="text-base md:text-xl text-gray-600 leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <div className="text-2xl md:text-4xl font-bold text-amber-600 mb-1 md:mb-2">15+</div>
              <p className="text-gray-600 text-sm md:text-base">{t('about.stats.experience')}</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-amber-600 mb-1 md:mb-2">10,000+</div>
              <p className="text-gray-600 text-sm md:text-base">{t('about.stats.customers')}</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-amber-600 mb-1 md:mb-2">500+</div>
              <p className="text-gray-600 text-sm md:text-base">{t('about.stats.projects')}</p>
            </div>
            <div>
              <div className="text-2xl md:text-4xl font-bold text-amber-600 mb-1 md:mb-2">50+</div>
              <p className="text-gray-600 text-sm md:text-base">{t('about.stats.partners')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6">{t('about.story.title')}</h2>
              <div className="space-y-3 md:space-y-4 text-gray-600 leading-relaxed text-sm md:text-base">
                <p>
                  {t('about.story.paragraph1')}
                </p>
                <p>
                  {t('about.story.paragraph2')}
                </p>
                <p>
                  {t('about.story.paragraph3')}
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <Image
                src="/placeholder.svg?height=500&width=600"
                alt="Câu chuyện Silklux"
                width={600}
                height={500}
                className="rounded-xl md:rounded-2xl shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('about.timeline.title')}</h2>
            <p className="text-lg md:text-xl text-gray-600">{t('about.timeline.subtitle')}</p>
          </div>

          {/* Desktop Timeline */}
          <div className="relative hidden md:block">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-amber-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8"}`}>
                    <Card className="p-6">
                      <div className="text-2xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-amber-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden relative">
            <div className="absolute left-6 top-0 w-0.5 h-full bg-amber-200"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="relative z-10 mr-6">
                    <div className="w-3 h-3 bg-amber-600 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                  <div className="flex-1 pb-8">
                    <Card className="p-4">
                      <div className="text-xl font-bold text-amber-600 mb-2">{milestone.year}</div>
                      <h3 className="text-lg font-semibold mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{milestone.description}</p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('about.values.title')}</h2>
            <p className="text-lg md:text-xl text-gray-600">{t('about.values.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                    <value.icon className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold">{value.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{t('about.team.title')}</h2>
            <p className="text-lg md:text-xl text-gray-600">{t('about.team.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </div>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-amber-600 font-medium mb-2 md:mb-3 text-sm md:text-base">{member.position}</p>
                  <p className="text-gray-600 text-xs md:text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{t('about.cta.title')}</h2>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90">
            {t('about.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-gray-100">
              <a href="/contact">{t('about.cta.contact')}</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-amber bg-amber-600 hover:text-amber-600">
              <a href="/products">{t('about.cta.products')}</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
