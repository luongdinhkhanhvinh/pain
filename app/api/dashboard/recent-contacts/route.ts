import { NextResponse } from "next/server"
import { db } from "@/server/db"
import { contactRequests } from "@/server/db/schema"
import { desc } from "drizzle-orm"

export async function GET() {
  try {
    const recentContacts = await db
      .select({
        id: contactRequests.id,
        name: contactRequests.name,
        phone: contactRequests.phone,
        email: contactRequests.email,
        address: contactRequests.address,
        product: contactRequests.productName,
        message: contactRequests.message,
        status: contactRequests.status,
        createdAt: contactRequests.createdAt,
      })
      .from(contactRequests)
      .orderBy(desc(contactRequests.createdAt))
      .limit(5)

    return NextResponse.json({ contacts: recentContacts })
  } catch (error) {
    console.error("Error fetching recent contacts:", error)
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 })
  }
}
