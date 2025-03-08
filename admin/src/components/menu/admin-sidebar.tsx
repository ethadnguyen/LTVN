"use client"

import { Box, LayoutDashboard, Package, Percent, ShoppingCart, Tags, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Tổng quan",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sản phẩm",
    href: "/products",
    icon: Package,
  },
  {
    title: "Danh mục",
    href: "/categories",
    icon: Tags,
  },
  {
    title: "Đơn hàng",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Tài khoản",
    href: "/accounts",
    icon: Users,
  },
  {
    title: "Khuyến mãi",
    href: "/promotions",
    icon: Percent,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Box className="h-6 w-6" />
          <span>Quản trị</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname === item.href} className="flex items-center gap-2">
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

