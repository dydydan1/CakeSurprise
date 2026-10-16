import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import OccasionArtwork from '../features/greetings/OccasionArtwork.jsx'
import { getOccasionVisual } from '../features/greetings/occasionVisuals.js'
import { getPublicGreeting } from '../lib/api.js'

const getThemeStyle = (visual) => ({
  '--theme-color-one': visual.colors[0],
  '--theme-color-two': visual.colors[1],
  '--theme-color-three': visual.colors[2],
  '--theme-primary': visual.primary,
  '--theme-ink': visual.ink,
  background: `linear-gradient(145deg, ${visual.colors[0]} 0%, #ffffff 48%, ${visual.colors[2]} 100%)`
})

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
      <main className="flex min-h-[100svh] items-center justify-center bg-[#fffaf7] p-6">
        <div className="text-center">
          <div className="mx-auto size-12 animate-pulse rounded-full bg-rose-200" />
          <p className="mt-4 text-sm font-medium text-stone-500">Preparing something special…</p>
        </div>
      </main>
    )
  }

  if (isUnavailable) {
    return (
      <main className="flex min-h-[100svh] items-center justify-center bg-gradient-to-br from-rose-50 via-white to-violet-50 p-6 text-stone-900">
        <section className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-8 text-center shadow-[0_25px_80px_rgba(120,90,100,0.14)] backdrop-blur">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-rose-50 text-2xl text-rose-500">?</div>
          <h1 className="surprise-title mt-5 text-3xl">This surprise is unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            The link may have been disabled. Please ask the cake sender or bakery for help.
          </p>
        </section>
      </main>
    )
  }

  const visualKey = greeting.theme === 'elegant'
    ? greeting.occasion
    : greeting.theme
  const visual = getOccasionVisual(visualKey)

  return (
    <main
      className="surprise-page relative flex min-h-[100svh] items-center justify-center overflow-hidden p-4 text-center sm:p-8"
      style={getThemeStyle(visual)}
    >
      <div className="surprise-glow surprise-glow-one" aria-hidden="true" />
      <div className="surprise-glow surprise-glow-two" aria-hidden="true" />
      <div className="surprise-ribbon surprise-ribbon-one" aria-hidden="true" />
      <div className="surprise-ribbon surprise-ribbon-two" aria-hidden="true" />

      {!isRevealed ? (
        <section className="surprise-card surprise-intro relative w-full max-w-xl px-6 py-8 sm:px-12 sm:py-11">
          <div className="surprise-artwork surprise-gift-icon mx-auto flex size-24 items-center justify-center rounded-full sm:size-28">
            <OccasionArtwork icon={visual.icon} />
          </div>

          <p className="surprise-badge mx-auto mt-6 inline-flex rounded-full px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em]">
            {visual.label}
          </p>

          <h1 className="surprise-title mx-auto mt-6 max-w-lg text-4xl leading-[1.05] sm:text-5xl">
            {visual.introTitle(greeting.recipientName)}
          </h1>

          <div className="surprise-divider mx-auto my-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span />
            <strong>{visual.divider}</strong>
            <span />
          </div>

          <p className="mx-auto max-w-md text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
            {visual.teaser}
          </p>

          <button
            className="surprise-open-button mt-7 w-full max-w-sm rounded-full px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/80 sm:text-base"
            onClick={() => setIsRevealed(true)}
            style={{
              backgroundColor: visual.primary,
              boxShadow: `0 14px 32px ${visual.primary}42`
            }}
            type="button"
          >
            {visual.buttonLabel}
            <span className="ml-2" aria-hidden="true">→</span>
          </button>

          <p className="mt-6 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-stone-400">
            Frosted Whispers
          </p>
        </section>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {visual.particles.map((symbol, index) => (
              <span
                className="surprise-particle"
                key={`${symbol}-${index}`}
                style={{
                  '--particle-delay': `${index * 0.12}s`,
                  '--particle-left': `${10 + (index * 16)}%`,
                  color: index % 2 === 0 ? visual.primary : visual.colors[1]
                }}
              >
                {symbol}
              </span>
            ))}
          </div>

          <article
            className="surprise-card surprise-reveal relative w-full max-w-xl px-6 py-8 sm:px-12 sm:py-11"
            aria-live="polite"
          >
            <div className="surprise-artwork mx-auto flex size-20 items-center justify-center rounded-full sm:size-24">
              <OccasionArtwork icon={visual.icon} />
            </div>

            <p className="surprise-badge mx-auto mt-5 inline-flex rounded-full px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.2em]">
              {visual.label}
            </p>

            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-stone-400">
              Especially for
            </p>
            <h1 className="surprise-title mt-2 text-5xl leading-none sm:text-6xl">
              {greeting.recipientName}
            </h1>

            <div className="surprise-divider mx-auto my-6 flex items-center justify-center gap-3" aria-hidden="true">
              <span />
              <strong>{visual.divider}</strong>
              <span />
            </div>

            <p className="whitespace-pre-wrap text-lg leading-8 text-stone-700 sm:text-xl sm:leading-9">
              {greeting.message}
            </p>

            {greeting.senderName && (
              <p className="surprise-signature mt-7 text-lg text-stone-900">
                With love, {greeting.senderName}
              </p>
            )}

            <p className="mt-8 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-stone-400">
              Frosted Whispers
            </p>
          </article>
        </>
      )}
    </main>
  )
}

export default SurprisePage
