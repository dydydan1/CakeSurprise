import { useState } from 'react'
import BrandLockup from '../components/BrandLockup.jsx'

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await onLogin({ email, password })
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_#E6BBC4,_#F7EBDD_42%,_#FFFCFA_78%)] px-6 py-12 text-[#4B3435]">
      <div className="absolute -left-24 top-20 size-72 rounded-full bg-[#D49AA6]/25 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-20 bottom-10 size-64 rounded-full bg-[#722F43]/10 blur-3xl" aria-hidden="true" />
      <section className="relative w-full max-w-md rounded-[2rem] border border-white/80 bg-[#FFFCFA]/95 p-8 shadow-[0_28px_80px_rgba(114,47,67,0.16)] backdrop-blur sm:p-10">
        <BrandLockup showTagline />
        <p className="mt-9 text-xs font-bold uppercase tracking-[0.22em] text-[#D49AA6]">QR message studio</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#4B3435]">Welcome back</h1>
        <p className="mt-3 text-sm leading-6 text-[#4B3435]/70">
          Sign in to create personal messages and turn them into beautiful, scannable surprises.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-[#4B3435]">Email address</span>
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-[#D49AA6]/55 bg-white px-4 py-3 outline-none transition focus:border-[#722F43] focus:ring-4 focus:ring-[#D49AA6]/20"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[#4B3435]">Password</span>
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[#D49AA6]/55 bg-white px-4 py-3 outline-none transition focus:border-[#722F43] focus:ring-4 focus:ring-[#D49AA6]/20"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {errorMessage && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
              {errorMessage}
            </p>
          )}

          <button
            className="w-full rounded-xl bg-[#722F43] px-4 py-3 font-semibold text-white shadow-lg shadow-[#D49AA6]/30 transition hover:bg-[#5F2638] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
