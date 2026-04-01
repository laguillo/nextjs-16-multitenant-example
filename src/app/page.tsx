import { tenants } from "@/lib/tenants";

const planColors: Record<string, string> = {
  Starter: "bg-gray-100 text-gray-700",
  Pro: "bg-blue-100 text-blue-700",
  Enterprise: "bg-purple-100 text-purple-700",
};

const themeHero: Record<string, string> = {
  blue: "from-blue-600 to-blue-800",
  green: "from-emerald-600 to-emerald-800",
  orange: "from-orange-500 to-orange-700",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              MT
            </div>
            <span className="text-white font-semibold text-lg">
              MultiTenant Demo
            </span>
            <span className="text-slate-400 text-sm hidden sm:block">
              — Next.js 16
            </span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-700 px-3 py-1 rounded-full font-mono">
            v16.2.2
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Arquitectura{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              Multi-Tenant
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-6">
            Demo con subdominios,{" "}
            <code className="text-cyan-400 bg-slate-800 px-1 rounded">
              proxy.ts
            </code>{" "}
            (antes middleware), auth simulada y datos por tenant — todo sin base
            de datos.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-slate-300 text-sm font-mono">
              tenant<span className="text-cyan-400">{"{1|2|3}"}</span>
              .localhost:3000
            </span>
          </div>
        </div>

        {/* Tenant Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition-colors"
            >
              {/* Card header con gradiente del tema */}
              <div
                className={`bg-linear-to-r ${themeHero[tenant.theme]} px-5 py-4`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{tenant.logo}</span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${planColors[tenant.plan]} `}
                  >
                    {tenant.plan}
                  </span>
                </div>
                <h2 className="text-white font-bold text-xl mt-2">
                  {tenant.name}
                </h2>
                <p className="text-white/70 text-sm">{tenant.industry}</p>
              </div>

              {/* Stats */}
              <div className="px-5 py-4 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {tenant.users.length}
                  </p>
                  <p className="text-slate-400 text-xs">Usuarios</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {tenant.products.length}
                  </p>
                  <p className="text-slate-400 text-xs">Productos</p>
                </div>
              </div>

              {/* Usuarios del tenant */}
              <div className="px-5 pb-4">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                  Credenciales de prueba
                </p>
                <div className="space-y-1">
                  {tenant.users.slice(0, 2).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-slate-300 text-xs font-mono truncate">
                        {user.email}
                      </span>
                      <span className="text-slate-500 text-xs ml-2 shrink-0">
                        {user.role}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 text-xs mt-2 font-mono">
                  pass: <span className="text-slate-400">{tenant.id}123</span>
                </p>
              </div>

              {/* CTA */}
              <div className="px-5 pb-5">
                <a
                  href={`http://${tenant.subdomain}.localhost:3000`}
                  className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                >
                  Abrir tenant →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Arquitectura */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
          <h3 className="text-white font-semibold text-lg mb-6">
            ¿Cómo funciona?
          </h3>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-cyan-400 font-mono text-xs mb-2 uppercase tracking-wide">
                1. proxy.ts
              </div>
              <p className="text-slate-300">
                Intercepta cada request, extrae el subdominio del host y hace un{" "}
                <span className="text-cyan-400">rewrite interno</span>{" "}
                transparente a{" "}
                <code className="text-slate-200 bg-slate-700 px-1 rounded">
                  /[tenant]/ruta
                </code>
                .
              </p>
            </div>
            <div>
              <div className="text-emerald-400 font-mono text-xs mb-2 uppercase tracking-wide">
                2. Auth guard
              </div>
              <p className="text-slate-300">
                El mismo proxy verifica la cookie{" "}
                <code className="text-slate-200 bg-slate-700 px-1 rounded">
                  tenant-session
                </code>
                . Sin sesión → redirect a{" "}
                <code className="text-slate-200 bg-slate-700 px-1 rounded">
                  /login
                </code>
                .
              </p>
            </div>
            <div>
              <div className="text-orange-400 font-mono text-xs mb-2 uppercase tracking-wide">
                3. Datos aislados
              </div>
              <p className="text-slate-300">
                Cada página lee el tenant desde{" "}
                <code className="text-slate-200 bg-slate-700 px-1 rounded">
                  params
                </code>{" "}
                (inyectado por el rewrite) y filtra los datos correspondientes.
              </p>
            </div>
          </div>

          {/* Setup instrucciones */}
          <div className="mt-8 border-t border-slate-700 pt-6">
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">
              Configuración rápida — agregar a{" "}
              <code className="text-slate-300">/etc/hosts</code>
            </p>
            <pre className="bg-slate-900 rounded-lg p-4 text-xs font-mono text-green-400 overflow-x-auto">
              {`127.0.0.1  tenant1.localhost
127.0.0.1  tenant2.localhost
127.0.0.1  tenant3.localhost`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
