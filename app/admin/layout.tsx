"use client"

import type React from "react"

import { AuthProvider } from "@/hooks/use-auth"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <AuthGuard>{children}</AuthGuard>
    </AuthProvider>
  )
}
