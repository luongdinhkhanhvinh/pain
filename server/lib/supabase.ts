import { db } from "@/server/db"
import { admins } from "@/server/db/schema"
import { eq, and } from "drizzle-orm"

// Database helper functions to replace Supabase
export const dbHelpers = {
  // Admin operations
  async findAdminByUsername(username: string) {
    const result = await db
      .select()
      .from(admins)
      .where(and(eq(admins.username, username), eq(admins.isActive, true)))
      .limit(1)

    return result[0] || null
  },

  async findAdminById(id: string) {
    const result = await db
      .select()
      .from(admins)
      .where(and(eq(admins.id, id), eq(admins.isActive, true)))
      .limit(1)

    return result[0] || null
  },

  async createAdmin(adminData: {
    username: string
    email: string
    fullName: string
    passwordHash: string
    role: "admin" | "super_admin"
  }) {
    const result = await db
      .insert(admins)
      .values({
        username: adminData.username,
        email: adminData.email,
        fullName: adminData.fullName,
        passwordHash: adminData.passwordHash,
        role: adminData.role,
        isActive: true,
      })
      .returning()

    return result[0]
  },

  async updateAdminLastLogin(id: string) {
    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, id))
  },

  async getAllAdmins() {
    return await db.select().from(admins)
  },

  async updateAdmin(id: string, data: Partial<typeof admins.$inferInsert>) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }

    const result = await db
      .update(admins)
      .set(updateData)
      .where(eq(admins.id, id))
      .returning()

    return result[0]
  },

  async deleteAdmin(id: string) {
    await db
      .update(admins)
      .set({ isActive: false })
      .where(eq(admins.id, id))
  }
}
