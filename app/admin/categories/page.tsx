"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Category } from "@/shared/types"
import { AdminLayout } from "@/components/admin/admin-layout"
import Image from "next/image"
import { useTranslation } from "@/lib/i18n/context"

export default function AdminCategoriesPage() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    isActive: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/categories")
      const result = await response.json()

      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleCreateCategory = async () => {
    try {
      setSubmitting(true)
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCategories()
        setIsCreateDialogOpen(false)
        resetForm()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error creating category:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchCategories()
        setEditingCategory(null)
        resetForm()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error updating category:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm(t('admin.common.confirm'))) return

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchCategories()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      alert(t('admin.common.error'))
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      image: "",
      isActive: true,
    })
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
    })
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const CategoryForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">{t('admin.categories.name')} *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder={t('admin.categories.namePlaceholder')}
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">{t('admin.categories.slug')}</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
          placeholder={t('admin.categories.slugPlaceholder')}
        />
      </div>

      <div>
        <Label htmlFor="description">{t('admin.categories.categoryDescription')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder={t('admin.categories.descriptionPlaceholder')}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="image">{t('admin.categories.imageUrl')}</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
          placeholder={t('admin.categories.imageUrlPlaceholder')}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
        />
        <Label htmlFor="isActive">{t('admin.categories.activate')}</Label>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.categories.title')}</h1>
            <p className="text-gray-600">{t('admin.categories.description')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.categories.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('admin.categories.addNew')}</DialogTitle>
                <DialogDescription>{t('admin.categories.addDescription')}</DialogDescription>
              </DialogHeader>

              <CategoryForm />

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>
                  {t('admin.categories.cancel')}
                </Button>
                <Button
                  onClick={handleCreateCategory}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}
                >
                  {submitting ? t('admin.categories.creating') : t('admin.categories.create')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder={t('admin.categories.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.categories.list')} ({filteredCategories.length})</CardTitle>
            <CardDescription>{t('admin.categories.listDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">{t('admin.categories.loading')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.categories.category')}</TableHead>
                    <TableHead>{t('admin.categories.slug')}</TableHead>
                    <TableHead>{t('admin.categories.status')}</TableHead>
                    <TableHead>{t('admin.categories.createdDate')}</TableHead>
                    <TableHead>{t('admin.categories.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {category.image && (
                            <Image
                              src={category.image || "/placeholder.svg"}
                              alt={category.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {category.description && (
                              <p className="text-sm text-gray-500 truncate max-w-xs">{category.description}</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {category.isActive ? t('admin.categories.active') : t('admin.categories.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(category.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(category)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{t('admin.categories.edit')}</DialogTitle>
                                <DialogDescription>{t('admin.categories.editDescription')}</DialogDescription>
                              </DialogHeader>

                              <CategoryForm />

                              <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => setEditingCategory(null)}
                                  disabled={submitting}
                                >
                                  {t('admin.categories.cancel')}
                                </Button>
                                <Button
                                  onClick={handleUpdateCategory}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={submitting}
                                >
                                  {submitting ? t('admin.categories.updating') : t('admin.categories.update')}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
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
