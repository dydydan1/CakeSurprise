import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicGreeting } from '../lib/api.js'

const themeStyles = {
  birthday: {
    background: 'from-amber-100 via-rose-50 to-sky-100',
    accent: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    symbol: '🎂',
    label: 'A birthday surprise'
  },
  romantic: {
    background: 'from-rose-200 via-pink-50 to-red-100',
    accent: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    symbol: '♥',
    label: 'Sent with love'
  },
  elegant: {
    background: 'from-stone-200 via-white to-amber-100',
    accent: 'text-amber-700',
    badge: 'bg-amber-100 text-amber-800',
    symbol: '✦',
    label: 'A special message'
  },
  celebration: {
    background: 'from-violet-200 via-fuchsia-50 to-cyan-100',
    accent: 'text-violet-700',
    badge: 'bg-violet-100 text-violet-700',
    symbol: '★',
    label: 'Time to celebrate'
  }
}

function SurprisePage() {
  const { token } = useParams()
  const [greeting, setGreeting] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUnavailable, setIsUnavailable] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const loadGreeting = async () => {
      try {
        const data = await getPublicGreeting(token)
        setGreeting(data.greeting)
      } catch (_error) {
        setIsUnavailable(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadGreeting()
  }, [token])

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 p-6">
        <p className="animate-pulse text-sm font-medium text-stone-500">Opening your surprise…</p>
      </main>
    )
  }

  if (isUnavailable) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-100 p-6 text-stone-900">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-stone-200">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-stone-100 text-2xl">?</div>
          <h1 className="mt-5 text-2xl font-semibold">This surprise is unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            The link may have been disabled. Please ask the cake sender or bakery for help.
          </p>
        </section>
      </main>
    )
  }

  const theme = themeStyles[greeting.theme] || themeStyles.celebration
  const particleSymbols = greeting.theme === 'romantic'
    ? ['♥', '♡', '♥', '♡', '♥', '♡']
    : ['✦', '★', '✧', '★', '✦', '✧']

  return (
    <main className={`relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br ${theme.background} p-5 sm:p-8`}>
      <div className="absolute -left-16 top-12 size-48 rounded-full bg-white/40 blur-3xl" />
      <div className="absolute -right-12 bottom-10 size-56 rounded-full bg-white/50 blur-3xl" />

      {!isRevealed ? (
        <section className="surprise-intro relative w-full max-w-xl rounded-[2rem] bg-white/90 p-8 text-center shadow-2xl ring-1 ring-white/70 backdrop-blur sm:p-12">
          <div className={`surprise-gift-icon mx-auto flex size-24 items-center justify-center rounded-full bg-white text-5xl shadow-lg ${theme.accent}`}>
            {theme.symbol}
          </div>
          <p className={`mx-auto mt-7 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${theme.badge}`}>
            A cake surprise has arrived
          </p>
          <h1 className="mt-7 text-3xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            {greeting.recipientName}, something sweet is waiting
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-7 text-stone-600">
            This message was prepared especially for you. Open it whenever you’re ready.
          </p>
          <button
            className="surprise-open-button mt-8 rounded-full bg-stone-900 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-white/80"
            onClick={() => setIsRevealed(true)}
            type="button"
          >
            Open my surprise
          </button>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
            Cake QR Surprise
          </p>
        </section>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {particleSymbols.map((symbol, index) => (
              <span
                className={`surprise-particle ${theme.accent}`}
                key={`${symbol}-${index}`}
                style={{
                  '--particle-delay': `${index * 0.12}s`,
                  '--particle-left': `${12 + (index * 15)}%`
                }}
              >
                {symbol}
              </span>
            ))}
          </div>

          <article
            className="surprise-reveal relative w-full max-w-xl rounded-[2rem] bg-white/90 p-7 text-center shadow-2xl ring-1 ring-white/70 backdrop-blur sm:p-12"
            aria-live="polite"
          >
            <div className={`mx-auto flex size-20 items-center justify-center rounded-full bg-white text-4xl shadow-lg ${theme.accent}`}>
              {theme.symbol}
            </div>
            <p className={`mx-auto mt-6 inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] ${theme.badge}`}>
              {theme.label}
            </p>

            <p className="mt-8 text-sm font-medium text-stone-500">Especially for</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              {greeting.recipientName}
            </h1>

            <div className="mx-auto my-8 h-px w-20 bg-stone-300" />

            <p className="whitespace-pre-wrap text-lg leading-8 text-stone-700 sm:text-xl sm:leading-9">
              {greeting.message}
            </p>

            {greeting.senderName && (
              <p className="mt-8 text-base font-semibold text-stone-900">
                With love, {greeting.senderName}
              </p>
            )}

            <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
              Cake QR Surprise
            </p>
          </article>
        </>
      )}
    </main>
  )
}

export default SurprisePage
