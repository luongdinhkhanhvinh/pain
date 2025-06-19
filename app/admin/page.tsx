"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, MessageSquare, TrendingUp, Eye, Download, Package, FileText, DollarSign, Activity } from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useTranslation } from "@/lib/i18n/context"

interface DashboardStats {
  title: string
  value: string
  change: string
  icon: string
  color: string
  bgColor: string
}

interface SalesData {
  month: string
  sales: number
  contacts: number
}

interface CategoryData {
  name: string
  value: number
  count: number
  color: string
}

interface Contact {
  id: string
  name: string
  phone: string
  email: string
  address: string
  product: string
  message: string
  status: string
  createdAt: string
}

const iconMap = {
  Package,
  MessageSquare,
  DollarSign,
  Eye,
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats[]>([])
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [recentContacts, setRecentContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch all dashboard data in parallel
        const [statsRes, salesRes, categoryRes, contactsRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/sales-chart"),
          fetch("/api/dashboard/category-chart"),
          fetch("/api/dashboard/recent-contacts"),
        ])

        const [statsData, salesChartData, categoryChartData, contactsData] = await Promise.all([
          statsRes.json(),
          salesRes.json(),
          categoryRes.json(),
          contactsRes.json(),
        ])

        setStats(statsData.stats || [])
        setSalesData(salesChartData.salesData || [])
        setCategoryData(categoryChartData.categoryData || [])
        setRecentContacts(contactsData.contacts || [])
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Mới</Badge>
      case "contacted":
        return <Badge className="bg-yellow-100 text-yellow-800">Đã Liên Hệ</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn Thành</Badge>
      default:
        return <Badge variant="secondary">Không xác định</Badge>
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
            <p className="text-gray-600">{t('admin.dashboard.welcome')}</p>
          </div>

          {/* Loading Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Loading Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{t('admin.dashboard.title')}</h1>
          <p className="text-sm lg:text-base text-gray-600">{t('admin.dashboard.welcome')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon as keyof typeof iconMap] || Package
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs lg:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                      <p className="text-xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs lg:text-sm text-green-600 flex items-center mt-1">
                        <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                        <span className="truncate">{stat.change} {t('admin.dashboard.stats.fromLastMonth')}</span>
                      </p>
                    </div>
                    <div className={`p-2 lg:p-3 rounded-full ${stat.bgColor} ${stat.color} flex-shrink-0`}>
                      <IconComponent className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.salesChart')}</CardTitle>
              <CardDescription>{t('admin.dashboard.salesChartDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {salesData.length > 0 ? (
                  <>
                    <div className="flex items-end justify-between h-64 px-4">
                      {salesData.map((data, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2">
                          <div className="flex items-end space-x-1">
                            <div
                              className="bg-blue-500 rounded-t"
                              style={{
                                height: `${Math.max((data.sales / Math.max(...salesData.map((d) => d.sales))) * 200, 10)}px`,
                                width: "20px",
                              }}
                              title={`${t('admin.dashboard.revenue')}: ${data.sales}M`}
                            />
                            <div
                              className="bg-green-500 rounded-t"
                              style={{
                                height: `${Math.max((data.contacts / Math.max(...salesData.map((d) => d.contacts), 1)) * 200, 5)}px`,
                                width: "20px",
                              }}
                              title={`${t('admin.dashboard.contacts')}: ${data.contacts}`}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{data.month}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm">{t('admin.dashboard.revenue')} (M)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span className="text-sm">{t('admin.dashboard.contacts')}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">{t('admin.dashboard.noData')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.categoryChart')}</CardTitle>
              <CardDescription>{t('admin.dashboard.categoryChartDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                {categoryData.length > 0 ? (
                  <>
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {categoryData.map((category, index) => {
                          const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
                          const percentage = total > 0 ? (category.value / total) * 100 : 0
                          const strokeDasharray = `${percentage} ${100 - percentage}`
                          const strokeDashoffset = categoryData
                            .slice(0, index)
                            .reduce((sum, cat) => sum + (cat.value / total) * 100, 0)

                          return (
                            <circle
                              key={index}
                              cx="50"
                              cy="50"
                              r="39.915"
                              fill="transparent"
                              stroke={category.color}
                              strokeWidth="8"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={-strokeDashoffset}
                              className="transition-all duration-300 hover:stroke-width-10"
                            />
                          )
                        })}
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {categoryData.reduce((sum, cat) => sum + cat.count, 0)}
                          </div>
                          <div className="text-sm text-gray-500">{t('admin.navigation.products')}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {categoryData.map((category, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm">{category.name}</span>
                          <span className="text-sm text-gray-500">({category.count})</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">{t('admin.dashboard.noCategoryData')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Recent Contacts */}
          <Card className="xl:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('admin.dashboard.recentContacts')}</CardTitle>
                  <CardDescription>{t('admin.dashboard.recentContactsDescription')}</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href="/admin/contacts">{t('admin.dashboard.viewAll')}</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContacts.length > 0 ? (
                  recentContacts.map((contact) => (
                    <div key={contact.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-4 border rounded-lg space-y-3 lg:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{contact.name}</p>
                            <p className="text-sm text-gray-500">{contact.phone}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{contact.product}</p>
                            <p className="text-sm text-gray-500 truncate">{contact.message}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between lg:justify-end space-x-2 flex-shrink-0">
                        {getStatusBadge(contact.status)}
                        <span className="text-xs lg:text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('admin.contacts.noContacts')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.quickActions')}</CardTitle>
              <CardDescription>{t('admin.dashboard.quickActionsDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/products">
                    <Package className="w-4 h-4 mr-2" />
                    {t('admin.products.title')}
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/blog">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('admin.navigation.blog')}
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/contacts">
                    <Users className="w-4 h-4 mr-2" />
                    {t('admin.contacts.title')}
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.reports')}
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  {t('admin.dashboard.exportData')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
