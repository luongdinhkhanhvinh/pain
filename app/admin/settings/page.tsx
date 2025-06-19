"use client"

import type React from "react"

import { useState } from "react"
import { Save, Upload, X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin/admin-layout"
import Image from "next/image"

interface SiteSettings {
  siteName: string
  siteDescription: string
  siteKeywords: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialMedia: {
    facebook: string
    instagram: string
    youtube: string
    zalo: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    ogImage: string
  }
  maintenance: {
    enabled: boolean
    message: string
  }
}

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  buttonText: string
  isActive: boolean
  order: number
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "WoodVeneer Pro",
    siteDescription: "Chuyên cung cấp gỗ ép tường cao cấp với đa dạng màu sắc và vân hoạ tiết",
    siteKeywords: "gỗ ép tường, gỗ ép cao cấp, vân gỗ, nội thất, trang trí tường",
    contactEmail: "info@woodveneerpro.com",
    contactPhone: "0123.456.789",
    contactAddress: "123 Đường ABC, Quận 1, TP.HCM",
    socialMedia: {
      facebook: "https://facebook.com/woodveneerpro",
      instagram: "https://instagram.com/woodveneerpro",
      youtube: "https://youtube.com/woodveneerpro",
      zalo: "0987.654.321",
    },
    seo: {
      metaTitle: "WoodVeneer Pro - Gỗ Ép Tường Cao Cấp",
      metaDescription:
        "Chuyên cung cấp gỗ ép tường cao cấp với đa dạng màu sắc và vân hoạ tiết. Chất lượng tốt nhất, giá cả hợp lý.",
      ogImage: "",
    },
    maintenance: {
      enabled: false,
      message: "Website đang bảo trì. Vui lòng quay lại sau.",
    },
  })

  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "1",
      title: "Gỗ Ép Tường Cao Cấp",
      subtitle: "Khám phá bộ sưu tập đa dạng với hàng trăm màu sắc và vân hoạ tiết độc đáo",
      image: "/placeholder.svg?height=400&width=800",
      link: "/products",
      buttonText: "Xem Sản Phẩm",
      isActive: true,
      order: 1,
    },
    {
      id: "2",
      title: "Tư Vấn Miễn Phí",
      subtitle: "Đội ngũ chuyên gia sẵn sàng tư vấn và thiết kế không gian hoàn hảo cho bạn",
      image: "/placeholder.svg?height=400&width=800",
      link: "/contact",
      buttonText: "Liên Hệ Ngay",
      isActive: true,
      order: 2,
    },
  ])

  const [loading, setLoading] = useState(false)
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    buttonText: "",
    isActive: true,
  })
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null)
  const [bannerImagePreview, setBannerImagePreview] = useState<string>("")

  const handleSaveSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (result.success) {
        alert("Cài đặt đã được lưu thành công!")
      } else {
        alert("Lỗi: " + result.error)
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Có lỗi xảy ra khi lưu cài đặt")
    } finally {
      setLoading(false)
    }
  }

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setBannerImageFile(file)
    setBannerImagePreview(URL.createObjectURL(file))
  }

  const uploadBannerImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        return result.url
      }
      throw new Error(result.error)
    } catch (error) {
      console.error("Error uploading banner image:", error)
      throw error
    }
  }

  const handleCreateBanner = async () => {
    try {
      setLoading(true)

      let imageUrl = bannerForm.image
      if (bannerImageFile) {
        imageUrl = await uploadBannerImage(bannerImageFile)
      }

      const newBanner: Banner = {
        id: Date.now().toString(),
        ...bannerForm,
        image: imageUrl,
        order: banners.length + 1,
      }

      setBanners((prev) => [...prev, newBanner])
      resetBannerForm()
      alert("Banner đã được tạo thành công!")
    } catch (error) {
      console.error("Error creating banner:", error)
      alert("Có lỗi xảy ra khi tạo banner")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBanner = async () => {
    if (!editingBanner) return

    try {
      setLoading(true)

      let imageUrl = bannerForm.image
      if (bannerImageFile) {
        imageUrl = await uploadBannerImage(bannerImageFile)
      }

      const updatedBanner = {
        ...editingBanner,
        ...bannerForm,
        image: imageUrl,
      }

      setBanners((prev) => prev.map((banner) => (banner.id === editingBanner.id ? updatedBanner : banner)))

      setEditingBanner(null)
      resetBannerForm()
      alert("Banner đã được cập nhật thành công!")
    } catch (error) {
      console.error("Error updating banner:", error)
      alert("Có lỗi xảy ra khi cập nhật banner")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBanner = (bannerId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return

    setBanners((prev) => prev.filter((banner) => banner.id !== bannerId))
    alert("Banner đã được xóa thành công!")
  }

  const resetBannerForm = () => {
    setBannerForm({
      title: "",
      subtitle: "",
      image: "",
      link: "",
      buttonText: "",
      isActive: true,
    })
    setBannerImageFile(null)
    setBannerImagePreview("")
  }

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setBannerForm({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      buttonText: banner.buttonText,
      isActive: banner.isActive,
    })
    setBannerImagePreview(banner.image)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
          <p className="text-gray-600">Quản lý cài đặt website và banner</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Cài đặt chung</TabsTrigger>
            <TabsTrigger value="banners">Quản lý Banner</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="maintenance">Bảo trì</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Website</CardTitle>
                <CardDescription>Cài đặt thông tin cơ bản của website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Tên website</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings((prev) => ({ ...prev, siteName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email liên hệ</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Mô tả website</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings((prev) => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="siteKeywords">Từ khóa (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="siteKeywords"
                    value={settings.siteKeywords}
                    onChange={(e) => setSettings((prev) => ({ ...prev, siteKeywords: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPhone">Số điện thoại</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactAddress">Địa chỉ</Label>
                    <Input
                      id="contactAddress"
                      value={settings.contactAddress}
                      onChange={(e) => setSettings((prev) => ({ ...prev, contactAddress: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mạng Xã Hội</CardTitle>
                <CardDescription>Liên kết đến các trang mạng xã hội</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={settings.socialMedia.facebook}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, facebook: e.target.value },
                        }))
                      }
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={settings.socialMedia.instagram}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, instagram: e.target.value },
                        }))
                      }
                      placeholder="https://instagram.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube">YouTube</Label>
                    <Input
                      id="youtube"
                      value={settings.socialMedia.youtube}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, youtube: e.target.value },
                        }))
                      }
                      placeholder="https://youtube.com/yourchannel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zalo">Zalo</Label>
                    <Input
                      id="zalo"
                      value={settings.socialMedia.zalo}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          socialMedia: { ...prev.socialMedia, zalo: e.target.value },
                        }))
                      }
                      placeholder="0987654321"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Cài Đặt
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Banner Management */}
          <TabsContent value="banners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tạo Banner Mới</CardTitle>
                <CardDescription>Thêm banner cho trang chủ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bannerTitle">Tiêu đề</Label>
                    <Input
                      id="bannerTitle"
                      value={bannerForm.title}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="Tiêu đề banner"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bannerButtonText">Text nút</Label>
                    <Input
                      id="bannerButtonText"
                      value={bannerForm.buttonText}
                      onChange={(e) => setBannerForm((prev) => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Xem Sản Phẩm"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bannerSubtitle">Mô tả</Label>
                  <Textarea
                    id="bannerSubtitle"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Mô tả ngắn gọn về banner"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="bannerLink">Liên kết</Label>
                  <Input
                    id="bannerLink"
                    value={bannerForm.link}
                    onChange={(e) => setBannerForm((prev) => ({ ...prev, link: e.target.value }))}
                    placeholder="/products hoặc https://example.com"
                  />
                </div>

                {/* Banner Image Upload */}
                <div>
                  <Label>Hình ảnh banner</Label>

                  {bannerImagePreview && (
                    <div className="mb-2">
                      <div className="relative inline-block">
                        <Image
                          src={bannerImagePreview || "/placeholder.svg"}
                          alt="Banner preview"
                          width={400}
                          height={200}
                          className="w-96 h-48 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => {
                            setBannerImagePreview("")
                            setBannerImageFile(null)
                            setBannerForm((prev) => ({ ...prev, image: "" }))
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      className="hidden"
                      id="banner-image-upload"
                    />
                    <label htmlFor="banner-image-upload" className="cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg text-gray-600 mb-2">Nhấp để chọn hình ảnh banner</p>
                      <p className="text-sm text-gray-500">Khuyến nghị: 1920x800px, JPG/PNG (tối đa 5MB)</p>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="bannerActive"
                    checked={bannerForm.isActive}
                    onCheckedChange={(checked) => setBannerForm((prev) => ({ ...prev, isActive: checked }))}
                  />
                  <Label htmlFor="bannerActive">Kích hoạt banner</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  {editingBanner && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingBanner(null)
                        resetBannerForm()
                      }}
                    >
                      Hủy
                    </Button>
                  )}
                  <Button onClick={editingBanner ? handleUpdateBanner : handleCreateBanner} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingBanner ? "Đang cập nhật..." : "Đang tạo..."}
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        {editingBanner ? "Cập Nhật Banner" : "Tạo Banner"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Danh Sách Banner</CardTitle>
                <CardDescription>Quản lý các banner hiện có</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {banners.map((banner) => (
                    <div key={banner.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Image
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.title}
                        width={120}
                        height={60}
                        className="w-30 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{banner.title}</h3>
                        <p className="text-sm text-gray-600">{banner.subtitle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Liên kết: {banner.link}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              banner.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {banner.isActive ? "Hoạt động" : "Tạm dừng"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openEditBanner(banner)}>
                          Sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài Đặt SEO</CardTitle>
                <CardDescription>Tối ưu hóa công cụ tìm kiếm</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaTitle: e.target.value },
                      }))
                    }
                    placeholder="Tiêu đề hiển thị trên Google"
                  />
                  <p className="text-xs text-gray-500 mt-1">Khuyến nghị: 50-60 ký tự</p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, metaDescription: e.target.value },
                      }))
                    }
                    placeholder="Mô tả hiển thị trên Google"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">Khuyến nghị: 150-160 ký tự</p>
                </div>

                <div>
                  <Label htmlFor="ogImage">Open Graph Image (URL)</Label>
                  <Input
                    id="ogImage"
                    value={settings.seo.ogImage}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, ogImage: e.target.value },
                      }))
                    }
                    placeholder="https://example.com/og-image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hình ảnh hiển thị khi chia sẻ trên mạng xã hội (1200x630px)
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Cài Đặt SEO
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Maintenance Mode */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chế Độ Bảo Trì</CardTitle>
                <CardDescription>Tạm thời đóng website để bảo trì</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceEnabled"
                    checked={settings.maintenance.enabled}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, enabled: checked },
                      }))
                    }
                  />
                  <Label htmlFor="maintenanceEnabled">Bật chế độ bảo trì</Label>
                </div>

                {settings.maintenance.enabled && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm">
                      ⚠️ Khi bật chế độ bảo trì, website sẽ hiển thị trang bảo trì cho tất cả người dùng (trừ admin).
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="maintenanceMessage">Thông báo bảo trì</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenance.message}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maintenance: { ...prev.maintenance, message: e.target.value },
                      }))
                    }
                    placeholder="Thông báo hiển thị cho người dùng khi website bảo trì"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSaveSettings} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Cài Đặt Bảo Trì
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
