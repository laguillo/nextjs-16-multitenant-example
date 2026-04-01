// ============================================================
// DATOS HARDCODEADOS - Simulan una base de datos multi-tenant
// ============================================================

export type TenantTheme = "blue" | "green" | "orange"
export type TenantPlan = "Starter" | "Pro" | "Enterprise"

export interface TenantUser {
  id: string
  name: string
  email: string
  password: string // en producción real esto sería un hash
  role: "Admin" | "Manager" | "Viewer"
  createdAt: string
}

export interface TenantProduct {
  id: string
  name: string
  category: string
  price: number
  stock: number
  status: "active" | "inactive" | "draft"
}

export interface Tenant {
  id: string
  subdomain: string
  name: string
  logo: string
  theme: TenantTheme
  plan: TenantPlan
  industry: string
  users: TenantUser[]
  products: TenantProduct[]
}

// Paleta de colores por tema (Tailwind classes)
export const themeConfig: Record<TenantTheme, {
  primary: string
  primaryHover: string
  badge: string
  navBg: string
  navText: string
  accent: string
  ring: string
}> = {
  blue: {
    primary: "bg-blue-600",
    primaryHover: "hover:bg-blue-700",
    badge: "bg-blue-100 text-blue-800",
    navBg: "bg-blue-700",
    navText: "text-white",
    accent: "text-blue-600",
    ring: "ring-blue-500",
  },
  green: {
    primary: "bg-emerald-600",
    primaryHover: "hover:bg-emerald-700",
    badge: "bg-emerald-100 text-emerald-800",
    navBg: "bg-emerald-700",
    navText: "text-white",
    accent: "text-emerald-600",
    ring: "ring-emerald-500",
  },
  orange: {
    primary: "bg-orange-500",
    primaryHover: "hover:bg-orange-600",
    badge: "bg-orange-100 text-orange-800",
    navBg: "bg-orange-500",
    navText: "text-white",
    accent: "text-orange-600",
    ring: "ring-orange-500",
  },
}

