import { NextResponse } from "next/server"
import { validateLogin } from "@/lib/tenants"

export async function POST(request: Request) {
  const body = await request.json()
  const { tenant, email, password } = body

  if (!tenant || !email || !password) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
  }

  const user = validateLogin(tenant, email, password)

  if (!user) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos" },
      { status: 401 }
    )
  }

  // Creamos el payload de sesión (en producción usarías JWT firmado)
  const sessionPayload = JSON.stringify({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    tenant,
    iat: Date.now(),
  })

  const response = NextResponse.json({ ok: true, user: { name: user.name, role: user.role } })

  // Seteamos la cookie de sesión
  response.cookies.set("tenant-session", sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })

  return response
}
