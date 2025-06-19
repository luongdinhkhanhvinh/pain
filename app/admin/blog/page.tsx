"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, Upload, X, Save } from "lucide-react"
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
import { BLOG_CATEGORIES } from "@/shared/constants"
import type { BlogPost } from "@/shared/types"
import { AdminLayout } from "@/components/admin/admin-layout"
import Image from "next/image"

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    author: "",
    category: "",
    tags: [] as string[],
    isPublished: false,
  })

  // Image upload states
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blog")
      const result = await response.json()

      if (result.success) {
        setPosts(result.data.posts)
      } else {
        console.error("Error fetching posts:", result.error)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
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
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFeaturedImageFile(file)
    setFeaturedImagePreview(URL.createObjectURL(file))
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleCreatePost = async () => {
    try {
      setSubmitting(true)

      // Upload featured image if exists
      let featuredImageUrl = formData.featuredImage
      if (featuredImageFile) {
        setUploadingImage(true)
        featuredImageUrl = await uploadImage(featuredImageFile)
        setUploadingImage(false)
      }

      // Generate slug if not provided
      const slug = formData.slug || generateSlug(formData.title)

      const postData = {
        ...formData,
        slug,
        featuredImage: featuredImageUrl,
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchPosts()
        setIsCreateDialogOpen(false)
        resetForm()
        alert("Bài viết đã được tạo thành công!")
      } else {
        alert("Lỗi: " + result.error)
      }
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Có lỗi xảy ra khi tạo bài viết")
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  const handleUpdatePost = async () => {
    if (!editingPost) return

    try {
      setSubmitting(true)

      // Upload new featured image if exists
      let featuredImageUrl = formData.featuredImage
      if (featuredImageFile) {
        setUploadingImage(true)
        featuredImageUrl = await uploadImage(featuredImageFile)
        setUploadingImage(false)
      }

      const postData = {
        ...formData,
        featuredImage: featuredImageUrl,
      }

      const response = await fetch(`/api/blog/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      })

      const result = await response.json()

      if (result.success) {
        await fetchPosts()
        setEditingPost(null)
        resetForm()
        alert("Bài viết đã được cập nhật thành công!")
      } else {
        alert("Lỗi: " + result.error)
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Có lỗi xảy ra khi cập nhật bài viết")
    } finally {
      setSubmitting(false)
      setUploadingImage(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return

    try {
      const response = await fetch(`/api/blog/${postId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        await fetchPosts()
        alert("Bài viết đã được xóa thành công!")
      } else {
        alert("Lỗi: " + result.error)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Có lỗi xảy ra khi xóa bài viết")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      author: "",
      category: "",
      tags: [],
      isPublished: false,
    })
    setFeaturedImageFile(null)
    setFeaturedImagePreview("")
  }

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || "",
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      isPublished: post.isPublished,
    })
    if (post.featuredImage) {
      setFeaturedImagePreview(post.featuredImage)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag.trim()],
      }))
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  const BlogForm = ({ isEdit = false }) => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Tiêu đề *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              const title = e.target.value
              setFormData((prev) => ({
                ...prev,
                title,
                slug: prev.slug || generateSlug(title),
              }))
            }}
            placeholder="Nhập tiêu đề bài viết"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="url-bai-viet"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Tóm tắt *</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Tóm tắt ngắn gọn về bài viết"
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Nội dung *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
          placeholder="Nội dung chi tiết bài viết (hỗ trợ Markdown)"
          rows={10}
          required
        />
      </div>

      {/* Featured Image */}
      <div>
        <Label>Ảnh đại diện</Label>

        {/* Current Image */}
        {featuredImagePreview && (
          <div className="mb-2">
            <div className="relative inline-block">
              <Image
                src={featuredImagePreview || "/placeholder.svg"}
                alt="Featured image preview"
                width={200}
                height={120}
                className="w-48 h-28 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => {
                  setFeaturedImagePreview("")
                  setFeaturedImageFile(null)
                  setFormData((prev) => ({ ...prev, featuredImage: "" }))
                }}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Upload Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFeaturedImageUpload}
            className="hidden"
            id="featured-image-upload"
          />
          <label htmlFor="featured-image-upload" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">Nhấp để chọn ảnh đại diện</p>
            <p className="text-xs text-gray-500 mt-1">Khuyến nghị: 800x450px, JPG/PNG (tối đa 2MB)</p>
          </label>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="author">Tác giả *</Label>
          <Input
            id="author"
            value={formData.author}
            onChange={(e) => setFormData((prev) => ({ ...prev, author: e.target.value }))}
            placeholder="Tên tác giả"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Danh mục *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent>
              {BLOG_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-1 mb-2 min-h-[32px] p-2 border rounded-md">
          {formData.tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-red-100"
              onClick={() => removeTag(index)}
            >
              {tag} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Nhập tag và nhấn Enter"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addTag(e.currentTarget.value)
              e.currentTarget.value = ""
            }
          }}
        />
      </div>

      {/* Publish Settings */}
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublished"
          checked={formData.isPublished}
          onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPublished: checked }))}
        />
        <Label htmlFor="isPublished">Xuất bản ngay</Label>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Bài Viết</h1>
            <p className="text-gray-600">Quản lý nội dung blog và tin tức</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Thêm Bài Viết
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Tạo Bài Viết Mới</DialogTitle>
                <DialogDescription>Tạo bài viết blog hoặc tin tức mới</DialogDescription>
              </DialogHeader>

              <BlogForm />

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={submitting}>
                  Hủy
                </Button>
                <Button
                  onClick={handleCreatePost}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting || uploadingImage}
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {uploadingImage ? "Đang tải ảnh..." : "Đang tạo..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Tạo Bài Viết
                    </>
                  )}
                </Button>
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
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {BLOG_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Posts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Bài Viết ({filteredPosts.length})</CardTitle>
            <CardDescription>Quản lý các bài viết blog và tin tức</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Đang tải...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài viết</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {post.featuredImage && (
                            <Image
                              src={post.featuredImage || "/placeholder.svg"}
                              alt={post.title}
                              width={50}
                              height={50}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{post.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{post.excerpt}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{post.author}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{post.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={post.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {post.isPublished ? "Đã xuất bản" : "Nháp"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                              <DialogHeader>
                                <DialogTitle>Chỉnh Sửa Bài Viết</DialogTitle>
                                <DialogDescription>Cập nhật nội dung bài viết</DialogDescription>
                              </DialogHeader>

                              <BlogForm isEdit={true} />

                              <div className="flex justify-end space-x-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setEditingPost(null)} disabled={submitting}>
                                  Hủy
                                </Button>
                                <Button
                                  onClick={handleUpdatePost}
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={submitting || uploadingImage}
                                >
                                  {submitting ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      {uploadingImage ? "Đang tải ảnh..." : "Đang cập nhật..."}
                                    </>
                                  ) : (
                                    <>
                                      <Save className="w-4 h-4 mr-2" />
                                      Cập Nhật
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
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
