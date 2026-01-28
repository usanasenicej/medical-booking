"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { PatientSidebar } from "@/components/patient-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "patient") {
      router.push("/auth/login")
    }
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || user?.role !== "patient") {
    return null
  }

  return (
    <SidebarProvider>
      <PatientSidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b bg-white">
          <div className="flex h-16 items-center px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.firstName}</span>
            </div>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
