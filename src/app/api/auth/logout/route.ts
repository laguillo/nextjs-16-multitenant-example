import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ ok: true })

  // Eliminamos la cookie de sesión
  response.cookies.set("tenant-session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // Expiración inmediata
    path: "/",
  })

  return response
}
