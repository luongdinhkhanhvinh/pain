import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbHelpers } from "@/server/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware to verify admin token
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any

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

export async function GET(request: NextRequest) {
  try {
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const admins = await dbHelpers.getAllAdmins()

    const formattedAdmins = admins.map((admin) => ({
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
    }))

    return NextResponse.json({
      success: true,
      data: formattedAdmins,
    })
  } catch (error) {
    console.error("Get admins error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentAdmin = await verifyAdmin(request)
    if (!currentAdmin || currentAdmin.role !== "super_admin") {
      return NextResponse.json({ success: false, error: "Không có quyền truy cập" }, { status: 403 })
    }

    const { username, email, fullName, password, role } = await request.json()

    if (!username || !email || !fullName || !password || !role) {
      return NextResponse.json({ success: false, error: "Thiếu thông tin bắt buộc" }, { status: 400 })
    }

    // Check if username or email already exists
    const existingAdminByUsername = await dbHelpers.findAdminByUsername(username)
    if (existingAdminByUsername) {
      return NextResponse.json({ success: false, error: "Tên đăng nhập hoặc email đã tồn tại" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create admin
    const newAdmin = await dbHelpers.createAdmin({
      username,
      email,
      fullName,
      passwordHash,
      role,
    })

    const formattedAdmin = {
      id: newAdmin.id,
      username: newAdmin.username,
      email: newAdmin.email,
      fullName: newAdmin.fullName,
      role: newAdmin.role,
      avatar: newAdmin.avatar,
      isActive: newAdmin.isActive,
      lastLoginAt: newAdmin.lastLoginAt,
      createdAt: newAdmin.createdAt,
      updatedAt: newAdmin.updatedAt,
    }

    return NextResponse.json({
      success: true,
      data: formattedAdmin,
      message: "Tạo admin thành công",
    })
  } catch (error) {
    console.error("Create admin error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}
