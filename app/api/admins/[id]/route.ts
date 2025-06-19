import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbHelpers } from "@/server/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Check if this is hardcoded admin
    if (decoded.adminId === "hardcoded-admin-001") {
      return {
        id: "hardcoded-admin-001",
        username: "admin",
        email: "admin@silklux.com",
        fullName: "System Administrator",
        role: "super_admin",
        avatar: null,
        isActive: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    }

    // Normal database verification
    const admin = await dbHelpers.findAdminById(decoded.adminId)

    if (!admin) return null

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role,
      avatar: admin.avatar,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  } catch {
    return null
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const adminId = params.id
    const { username, email, fullName, password, role } = await request.json()

    // Check permissions
    const canEdit =
      currentAdmin.role === "super_admin" ||
      (currentAdmin.role === "admin" && role === "editor") ||
      currentAdmin.id === adminId

    if (!canEdit) {
      return NextResponse.json({ success: false, error: "Không có quyền chỉnh sửa" }, { status: 403 })
    }

    // Prepare update data
    const updateData: any = {
      username,
      email,
      fullName,
      role,
    }

    // Hash new password if provided
    if (password && password.trim() !== "") {
      updateData.passwordHash = await bcrypt.hash(password, 12)
    }

    // Update admin
    const updatedAdmin = await dbHelpers.updateAdmin(adminId, updateData)

    if (!updatedAdmin) {
      throw new Error("Failed to update admin")
    }

    const formattedAdmin = {
      id: updatedAdmin.id,
      username: updatedAdmin.username,
      email: updatedAdmin.email,
      fullName: updatedAdmin.fullName,
      role: updatedAdmin.role,
      avatar: updatedAdmin.avatar,
      isActive: updatedAdmin.isActive,
      lastLoginAt: updatedAdmin.lastLoginAt,
      createdAt: updatedAdmin.createdAt,
      updatedAt: updatedAdmin.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedAdmin,
      message: "Cập nhật admin thành công",
    })
  } catch (error) {
    console.error("Update admin error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const adminId = params.id

    // Prevent self-deletion
    if (currentAdmin.id === adminId) {
      return NextResponse.json({ success: false, error: "Không thể xóa chính mình" }, { status: 400 })
    }

    // Check permissions
    if (currentAdmin.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "Không có quyền xóa" }, { status: 403 })
    }

    // Delete admin (soft delete)
    await dbHelpers.deleteAdmin(adminId)

    return NextResponse.json({
      success: true,
      message: "Xóa admin thành công",
    })
  } catch (error) {
    console.error("Delete admin error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}
