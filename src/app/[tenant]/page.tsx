import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { getTenantBySubdomain, getTenantStats, themeConfig } from "@/lib/tenants"

// PageProps es un helper global en Next.js 16 (no requiere import)
export default async function TenantDashboard({ params }: PageProps<"/[tenant]">) {
  const { tenant: tenantSlug } = await params

  const tenant = getTenantBySubdomain(tenantSlug)
  if (!tenant) notFound()

  const stats = getTenantStats(tenant)
  const theme = themeConfig[tenant.theme]

  // Leer sesión para mostrar bienvenida personalizada
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("tenant-session")
  let userName = "Usuario"
  let userRole = "Viewer"
  if (sessionCookie?.value) {
    try {
      const session = JSON.parse(sessionCookie.value)
      userName = session.name ?? userName
      userRole = session.role ?? userRole
    } catch { /* ignore */ }
  }

  // Top 5 productos activos por stock
  const topProducts = [...tenant.products]
    .filter((p) => p.status === "active")
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido, {userName.split(" ")[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {tenant.name} · Plan <span className="font-medium">{tenant.plan}</span>
          {" · "}
          <span className="font-mono text-xs text-gray-400">{tenantSlug}.localhost:3000</span>
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Usuarios", value: stats.totalUsers, sub: "en el tenant" },
          { label: "Productos", value: stats.totalProducts, sub: `${stats.activeProducts} activos` },
          { label: "Stock total", value: stats.totalStock.toLocaleString(), sub: "unidades" },
          {
            label: "Valor catálogo",
            value: `$${stats.catalogValue.toLocaleString("es", { maximumFractionDigits: 0 })}`,
            sub: "precio × stock",
          },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-500 text-xs">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${theme.accent}`}>{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabla: top productos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800 text-sm">Top productos por stock</h2>
          <a href="/products" className={`text-xs ${theme.accent} hover:underline`}>
            Ver todos →
          </a>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium">Producto</th>
              <th className="text-left px-5 py-2 text-xs text-gray-500 font-medium hidden sm:table-cell">Categoría</th>
              <th className="text-right px-5 py-2 text-xs text-gray-500 font-medium">Precio</th>
              <th className="text-right px-5 py-2 text-xs text-gray-500 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {topProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{p.category}</td>
                <td className="px-5 py-3 text-right text-gray-700 font-mono">
                  ${p.price.toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right text-gray-700 font-mono">
                  {p.stock.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel de diagnóstico multi-tenant */}
      <div className="bg-slate-800 rounded-xl p-5">
        <h3 className="text-white text-sm font-semibold mb-3">
          Diagnóstico multi-tenant
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1">
            <p className="text-slate-400">Host solicitado:</p>
            <p className="text-green-400">{tenantSlug}.localhost:3000</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Rewrite interno (proxy.ts):</p>
            <p className="text-cyan-400">/{tenantSlug}/[ruta]</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Tenant ID resuelto:</p>
            <p className="text-yellow-400">{tenant.id}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Usuario en sesión:</p>
            <p className="text-yellow-400">{userName} ({userRole})</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Cookie auth:</p>
            <p className="text-green-400">tenant-session ✓</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Datos cargados:</p>
            <p className="text-green-400">
              {stats.totalUsers} usuarios · {stats.totalProducts} productos
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
