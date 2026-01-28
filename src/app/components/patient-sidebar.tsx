"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Calendar, Home, User, Users, LogOut, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

const menuItems = [
  {
    title: "Dashboard",
    url: "/patient/dashboard",
    icon: Home,
  },
  {
    title: "My Appointments",
    url: "/patient/appointments",
    icon: Calendar,
  },
  {
    title: "Book Appointment",
    url: "/patient/book-appointment",
    icon: Plus,
  },
  {
    title: "Browse Doctors",
    url: "/patient/doctors",
    icon: Users,
  },
  {
    title: "My Profile",
    url: "/patient/profile",
    icon: User,
  },
]

export function PatientSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300">
      <SidebarHeader className="animate-slideIn">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-colors duration-200" />
            <span className="text-xl font-bold dark:text-white">MediCare</span>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="dark:text-gray-300">Patient Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem
                  key={item.title}
                  className="animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="transition-all duration-200 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Link href={item.url}>
                      <item.icon className="transition-colors duration-200" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="animate-slideIn" style={{ animationDelay: "0.6s" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              className="w-full justify-start transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-gray-300"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
