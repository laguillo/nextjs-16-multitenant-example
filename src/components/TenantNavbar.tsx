"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Tenant } from "@/lib/tenants"
import { themeConfig } from "@/lib/tenants"

interface TenantNavbarProps {
  tenant: Tenant
  userName: string
  userRole: string
}

const navLinks = [
  { href: "/", label: "Dashboard", icon: "▦" },
  { href: "/products", label: "Productos", icon: "⬡" },
  { href: "/users", label: "Usuarios", icon: "◉" },
]

export default function TenantNavbar({ tenant, userName, userRole }: TenantNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const theme = themeConfig[tenant.theme]

  // La ruta real tiene prefijo /[tenant], obtenemos solo el segmento relativo
  // Ejemplo: pathname = "/tenant1/products" → tenantRelative = "/products"
  const tenantRelative = pathname.replace(`/${tenant.subdomain}`, "") || "/"

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.refresh()
    // La cookie se eliminó → proxy redirige a /login automáticamente
    window.location.href = "/"
  }

  return (
    <nav className={`${theme.navBg} shadow-lg`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo + nombre del tenant */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">{tenant.logo}</span>
            <div>
              <span className="text-white font-bold text-base leading-none">
                {tenant.name}
              </span>
              <span className="ml-2 text-white/60 text-xs hidden sm:inline">
                {tenant.industry}
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded-full ml-1">
              {tenant.plan}
            </span>
          </div>

          {/* Links de navegación */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? tenantRelative === "/"
                  : tenantRelative.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="hidden sm:inline">{link.label}</span>
                  <span className="sm:hidden">{link.icon}</span>
                </Link>
              )
            })}
          </div>

          {/* Usuario + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-white text-sm font-medium leading-none">{userName}</p>
              <p className="text-white/60 text-xs">{userRole}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-white/70 hover:text-white text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
