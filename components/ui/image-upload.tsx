"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { uploadToImageKit, getImageKitUrl, imageTransformations } from "@/lib/imagekit"
import Image from "next/image"

interface UploadedImage {
  fileId: string
  name: string
  filePath: string
  url: string
  thumbnailUrl: string
}

interface ImageUploadProps {
  onImagesChange: (images: UploadedImage[]) => void
  maxImages?: number
  existingImages?: UploadedImage[]
}

export function ImageUpload({ 
  onImagesChange, 
  maxImages = 5, 
  existingImages = [] 
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList) => {
    if (images.length + files.length > maxImages) {
      alert(`Chỉ có thể upload tối đa ${maxImages} hình ảnh`)
      return
    }

    setUploading(true)
    const newImages: UploadedImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} không phải là hình ảnh`)
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`File ${file.name} quá lớn. Kích thước tối đa là 5MB`)
          continue
        }

        // Generate unique filename
        const timestamp = Date.now()
        const fileName = `product_${timestamp}_${i}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`

        // Upload to ImageKit
        const result = await uploadToImageKit(file, fileName)
        
        const uploadedImage: UploadedImage = {
          fileId: result.fileId,
          name: result.name,
          filePath: result.filePath,
          url: result.url,
          thumbnailUrl: getImageKitUrl(result.filePath, imageTransformations.thumbnail)
        }

        newImages.push(uploadedImage)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      onImagesChange(updatedImages)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Có lỗi xảy ra khi upload hình ảnh')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    onImagesChange(updatedImages)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive 
            ? 'border-amber-500 bg-amber-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm text-gray-600">Đang upload hình ảnh...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-medium">Kéo thả hình ảnh vào đây</p>
                <p className="text-sm text-gray-600">hoặc</p>
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2"
                >
                  Chọn hình ảnh
                </Button>
              </div>
              <div className="text-xs text-gray-500">
                <p>Hỗ trợ: JPG, PNG, GIF (tối đa 5MB mỗi file)</p>
                <p>Tối đa {maxImages} hình ảnh</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={image.fileId} className="relative group">
              <CardContent className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={image.thumbnailUrl}
                    alt={image.name}
                    fill
                    className="object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1 text-xs">
                      Ảnh chính
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {image.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
