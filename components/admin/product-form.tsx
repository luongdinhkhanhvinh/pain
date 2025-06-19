"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import { useTranslation } from "@/lib/i18n/context"

interface UploadedImage {
  fileId: string
  name: string
  filePath: string
  url: string
  thumbnailUrl: string
}

interface ProductVariation {
  name: string
  price: number
  isDefault: boolean
}

interface ProductFormData {
  name: string
  description: string
  content: string // Rich content
  category: string
  basePrice: number
  originalPrice: number
  images: UploadedImage[]
  variations: {
    colors: ProductVariation[]
    sizes: ProductVariation[]
    thickness: ProductVariation[]
  }
  features: string[]
  specifications: {
    material: string
    origin: string
    warranty: string
    fireResistant: string
    moistureResistant: string
    installation: string
  }
}

interface ProductFormProps {
  initialData?: any
  onSubmit?: (data: any) => Promise<void>
  onCancel?: () => void
  isSubmitting?: boolean
  isEdit?: boolean
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false
}: ProductFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (initialData && isEdit) {
      // Transform existing product data for editing
      return {
        name: initialData.name || "",
        description: initialData.description || "",
        content: initialData.content || "",
        category: initialData.category || "",
        basePrice: Number(initialData.price) || 0,
        originalPrice: Number(initialData.originalPrice) || 0,
        images: (initialData.images || []).map((img: string) => ({ fileId: '', url: img })),
        variations: initialData.variations || {
          colors: initialData.colors?.map((color: string) => ({ name: color, price: Number(initialData.price) || 0, isDefault: false })) || [{ name: "", price: 0, isDefault: true }],
          sizes: initialData.sizes?.map((size: string) => ({ name: size, price: Number(initialData.price) || 0, isDefault: false })) || [{ name: "", price: 0, isDefault: true }],
          thickness: initialData.thickness?.map((thickness: string) => ({ name: thickness, price: Number(initialData.price) || 0, isDefault: false })) || [{ name: "", price: 0, isDefault: true }]
        },
        features: initialData.features || [""],
        specifications: initialData.specifications || {
          material: "",
          origin: "",
          warranty: "",
          fireResistant: "",
          moistureResistant: "",
          installation: ""
        }
      }
    }

    // Default empty form
    return {
      name: "",
      description: "",
      content: "",
      category: "",
      basePrice: 0,
      originalPrice: 0,
      images: [],
      variations: {
        colors: [{ name: "", price: 0, isDefault: true }],
        sizes: [{ name: "", price: 0, isDefault: true }],
        thickness: [{ name: "", price: 0, isDefault: true }]
      },
      features: [""],
      specifications: {
        material: "",
        origin: "",
        warranty: "",
        fireResistant: "",
        moistureResistant: "",
        installation: ""
      }
    }
  })

  const [saving, setSaving] = useState(false)

  const handleImagesChange = (images: UploadedImage[]) => {
    setFormData(prev => ({ ...prev, images }))
  }

  const addVariation = (type: keyof typeof formData.variations) => {
    setFormData(prev => ({
      ...prev,
      variations: {
        ...prev.variations,
        [type]: [...prev.variations[type], { name: "", price: 0, isDefault: false }]
      }
    }))
  }

  const removeVariation = (type: keyof typeof formData.variations, index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: {
        ...prev.variations,
        [type]: prev.variations[type].filter((_, i) => i !== index)
      }
    }))
  }

  const updateVariation = (
    type: keyof typeof formData.variations, 
    index: number, 
    field: keyof ProductVariation, 
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      variations: {
        ...prev.variations,
        [type]: prev.variations[type].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Validate form
      if (!formData.name || !formData.description || formData.images.length === 0) {
        alert(t('admin.products.form.validation'))
        return
      }

      // Prepare data for API
      const productData = {
        name: formData.name,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        price: formData.basePrice.toString(),
        originalPrice: formData.originalPrice > 0 ? formData.originalPrice.toString() : undefined,
        // New variations structure
        variations: formData.variations,
        // Legacy format for backward compatibility
        colors: formData.variations.colors.map(c => c.name).filter(Boolean),
        sizes: formData.variations.sizes.map(s => s.name).filter(Boolean),
        thickness: formData.variations.thickness.map(t => t.name).filter(Boolean),
        features: formData.features.filter(Boolean),
        images: formData.images.map(img => img.url),
        specifications: formData.specifications,
        isActive: true
      }

      console.log("Product data:", productData)

      // Use onSubmit prop if provided, otherwise use default API call
      if (onSubmit) {
        await onSubmit(productData)
      } else {
        // Default API call for standalone form
        const response = await fetch('/api/products', {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || 'Failed to save product')
        }

        alert(t('admin.common.success'))

        // Reset form if not editing
        if (!isEdit) {
          setFormData({
            name: "",
            description: "",
            content: "",
            category: "",
            basePrice: 0,
            originalPrice: 0,
            images: [],
            variations: {
              colors: [{ name: "", price: 0, isDefault: true }],
              sizes: [{ name: "", price: 0, isDefault: true }],
              thickness: [{ name: "", price: 0, isDefault: true }]
            },
            features: [""],
            specifications: {
              material: "",
              origin: "",
              warranty: "",
              fireResistant: "",
              moistureResistant: "",
              installation: ""
            }
          })
        }
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert(t('admin.common.error'))
    } finally {
      setSaving(false)
    }
  }

  const renderVariationSection = (
    type: keyof typeof formData.variations,
    title: string
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          {t('admin.products.form.variationDescription', { type: title.toLowerCase() })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {formData.variations[type].map((variation, index) => (
          <div key={index} className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>{t('admin.products.form.variationName', { type: title.toLowerCase() })}</Label>
              <Input
                value={variation.name}
                onChange={(e) => updateVariation(type, index, 'name', e.target.value)}
                placeholder={t('admin.products.form.variationPlaceholder', { type: title.toLowerCase() })}
              />
            </div>
            <div className="w-32">
              <Label>{t('admin.products.form.price')}</Label>
              <Input
                type="number"
                value={variation.price}
                onChange={(e) => updateVariation(type, index, 'price', parseInt(e.target.value) || 0)}
                placeholder="450000"
              />
            </div>
            <div className="w-24">
              <Label>{t('admin.products.form.default')}</Label>
              <div className="flex items-center justify-center h-10">
                <input
                  type="radio"
                  name={`default-${type}`}
                  checked={variation.isDefault}
                  onChange={() => {
                    // Set this as default and unset others
                    setFormData(prev => ({
                      ...prev,
                      variations: {
                        ...prev.variations,
                        [type]: prev.variations[type].map((item, i) =>
                          ({ ...item, isDefault: i === index })
                        )
                      }
                    }))
                  }}
                  className="w-4 h-4"
                />
              </div>
            </div>
            {formData.variations[type].length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeVariation(type, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addVariation(type)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('admin.products.form.addVariation', { type: title.toLowerCase() })}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? t('admin.products.editProduct') : t('admin.products.addNew')}</CardTitle>
          <CardDescription>
            {t('admin.products.form.basicInfoDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">{t('admin.products.form.name')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t('admin.products.form.namePlaceholder')}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">{t('admin.products.category')}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.products.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="van-go">Vân Gỗ</SelectItem>
                  <SelectItem value="van-da">Vân Đá</SelectItem>
                  <SelectItem value="van-vai">Vân Vải</SelectItem>
                  <SelectItem value="mau-don">Màu Đơn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">{t('admin.products.form.description')} *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('admin.products.form.descriptionPlaceholder')}
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="content">{t('admin.products.form.content')}</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={t('admin.products.form.contentPlaceholder')}
              rows={8}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.products.form.htmlSupport')}
            </p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="basePrice">{t('admin.products.form.basePrice')} *</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }))}
                placeholder="450000"
                required
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">{t('admin.products.form.originalPrice')}</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseInt(e.target.value) || 0 }))}
                placeholder="520000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.products.form.images')}</CardTitle>
          <CardDescription>
            {t('admin.products.form.imagesDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUpload
            onImagesChange={handleImagesChange}
            maxImages={8}
            existingImages={formData.images}
          />
        </CardContent>
      </Card>

      {/* Variations */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">{t('admin.products.form.variations')}</h3>
        {renderVariationSection('colors', t('admin.products.form.colors'))}
        {renderVariationSection('sizes', t('admin.products.form.sizes'))}
        {renderVariationSection('thickness', t('admin.products.form.thickness'))}
      </div>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.products.form.featuresTitle')}</CardTitle>
          <CardDescription>
            {t('admin.products.form.featuresDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.features.map((feature, index) => (
            <div key={index} className="flex gap-4 items-center">
              <div className="flex-1">
                <Input
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...formData.features]
                    newFeatures[index] = e.target.value
                    setFormData(prev => ({ ...prev, features: newFeatures }))
                  }}
                  placeholder={t('admin.products.form.featurePlaceholder')}
                />
              </div>
              {formData.features.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newFeatures = formData.features.filter((_, i) => i !== index)
                    setFormData(prev => ({ ...prev, features: newFeatures }))
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }))}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('admin.products.form.addFeature')}
          </Button>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.products.form.specificationsTitle')}</CardTitle>
          <CardDescription>
            {t('admin.products.form.specificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material">{t('productDetail.material')}</Label>
              <Input
                id="material"
                value={formData.specifications.material}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, material: e.target.value }
                }))}
                placeholder={t('admin.products.form.materialPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="origin">{t('productDetail.origin')}</Label>
              <Input
                id="origin"
                value={formData.specifications.origin}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, origin: e.target.value }
                }))}
                placeholder={t('admin.products.form.originPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="warranty">{t('productDetail.warranty')}</Label>
              <Input
                id="warranty"
                value={formData.specifications.warranty}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, warranty: e.target.value }
                }))}
                placeholder={t('admin.products.form.warrantyPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="fireResistant">{t('productDetail.fireResistant')}</Label>
              <Input
                id="fireResistant"
                value={formData.specifications.fireResistant}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, fireResistant: e.target.value }
                }))}
                placeholder={t('admin.products.form.fireResistantPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="moistureResistant">{t('productDetail.moistureResistant')}</Label>
              <Input
                id="moistureResistant"
                value={formData.specifications.moistureResistant}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, moistureResistant: e.target.value }
                }))}
                placeholder={t('admin.products.form.moistureResistantPlaceholder')}
              />
            </div>
            <div>
              <Label htmlFor="installation">{t('productDetail.installation')}</Label>
              <Input
                id="installation"
                value={formData.specifications.installation}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  specifications: { ...prev.specifications, installation: e.target.value }
                }))}
                placeholder={t('admin.products.form.installationPlaceholder')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('admin.products.form.cancel')}
        </Button>
        <Button type="submit" disabled={saving || isSubmitting}>
          {saving || isSubmitting ? t('admin.products.form.saving') : (isEdit ? t('admin.products.form.update') : t('admin.products.form.create'))}
        </Button>
      </div>
    </form>
  )
}
