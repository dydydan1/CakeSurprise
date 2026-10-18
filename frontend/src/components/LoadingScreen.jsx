function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F7EBDD] px-6">
      <div className="text-center">
        <div className="mx-auto size-10 animate-pulse rounded-full bg-[#D49AA6] shadow-[0_0_0_10px_rgba(212,154,166,0.16)]" />
        <p className="mt-5 text-sm font-medium text-[#4B3435]/70">Preparing your message studio…</p>
      </div>
    </main>
  )
}

export default LoadingScreen
