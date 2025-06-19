"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Palette, Ruler, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useTranslation } from "@/lib/i18n/context"

interface ProductOption {
  id: string
  type: "color" | "size" | "thickness"
  name: string
  value: string
  hexColor?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export default function AdminOptionsPage() {
  const { t } = useTranslation()
  const [options, setOptions] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "color" | "size" | "thickness">("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingOption, setEditingOption] = useState<ProductOption | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: "color" as "color" | "size" | "thickness",
    name: "",
    value: "",
    hexColor: "#000000",
    isActive: true,
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/options")
      const result = await response.json()

      if (result.success) {
        setOptions(result.data)
      }
    } catch (error) {
      console.error("Error fetching options:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOption = async () => {
    try {
      setSubmitting(true)
      const response = await fetch("/api/options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchOptions()
        setIsCreateDialogOpen(false)
        resetForm()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error creating option:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateOption = async () => {
    if (!editingOption) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/options/${editingOption.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchOptions()
        setEditingOption(null)
        resetForm()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error updating option:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm(t('admin.common.confirm'))) return

    try {
      const response = await fetch(`/api/options/${optionId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchOptions()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error deleting option:", error)
      alert(t('admin.common.error'))
    }
  }

  const resetForm = () => {
    setFormData({
      type: "color",
      name: "",
      value: "",
      hexColor: "#000000",
      isActive: true,
    })
  }

  const openEditDialog = (option: ProductOption) => {
    setEditingOption(option)
    setFormData({
      type: option.type,
      name: option.name,
      value: option.value,
      hexColor: option.hexColor || "#000000",
      isActive: option.isActive,
    })
  }

  const filteredOptions = options.filter((option) => {
    const matchesSearch =
      option.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || option.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "color":
        return <Palette className="w-4 h-4" />
      case "size":
        return <Ruler className="w-4 h-4" />
      case "thickness":
        return <Package className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "color":
        return t('admin.options.colors')
      case "size":
        return t('admin.options.sizes')
      case "thickness":
        return t('admin.options.thickness')
      default:
        return type
    }
  }

  const OptionForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">{t('admin.options.type')} *</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "color" | "size" | "thickness") => setFormData((prev) => ({ ...prev, type: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder={t('admin.options.selectType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>{t('admin.options.colors')}</span>
              </div>
            </SelectItem>
            <SelectItem value="size">
              <div className="flex items-center space-x-2">
                <Ruler className="w-4 h-4" />
                <span>{t('admin.options.sizes')}</span>
              </div>
            </SelectItem>
            <SelectItem value="thickness">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>{t('admin.options.thickness')}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="name">{t('admin.options.displayName')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder={
            formData.type === "color" ? t('admin.options.colorExample') : formData.type === "size" ? t('admin.options.sizeExample') : t('admin.options.thicknessExample')
          }
          required
        />
      </div>

      <div>
        <Label htmlFor="value">{t('admin.options.value')} *</Label>
        <Input
          id="value"
          value={formData.value}
          onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
          placeholder={
            formData.type === "color" ? t('admin.options.colorValueExample') : formData.type === "size" ? t('admin.options.sizeValueExample') : t('admin.options.thicknessValueExample')
          }
          required
        />
      </div>

      {formData.type === "color" && (
        <div>
          <Label htmlFor="hexColor">{t('admin.options.colorCode')}</Label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              id="hexColor"
              value={formData.hexColor}
              onChange={(e) => setFormData((prev) => ({ ...prev, hexColor: e.target.value }))}
              className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              value={formData.hexColor}
              onChange={(e) => setFormData((prev) => ({ ...prev, hexColor: e.target.value }))}
              placeholder={t('admin.options.colorCodeExample')}
              className="flex-1"
            />
          </div>
        </div>
      )}
    </div>
  )

  const colorOptions = options.filter((opt) => opt.type === "color")
  const sizeOptions = options.filter((opt) => opt.type === "size")
  const thicknessOptions = options.filter((opt) => opt.type === "thickness")

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.options.title')}</h1>
            <p className="text-gray-600">{t('admin.options.description')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.options.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('admin.options.addNew')}</DialogTitle>
                <DialogDescription>{t('admin.options.addDescription')}</DialogDescription>
              </DialogHeader>

              <OptionForm />

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>
                  {t('admin.options.cancel')}
                </Button>
                <Button onClick={handleCreateOption} className="bg-green-600 hover:bg-green-700" disabled={submitting}>
                  {submitting ? t('admin.options.creating') : t('admin.options.create')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('admin.options.colors')}</p>
                  <p className="text-3xl font-bold text-gray-900">{colorOptions.length}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <Palette className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('admin.options.sizes')}</p>
                  <p className="text-3xl font-bold text-gray-900">{sizeOptions.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Ruler className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('admin.options.thickness')}</p>
                  <p className="text-3xl font-bold text-gray-900">{thicknessOptions.length}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder={t('admin.options.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('admin.options.selectType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.options.allTypes')}</SelectItem>
                  <SelectItem value="color">{t('admin.options.colors')}</SelectItem>
                  <SelectItem value="size">{t('admin.options.sizes')}</SelectItem>
                  <SelectItem value="thickness">{t('admin.options.thickness')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Options Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.options.list')} ({filteredOptions.length})</CardTitle>
            <CardDescription>{t('admin.options.listDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">{t('admin.options.loading')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.options.type')}</TableHead>
                    <TableHead>{t('admin.options.displayName')}</TableHead>
                    <TableHead>{t('admin.options.value')}</TableHead>
                    <TableHead>{t('admin.options.colorCode')}</TableHead>
                    <TableHead>{t('admin.options.status')}</TableHead>
                    <TableHead>{t('admin.options.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptions.map((option) => (
                    <TableRow key={option.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(option.type)}
                          <Badge variant="outline">{getTypeLabel(option.type)}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{option.name}</p>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{option.value}</code>
                      </TableCell>
                      <TableCell>
                        {option.type === "color" && option.hexColor ? (
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: option.hexColor }}
                            />
                            <span className="text-sm text-gray-600">{option.hexColor}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={option.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {option.isActive ? t('admin.options.active') : t('admin.options.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(option)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{t('admin.options.edit')}</DialogTitle>
                                <DialogDescription>{t('admin.options.editDescription')}</DialogDescription>
                              </DialogHeader>

                              <OptionForm />

                              <div className="flex justify-end space-x-2 pt-4">
                                <Button variant="outline" onClick={() => setEditingOption(null)} disabled={submitting}>
                                  {t('admin.options.cancel')}
                                </Button>
                                <Button
                                  onClick={handleUpdateOption}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={submitting}
                                >
                                  {submitting ? t('admin.options.updating') : t('admin.options.update')}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteOption(option.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
