import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { dbHelpers } from "@/server/lib/supabase"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username và password là bắt buộc" }, { status: 400 })
    }

    // Hardcoded admin bypass
    if (username === "admin" && password === "admin123") {
      const hardcodedAdmin = {
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

      // Generate JWT token for hardcoded admin
      const token = jwt.sign(
        {
          adminId: hardcodedAdmin.id,
          username: hardcodedAdmin.username,
          role: hardcodedAdmin.role,
        },
        JWT_SECRET,
        { expiresIn: "7d" },
      )

      return NextResponse.json({
        success: true,
        data: {
          user: hardcodedAdmin,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
        message: "Đăng nhập thành công với tài khoản admin"
      })
    }

    // Normal database authentication
    const admin = await dbHelpers.findAdminByUsername(username)

    if (!admin) {
      return NextResponse.json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: "Tên đăng nhập hoặc mật khẩu không đúng" }, { status: 401 })
    }

    // Update last login
    await dbHelpers.updateAdminLastLogin(admin.id)

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin.id,
        username: admin.username,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Return user data (without password)
    const userData = {
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

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 })
  }
}
