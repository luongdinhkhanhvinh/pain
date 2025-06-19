import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { contactRequests, customers } from "@/server/db/schema"
import { count, gte, lte, and } from "drizzle-orm"

export async function GET() {
  try {
    const salesData = []
    const now = new Date()

    // Get data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      // Get contacts for this month
      const monthContacts = await db
        .select({ count: count() })
        .from(contactRequests)
        .where(and(
          gte(contactRequests.createdAt, monthStart),
          lte(contactRequests.createdAt, monthEnd)
        ))

      // Get customers created this month (converted from contacts)
      const monthCustomers = await db
        .select({ count: count() })
        .from(customers)
        .where(and(
          gte(customers.createdAt, monthStart),
          lte(customers.createdAt, monthEnd)
        ))

      // Mock sales calculation (customers * average order value)
      const mockSales = monthCustomers[0].count * 45 + Math.floor(Math.random() * 20)

      const monthName = monthStart.toLocaleDateString("vi-VN", { month: "short" }).toUpperCase()

      salesData.push({
        month: monthName,
        sales: mockSales,
        contacts: monthContacts[0].count,
      })
    }

    return NextResponse.json({ salesData })
  } catch (error) {
    console.error("Error fetching sales chart data:", error)
    return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 })
  }
}