// ============================================================
// TENANTS
// ============================================================
export const tenants: Tenant[] = [
  {
    id: "tenant1",
    subdomain: "tenant1",
    name: "Acme Corp",
    logo: "🏭",
    theme: "blue",
    plan: "Pro",
    industry: "Manufactura",
    users: [
      {
        id: "u1",
        name: "Alice Johnson",
        email: "alice@acme.com",
        password: "tenant1123",
        role: "Admin",
        createdAt: "2024-01-10",
      },
      {
        id: "u2",
        name: "Bob Smith",
        email: "bob@acme.com",
        password: "tenant1123",
        role: "Manager",
        createdAt: "2024-02-15",
      },
      {
        id: "u3",
        name: "Carol White",
        email: "carol@acme.com",
        password: "tenant1123",
        role: "Viewer",
        createdAt: "2024-03-20",
      },
    ],
    products: [
      { id: "p1", name: "Tornillo Industrial M8", category: "Ferretería", price: 0.45, stock: 15000, status: "active" },
      { id: "p2", name: "Tuerca Hexagonal M8", category: "Ferretería", price: 0.30, stock: 12000, status: "active" },
      { id: "p3", name: "Placa de Acero 2mm", category: "Materiales", price: 85.00, stock: 320, status: "active" },
      { id: "p4", name: "Perfil Aluminio L40", category: "Materiales", price: 22.50, stock: 850, status: "active" },
      { id: "p5", name: "Motor Eléctrico 1HP", category: "Maquinaria", price: 450.00, stock: 45, status: "active" },
      { id: "p6", name: "Banda Transportadora 2m", category: "Maquinaria", price: 180.00, stock: 12, status: "inactive" },
      { id: "p7", name: "Sensor de Temperatura PT100", category: "Electrónica", price: 35.00, stock: 200, status: "active" },
      { id: "p8", name: "Caja de Control IP65", category: "Electrónica", price: 95.00, stock: 78, status: "draft" },
    ],
  },
  {
    id: "tenant2",
    subdomain: "tenant2",
    name: "Globex Inc",
    logo: "🌐",
    theme: "green",
    plan: "Enterprise",
    industry: "Tecnología",
    users: [
      {
        id: "u1",
        name: "David Chen",
        email: "david@globex.com",
        password: "tenant2123",
        role: "Admin",
        createdAt: "2023-11-05",
      },
      {
        id: "u2",
        name: "Emma Davis",
        email: "emma@globex.com",
        password: "tenant2123",
        role: "Manager",
        createdAt: "2023-12-01",
      },
      {
        id: "u3",
        name: "Frank Miller",
        email: "frank@globex.com",
        password: "tenant2123",
        role: "Manager",
        createdAt: "2024-01-08",
      },
      {
        id: "u4",
        name: "Grace Lee",
        email: "grace@globex.com",
        password: "tenant2123",
        role: "Viewer",
        createdAt: "2024-04-22",
      },
    ],
    products: [
      { id: "p1", name: "SaaS Platform Basic", category: "Software", price: 49.00, stock: 999, status: "active" },
      { id: "p2", name: "SaaS Platform Pro", category: "Software", price: 149.00, stock: 999, status: "active" },
      { id: "p3", name: "SaaS Platform Enterprise", category: "Software", price: 499.00, stock: 999, status: "active" },
      { id: "p4", name: "API Gateway 1M calls/mo", category: "Infraestructura", price: 25.00, stock: 999, status: "active" },
      { id: "p5", name: "CDN 1TB bandwidth", category: "Infraestructura", price: 80.00, stock: 999, status: "active" },
      { id: "p6", name: "Analytics Dashboard", category: "Add-ons", price: 30.00, stock: 999, status: "active" },
      { id: "p7", name: "SSO Integration", category: "Add-ons", price: 50.00, stock: 999, status: "draft" },
    ],
  },
  {
    id: "tenant3",
    subdomain: "tenant3",
    name: "Initech",
    logo: "📋",
    theme: "orange",
    plan: "Starter",
    industry: "Consultoría",
    users: [
      {
        id: "u1",
        name: "Peter Gibbons",
        email: "peter@initech.com",
        password: "tenant3123",
        role: "Admin",
        createdAt: "2024-05-01",
      },
      {
        id: "u2",
        name: "Samir Nagheenanajar",
        email: "samir@initech.com",
        password: "tenant3123",
        role: "Viewer",
        createdAt: "2024-05-15",
      },
    ],
    products: [
      { id: "p1", name: "Consultoría IT básica (1h)", category: "Servicios", price: 120.00, stock: 999, status: "active" },
      { id: "p2", name: "Auditoría de Sistemas", category: "Servicios", price: 2500.00, stock: 10, status: "active" },
      { id: "p3", name: "Migración Cloud AWS", category: "Proyectos", price: 8000.00, stock: 5, status: "active" },
      { id: "p4", name: "Capacitación DevOps (8h)", category: "Formación", price: 800.00, stock: 20, status: "inactive" },
      { id: "p5", name: "Soporte Mensual Premium", category: "Soporte", price: 350.00, stock: 999, status: "active" },
    ],
  },
]

// ============================================================
// HELPERS
// ============================================================
export function getTenantBySubdomain(subdomain: string): Tenant | undefined {
  return tenants.find((t) => t.subdomain === subdomain)
}

export function validateLogin(
  subdomain: string,
  email: string,
  password: string
): TenantUser | null {
  const tenant = getTenantBySubdomain(subdomain)
  if (!tenant) return null
  const user = tenant.users.find(
    (u) => u.email === email && u.password === password
  )
  return user ?? null
}

export function getTenantStats(tenant: Tenant) {
  const activeProducts = tenant.products.filter((p) => p.status === "active").length
  const totalStock = tenant.products.reduce((acc, p) => acc + p.stock, 0)
  const catalogValue = tenant.products.reduce((acc, p) => acc + p.price * p.stock, 0)
  return {
    totalUsers: tenant.users.length,
    totalProducts: tenant.products.length,
    activeProducts,
    totalStock,
    catalogValue,
  }
}
