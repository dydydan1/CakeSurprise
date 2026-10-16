function DashboardPage({ admin, onLogout }) {
  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Cake QR Surprise
            </p>
            <h1 className="mt-1 text-xl font-semibold">Admin dashboard</h1>
          </div>
          <button
            className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold transition hover:bg-stone-100"
            onClick={onLogout}
            type="button"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p className="text-sm font-medium text-stone-500">Signed in as</p>
          <h2 className="mt-2 text-2xl font-semibold">{admin.displayName}</h2>
          <p className="mt-1 text-stone-600">{admin.email}</p>
          <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Secure admin authentication is working. Greeting management comes next.
          </p>
        </div>
      </section>
    </main>
  )
}

export default DashboardPage
