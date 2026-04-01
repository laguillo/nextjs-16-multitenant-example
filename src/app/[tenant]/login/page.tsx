import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getTenantBySubdomain } from "@/lib/tenants"
import LoginForm from "@/components/LoginForm"

// La página de login no usa el layout del tenant (no requiere auth)
// pero sí recibe el tenant desde params (inyectado por proxy.ts)
// PageProps es un helper global en Next.js 16 (no requiere import)
export default async function LoginPage({ params }: PageProps<"/[tenant]/login">) {
  const { tenant: tenantSlug } = await params

  const tenant = getTenantBySubdomain(tenantSlug)
  if (!tenant) notFound()

  const sampleCredentials = tenant.users.map((u) => ({
    email: u.email,
    role: u.role,
  }))

  return (
    <Suspense>
      <LoginForm
        tenantSubdomain={tenant.subdomain}
        tenantName={tenant.name}
        tenantLogo={tenant.logo}
        tenantTheme={tenant.theme}
        sampleCredentials={sampleCredentials}
        samplePassword={`${tenant.subdomain}123`}
      />
    </Suspense>
  )
}
