"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import type { TenantTheme } from "@/lib/tenants"
import { themeConfig } from "@/lib/tenants"

interface LoginFormProps {
  tenantSubdomain: string
  tenantName: string
  tenantLogo: string
  tenantTheme: TenantTheme
  // Muestra de credenciales para la demo
  sampleCredentials: Array<{ email: string; role: string }>
  samplePassword: string
}

export default function LoginForm({
  tenantSubdomain,
  tenantName,
  tenantLogo,
  tenantTheme,
  sampleCredentials,
  samplePassword,
}: LoginFormProps) {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") ?? "/"
  const theme = themeConfig[tenantTheme]

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  function fillCredentials(sampleEmail: string) {
    setEmail(sampleEmail)
    setPassword(samplePassword)
    setError("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenant: tenantSubdomain, email, password }),
      })

      if (res.ok) {
        // Recargamos hacia la ruta original (o /)
        window.location.href = from === "/login" ? "/" : from
      } else {
        const data = await res.json()
        setError(data.error ?? "Credenciales incorrectas")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header con color del tenant */}
          <div className={`${theme.navBg} px-6 py-8 text-center`}>
            <div className="text-5xl mb-3">{tenantLogo}</div>
            <h1 className="text-white text-xl font-bold">{tenantName}</h1>
            <p className="text-white/70 text-sm mt-1">Inicia sesión para continuar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="usuario@empresa.com"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${theme.ring} transition`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ${theme.ring} transition`}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`w-full ${theme.primary} ${theme.primaryHover} text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-60 text-sm`}
            >
              {isPending ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>

        {/* Credenciales de demo */}
        <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-semibold">
            Credenciales de prueba
          </p>
          <div className="space-y-2">
            {sampleCredentials.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillCredentials(cred.email)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors group"
              >
                <div>
                  <p className="text-xs font-mono text-gray-700">{cred.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">pass: {samplePassword}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${theme.badge}`}>
                    {cred.role}
                  </span>
                  <span className="text-gray-300 group-hover:text-gray-500 text-xs">↑</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          <a href="http://localhost:3000" className="hover:text-gray-600 underline">
            ← Volver al inicio
          </a>
        </p>
      </div>
    </div>
  )
}
