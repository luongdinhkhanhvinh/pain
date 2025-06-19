"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Upload, X } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/shared/types"
import { AdminLayout } from "@/components/admin/admin-layout"
import { MultiSelect } from "@/components/ui/multi-select"
import Image from "next/image"
import { Star, Ruler, Palette, Shield } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductForm } from "@/components/admin/product-form"
import { useTranslation } from "@/lib/i18n/context"

interface ProductOption {
  id: string
  type: "color" | "size" | "thickness"
  name: string
  value: string
  hexColor?: string
  isActive: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  isActive: boolean
}

export default function AdminProductsPage() {
  const { t } = useTranslation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [options, setOptions] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Refs for ProductForm components
  const createFormRef = useState<any>(null)
  const editFormRef = useState<any>(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchOptions()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/products")
      const result = await response.json()

      if (result.success) {
        setProducts(result.data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const result = await response.json()

      if (result.success) {
        setCategories(result.data.filter((cat: Category) => cat.isActive))
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchOptions = async () => {
    try {
      const response = await fetch("/api/options")
      const result = await response.json()

      if (result.success) {
        setOptions(result.data.filter((opt: ProductOption) => opt.isActive))
      }
    } catch (error) {
      console.error("Error fetching options:", error)
    }
  }

  const handleCreateProduct = async (productData: any) => {
    try {
      setSubmitting(true)

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchProducts()
        setIsCreateDialogOpen(false)
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return

    try {
      setSubmitting(true)

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchProducts()
        setEditingProduct(null)
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error updating product:", error)
      alert(t('admin.common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm(t('admin.common.confirm'))) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchProducts()
        alert(t('admin.common.success'))
      } else {
        alert(t('admin.common.error') + ": " + result.error)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert(t('admin.common.error'))
    }
  }

  const openEditDialog = (product: Product) => {
    setEditingProduct(product)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })



  // Product Preview Modal Component
  const ProductPreviewModal = ({ product }: { product: Product }) => {
    const [selectedColor, setSelectedColor] = useState(product.colors[0] || "")
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "")
    const [selectedThickness, setSelectedThickness] = useState(product.thickness[0] || "")
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN").format(price)
    }

    return (
      <div className="max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  {t('admin.products.noImages')}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? "border-amber-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Category */}
            <div>
              <Badge variant="outline" className="mb-2">{product.category}</Badge>
              <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">4.5 (24 {t('admin.products.rating')})</span>
              </div>
              <p className="text-gray-600 leading-relaxed mt-4">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-amber-600">{formatPrice(product.price)}đ</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}đ
                </span>
              )}
            </div>

            {/* Options */}
            <div className="space-y-4">
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.colors')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedColor === color
                            ? "border-amber-600 bg-amber-50 text-amber-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.sizes')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedSize === size
                            ? "border-amber-600 bg-amber-50 text-amber-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.thickness && product.thickness.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">{t('productDetail.thickness')}:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.thickness.map((thickness) => (
                      <button
                        key={thickness}
                        onClick={() => setSelectedThickness(thickness)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedThickness === thickness
                            ? "border-amber-600 bg-amber-50 text-amber-600"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {thickness}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">{t('admin.products.features')}:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Button */}
            <div className="space-y-4">
              <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700">
                {t('admin.products.contactButton')}
              </Button>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex flex-col items-center space-y-1">
                  <Ruler className="w-5 h-5 text-amber-600" />
                  <span className="text-xs text-gray-600">{t('admin.products.freeMeasurement')}</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Palette className="w-5 h-5 text-amber-600" />
                  <span className="text-xs text-gray-600">{t('admin.products.designConsultation')}</span>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Shield className="w-5 h-5 text-amber-600" />
                  <span className="text-xs text-gray-600">{t('admin.products.warranty10Years')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="specifications">{t('admin.products.specifications')}</TabsTrigger>
              <TabsTrigger value="installation">{t('admin.products.installationGuide')}</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{t('admin.products.specifications')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.material')}:</span>
                        <span className="text-gray-600">{product.specifications?.material || t('admin.products.notUpdated')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.origin')}:</span>
                        <span className="text-gray-600">{product.specifications?.origin || t('admin.products.notUpdated')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.warranty')}:</span>
                        <span className="text-gray-600">{product.specifications?.warranty || t('admin.products.notUpdated')}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.fireResistant')}:</span>
                        <span className="text-gray-600">{product.specifications?.fireResistant || t('admin.products.notUpdated')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.moistureResistant')}:</span>
                        <span className="text-gray-600">{product.specifications?.moistureResistant || t('admin.products.notUpdated')}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">{t('productDetail.installation')}:</span>
                        <span className="text-gray-600">{product.specifications?.installation || t('admin.products.notUpdated')}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="installation" className="mt-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{t('admin.products.installationGuide')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">1</span>
                        {t('admin.products.prepareSurface')}
                      </h4>
                      <p className="text-gray-600 ml-9">Làm sạch bề mặt tường, đảm bảo khô ráo và phẳng.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">2</span>
                        {t('admin.products.measureAndCut')}
                      </h4>
                      <p className="text-gray-600 ml-9">
                        Đo kích thước chính xác và cắt tấm gỗ ép theo kích thước cần thiết.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">3</span>
                        {t('admin.products.installationStep')}
                      </h4>
                      <p className="text-gray-600 ml-9">
                        Sử dụng keo chuyên dụng hoặc ốc vít để cố định tấm gỗ ép lên tường.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <span className="bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3">4</span>
                        {t('admin.products.finishing')}
                      </h4>
                      <p className="text-gray-600 ml-9">Kiểm tra và hoàn thiện các mối nối, làm sạch bề mặt.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }



  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('admin.products.title')}</h1>
            <p className="text-gray-600">{t('admin.products.description')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.products.addNew')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>{t('admin.products.addNew')}</DialogTitle>
                <DialogDescription>{t('admin.products.addDescription')}</DialogDescription>
              </DialogHeader>

              <div className="max-h-[75vh] overflow-y-auto">
                <ProductForm
                  onSubmit={handleCreateProduct}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isSubmitting={submitting}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder={t('admin.products.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder={t('admin.products.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('admin.products.allCategories')}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.products.productList')} ({filteredProducts.length})</CardTitle>
            <CardDescription>{t('admin.products.productListDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">{t('admin.products.loading')}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.products.product')}</TableHead>
                    <TableHead>{t('admin.products.category')}</TableHead>
                    <TableHead>{t('admin.products.price')}</TableHead>
                    <TableHead>{t('admin.products.status')}</TableHead>
                    <TableHead>{t('admin.products.createdDate')}</TableHead>
                    <TableHead>{t('admin.products.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {product.images && product.images.length > 0 && (
                            <Image
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{Number(product.price).toLocaleString()}đ</p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              {Number(product.originalPrice).toLocaleString()}đ
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={product.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {product.isActive ? t('admin.products.active') : t('admin.products.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setPreviewProduct(product)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
                              <DialogHeader>
                                <DialogTitle>{t('admin.products.previewTitle')}</DialogTitle>
                                <DialogDescription>
                                  {t('admin.products.previewDescription')}
                                </DialogDescription>
                              </DialogHeader>
                              {previewProduct && <ProductPreviewModal product={previewProduct} />}
                            </DialogContent>
                          </Dialog>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
                              <DialogHeader>
                                <DialogTitle>{t('admin.products.editProduct')}</DialogTitle>
                                <DialogDescription>{t('admin.products.editDescription')}</DialogDescription>
                              </DialogHeader>

                              <div className="max-h-[75vh] overflow-y-auto">
                                <ProductForm
                                  initialData={editingProduct}
                                  onSubmit={handleUpdateProduct}
                                  onCancel={() => setEditingProduct(null)}
                                  isSubmitting={submitting}
                                  isEdit={true}
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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
