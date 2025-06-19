import { type NextRequest, NextResponse } from "next/server"
import { db, blogPosts, updateBlogPostSchema } from "@/server/db"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, params.id)).limit(1)

    if (!post) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error("Error fetching blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch blog post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const validatedData = updateBlogPostSchema.parse(body)

    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...validatedData,
        updatedAt: new Date(),
        publishedAt: validatedData.isPublished ? new Date() : null,
      })
      .where(eq(blogPosts.id, params.id))
      .returning()

    if (!updatedPost) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      message: "Blog post updated successfully",
    })
  } catch (error) {
    console.error("Error updating blog post:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ success: false, error: "Failed to update blog post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [deletedPost] = await db.delete(blogPosts).where(eq(blogPosts.id, params.id)).returning()

    if (!deletedPost) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return NextResponse.json({ success: false, error: "Failed to delete blog post" }, { status: 500 })
  }
}
