import { notFound } from "next/navigation"
import { getTenantBySubdomain, themeConfig } from "@/lib/tenants"

// PageProps es un helper global en Next.js 16 (no requiere import)

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-800",
  Manager: "bg-blue-100 text-blue-800",
  Viewer: "bg-gray-100 text-gray-700",
}

export default async function UsersPage({ params }: PageProps<"/[tenant]/users">) {
  const { tenant: tenantSlug } = await params

  const tenant = getTenantBySubdomain(tenantSlug)
  if (!tenant) notFound()

  const theme = themeConfig[tenant.theme]

  const byRole = tenant.users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm mt-1">
            {tenant.users.length} usuarios registrados en {tenant.name}
          </p>
        </div>
        <div className={`${theme.badge} text-xs font-semibold px-3 py-1 rounded-full`}>
          {tenant.plan}
        </div>
      </div>

      {/* Resumen por roles */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(byRole).map(([role, count]) => (
          <div key={role} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleColors[role]}`}>
              {role}
            </span>
            <p className={`text-3xl font-bold mt-2 ${theme.accent}`}>{count}</p>
          </div>
        ))}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Usuario
              </th>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden sm:table-cell">
                Email
              </th>
              <th className="text-center px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                Rol
              </th>
              <th className="text-right px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide hidden md:table-cell">
                Miembro desde
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tenant.users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar con iniciales */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${theme.primary}`}
                    >
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-gray-400 text-xs sm:hidden font-mono">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs hidden sm:table-cell">
                  {user.email}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roleColors[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-gray-500 text-xs hidden md:table-cell">
                  {new Date(user.createdAt).toLocaleDateString("es", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Nota de aislamiento */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <p className="text-amber-800 text-sm">
          <span className="font-semibold">Aislamiento de datos:</span> estos usuarios son exclusivos
          de <span className="font-mono">{tenant.subdomain}.localhost:3000</span>. Otros tenants
          tienen sus propios usuarios completamente separados.
        </p>
      </div>
    </div>
  )
}
