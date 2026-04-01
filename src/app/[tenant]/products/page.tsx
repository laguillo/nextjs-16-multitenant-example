import { notFound } from "next/navigation"
import { getTenantBySubdomain, themeConfig } from "@/lib/tenants"

// PageProps es un helper global en Next.js 16 (no requiere import)

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Activo", color: "bg-green-100 text-green-800" },
  inactive: { label: "Inactivo", color: "bg-gray-100 text-gray-600" },
  draft: { label: "Borrador", color: "bg-yellow-100 text-yellow-800" },
}

export default async function ProductsPage({ params }: PageProps<"/[tenant]/products">) {
  const { tenant: tenantSlug } = await params

  const tenant = getTenantBySubdomain(tenantSlug)
  if (!tenant) notFound()

  const theme = themeConfig[tenant.theme]

  const byCategory = tenant.products.reduce<Record<string, typeof tenant.products>>(
    (acc, p) => {
      acc[p.category] = acc[p.category] ?? []
      acc[p.category].push(p)
      return acc
    },
    {}
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {tenant.products.length} productos · {tenant.products.filter((p) => p.status === "active").length} activos
          </p>
        </div>
        <div className={`${theme.badge} text-xs font-semibold px-3 py-1 rounded-full`}>
          {tenant.name}
        </div>
      </div>

      {/* Tabla principal */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Producto
              </th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden md:table-cell">
                Categoría
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Precio
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden sm:table-cell">
                Stock
              </th>
              <th className="text-center px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenant.products.map((product) => {
              const s = statusLabels[product.status]
              return (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-gray-400 text-xs md:hidden">{product.category}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell">
                    {product.category}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-gray-700">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-gray-700 hidden sm:table-cell">
                    {product.stock.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${s.color}`}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Por categoría */}
      <div>
        <h2 className="font-semibold text-gray-700 text-sm mb-3">Por categoría</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(byCategory).map(([category, products]) => (
            <div
              key={category}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">{category}</p>
                <p className="text-gray-400 text-xs">
                  {products.filter((p) => p.status === "active").length} activos
                </p>
              </div>
              <span className={`text-lg font-bold ${theme.accent}`}>{products.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
