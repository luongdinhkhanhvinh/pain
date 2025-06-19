import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 },
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File too large. Maximum size is 5MB.",
        },
        { status: 400 },
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split(".").pop()
    const filename = `${timestamp}-${randomString}.${extension}`

    // Save to public/uploads directory
    const uploadDir = join(process.cwd(), "public", "uploads")
    const filepath = join(uploadDir, filename)

    // Create uploads directory if it doesn't exist
    try {
      await writeFile(filepath, buffer)
    } catch (error) {
      // If directory doesn't exist, create it
      const { mkdir } = await import("fs/promises")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(filepath, buffer)
    }

    // Return the public URL
    const url = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      },
      { status: 500 },
    )
  }
}
