"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  Search,
  Download,
  Building,
  User,
  DollarSign,
  ShoppingBag,
} from "lucide-react"
import { AdminLayout } from "@/components/admin/admin-layout"
import type { Customer } from "@/shared/types"
import { useTranslation } from "@/lib/i18n/context"

interface CustomerStats {
  title: string
  value: string
  change: string
  icon: any
  color: string
  bgColor: string
}

export default function AdminCustomersPage() {
  const { t } = useTranslation()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<CustomerStats[]>([
    {
      title: t('admin.customers.totalCustomers'),
      value: "0",
      change: "+0%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: t('admin.customers.activeCustomers'),
      value: "0",
      change: "+0%",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: t('admin.customers.revenue'),
      value: "0",
      change: "+0%",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: t('admin.customers.totalOrders'),
      value: "0",
      change: "+0%",
      icon: ShoppingBag,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState<Partial<Customer>>({
    customerType: "individual",
    status: "potential",
    source: "direct",
  })

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: "1",
        limit: "100", // Get all customers for now
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterType !== "all" && { customerType: filterType }),
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/customers?${params}`)
      const result = await response.json()

      if (result.success) {
        setCustomers(result.data)
        updateStats(result.data)
      } else {
        console.error('Failed to fetch customers:', result.error)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update stats based on customer data
  const updateStats = (customerData: Customer[]) => {
    const totalCustomers = customerData.length
    const activeCustomers = customerData.filter(c => c.status === 'active').length
    const totalRevenue = customerData.reduce((sum, c) => sum + (Number(c.totalSpent) || 0), 0)
    const totalOrders = customerData.reduce((sum, c) => sum + (c.totalOrders || 0), 0)

    setStats([
      {
        title: t('admin.customers.totalCustomers'),
        value: totalCustomers.toString(),
        change: "+0%", // Would need historical data to calculate
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        title: t('admin.customers.activeCustomers'),
        value: activeCustomers.toString(),
        change: "+0%",
        icon: User,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        title: t('admin.customers.revenue'),
        value: formatCurrency(totalRevenue),
        change: "+0%",
        icon: DollarSign,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
      },
      {
        title: t('admin.customers.totalOrders'),
        value: totalOrders.toString(),
        change: "+0%",
        icon: ShoppingBag,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
    ])
  }

  // Load customers on component mount and when filters change
  useEffect(() => {
    fetchCustomers()
  }, [filterStatus, filterType, searchTerm])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">{t('admin.customers.statusActive')}</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">{t('admin.customers.statusInactive')}</Badge>
      case "potential":
        return <Badge className="bg-blue-100 text-blue-800">{t('admin.customers.statusPotential')}</Badge>
      default:
        return <Badge variant="secondary">{t('admin.customers.statusUnknown')}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "business":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-200">
            <Building className="w-3 h-3 mr-1" />
            {t('admin.customers.typeBusiness')}
          </Badge>
        )
      case "individual":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <User className="w-3 h-3 mr-1" />
            {t('admin.customers.typeIndividual')}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{t('admin.customers.typeUnknown')}</Badge>
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "contact":
        return (
          <Badge variant="outline" className="text-green-600">
            {t('admin.customers.sourceContact')}
          </Badge>
        )
      case "direct":
        return (
          <Badge variant="outline" className="text-blue-600">
            {t('admin.customers.sourceDirect')}
          </Badge>
        )
      case "referral":
        return (
          <Badge variant="outline" className="text-purple-600">
            {t('admin.customers.sourceReferral')}
          </Badge>
        )
      case "online":
        return (
          <Badge variant="outline" className="text-orange-600">
            {t('admin.customers.sourceOnline')}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{t('admin.customers.sourceOther')}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesStatus = filterStatus === "all" || customer.status === filterStatus
    const matchesType = filterType === "all" || customer.customerType === filterType
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const handleCreateCustomer = async () => {
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalOrders: 0,
          totalSpent: "0",
        }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCustomers() // Refresh the list
        setIsCreateDialogOpen(false)
        setFormData({
          customerType: "individual",
          status: "potential",
          source: "direct",
        })
        alert(t('admin.common.success'))
      } else {
        alert(result.error || t('admin.common.error'))
      }
    } catch (error) {
      console.error("Error creating customer:", error)
      alert(t('admin.common.error'))
    }
  }

  const handleUpdateCustomer = async () => {
    try {
      if (!selectedCustomer) return

      const response = await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCustomers() // Refresh the list
        setIsEditDialogOpen(false)
        setSelectedCustomer(null)
        setFormData({
          customerType: "individual",
          status: "potential",
          source: "direct",
        })
        alert(t('admin.common.success'))
      } else {
        alert(result.error || t('admin.common.error'))
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      alert(t('admin.common.error'))
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      if (!confirm(t('admin.common.confirm'))) {
        return
      }

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        await fetchCustomers() // Refresh the list
        alert(t('admin.common.success'))
      } else {
        alert(result.error || t('admin.common.error'))
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
      alert(t('admin.common.error'))
    }
  }

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setFormData(customer)
    setIsEditDialogOpen(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.customers.title')}</h1>
            <p className="text-gray-600">{t('admin.customers.description')}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t('admin.customers.exportExcel')}
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('admin.customers.addNew')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('admin.customers.addNew')}</DialogTitle>
                  <DialogDescription>{t('admin.customers.addDescription')}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('admin.customers.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('admin.customers.namePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t('admin.customers.phone')} *</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={t('admin.customers.phonePlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('admin.customers.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('admin.customers.emailPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerType">{t('admin.customers.customerType')}</Label>
                    <Select
                      value={formData.customerType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, customerType: value as "individual" | "business" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">{t('admin.customers.typeIndividual')}</SelectItem>
                        <SelectItem value="business">{t('admin.customers.typeBusiness')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.customerType === "business" && (
                    <>
                      <div>
                        <Label htmlFor="company">{t('admin.customers.company')}</Label>
                        <Input
                          id="company"
                          value={formData.company || ""}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder={t('admin.customers.companyPlaceholder')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="taxCode">{t('admin.customers.taxCode')}</Label>
                        <Input
                          id="taxCode"
                          value={formData.taxCode || ""}
                          onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                          placeholder={t('admin.customers.taxCodePlaceholder')}
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2">
                    <Label htmlFor="address">{t('admin.customers.address')}</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder={t('admin.customers.addressPlaceholder')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">{t('admin.customers.status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as "active" | "inactive" | "potential" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="potential">{t('admin.customers.statusPotential')}</SelectItem>
                        <SelectItem value="active">{t('admin.customers.statusActive')}</SelectItem>
                        <SelectItem value="inactive">{t('admin.customers.statusInactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="source">{t('admin.customers.source')}</Label>
                    <Select
                      value={formData.source}
                      onValueChange={(value) =>
                        setFormData({ ...formData, source: value as "contact" | "direct" | "referral" | "online" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direct">{t('admin.customers.sourceDirect')}</SelectItem>
                        <SelectItem value="contact">{t('admin.customers.sourceContact')}</SelectItem>
                        <SelectItem value="referral">{t('admin.customers.sourceReferral')}</SelectItem>
                        <SelectItem value="online">{t('admin.customers.sourceOnline')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="notes">{t('admin.customers.notes')}</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes || ""}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={t('admin.customers.notesPlaceholder')}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={handleCreateCustomer}>Tạo Khách Hàng</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <span>{stat.change} từ tháng trước</span>
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="potential">Tiềm năng</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Loại khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                  <SelectItem value="business">Doanh nghiệp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Khách Hàng ({loading ? '...' : filteredCustomers.length})</CardTitle>
            <CardDescription>Quản lý thông tin và lịch sử giao dịch khách hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Tổng chi tiêu</TableHead>
                  <TableHead>Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mr-2"></div>
                        Đang tải...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      Không có khách hàng nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        {customer.company && <p className="text-sm text-gray-500">{customer.company}</p>}
                        {customer.address && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">{customer.address}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(customer.customerType)}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>{getSourceBadge(customer.source)}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-medium">{customer.totalOrders}</p>
                        {customer.lastOrderDate && (
                          <p className="text-xs text-gray-500">
                            {new Date(customer.lastOrderDate).toLocaleDateString("vi-VN")}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-green-600">{formatCurrency(customer.totalSpent)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Chi Tiết Khách Hàng</DialogTitle>
                              <DialogDescription>Thông tin chi tiết và lịch sử giao dịch</DialogDescription>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Họ tên</label>
                                    <p className="text-sm text-gray-600">{selectedCustomer.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Số điện thoại</label>
                                    <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p className="text-sm text-gray-600">{selectedCustomer.email || "Chưa có"}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Loại khách hàng</label>
                                    <div className="mt-1">{getTypeBadge(selectedCustomer.customerType)}</div>
                                  </div>
                                  {selectedCustomer.company && (
                                    <>
                                      <div>
                                        <label className="text-sm font-medium">Công ty</label>
                                        <p className="text-sm text-gray-600">{selectedCustomer.company}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Mã số thuế</label>
                                        <p className="text-sm text-gray-600">{selectedCustomer.taxCode || "Chưa có"}</p>
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Địa chỉ</label>
                                  <p className="text-sm text-gray-600">{selectedCustomer.address || "Chưa có"}</p>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Trạng thái</label>
                                    <div className="mt-1">{getStatusBadge(selectedCustomer.status)}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Nguồn</label>
                                    <div className="mt-1">{getSourceBadge(selectedCustomer.source)}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Ngày tạo</label>
                                    <p className="text-sm text-gray-600">
                                      {new Date(selectedCustomer.createdAt).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                                    <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                                  </div>
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <p className="text-2xl font-bold text-green-600">
                                      {formatCurrency(selectedCustomer.totalSpent)}
                                    </p>
                                    <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                                  </div>
                                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <p className="text-2xl font-bold text-purple-600">
                                      {selectedCustomer.lastOrderDate
                                        ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString("vi-VN")
                                        : "Chưa có"}
                                    </p>
                                    <p className="text-sm text-gray-600">Đơn hàng cuối</p>
                                  </div>
                                </div>
                                {selectedCustomer.notes && (
                                  <div>
                                    <label className="text-sm font-medium">Ghi chú</label>
                                    <p className="text-sm text-gray-600 mt-1">{selectedCustomer.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={() => openEditDialog(customer)}>
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh Sửa Khách Hàng</DialogTitle>
              <DialogDescription>Cập nhật thông tin khách hàng</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Họ tên *</Label>
                <Input
                  id="edit-name"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Số điện thoại *</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <Label htmlFor="edit-customerType">Loại khách hàng</Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customerType: value as "individual" | "business" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                    <SelectItem value="business">Doanh nghiệp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.customerType === "business" && (
                <>
                  <div>
                    <Label htmlFor="edit-company">Tên công ty</Label>
                    <Input
                      id="edit-company"
                      value={formData.company || ""}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Nhập tên công ty"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-taxCode">Mã số thuế</Label>
                    <Input
                      id="edit-taxCode"
                      value={formData.taxCode || ""}
                      onChange={(e) => setFormData({ ...formData, taxCode: e.target.value })}
                      placeholder="Nhập mã số thuế"
                    />
                  </div>
                </>
              )}
              <div className="col-span-2">
                <Label htmlFor="edit-address">Địa chỉ</Label>
                <Input
                  id="edit-address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as "active" | "inactive" | "potential" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="potential">Tiềm năng</SelectItem>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-source">Nguồn khách hàng</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) =>
                    setFormData({ ...formData, source: value as "contact" | "direct" | "referral" | "online" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Trực tiếp</SelectItem>
                    <SelectItem value="contact">Từ liên hệ</SelectItem>
                    <SelectItem value="referral">Giới thiệu</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes">Ghi chú</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nhập ghi chú về khách hàng"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateCustomer}>Cập Nhật</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
