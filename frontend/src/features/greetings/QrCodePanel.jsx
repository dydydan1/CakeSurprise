import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { getGreetingVisual } from './occasionVisuals.js'
import { createThemedQrCard } from './qrCardRenderer.js'
import { getQrDownloadName } from './qrDownloadName.js'

function QrCodePanel({ greeting, onClose }) {
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [qrCardUrl, setQrCardUrl] = useState('')
  const [generationError, setGenerationError] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const publicUrl = `${window.location.origin}/surprise/${greeting.publicToken}`
  const visual = getGreetingVisual(greeting)

  useEffect(() => {
    let isCurrent = true

    const createQrImages = async () => {
      setGenerationError('')

      try {
        const imageUrl = await QRCode.toDataURL(publicUrl, {
          width: 720,
          margin: 4,
          errorCorrectionLevel: 'H',
          color: {
            dark: visual.ink,
            light: '#FFFFFF'
          }
        })
        const cardUrl = await createThemedQrCard({
          greeting,
          qrImageUrl: imageUrl,
          visual
        })

        if (isCurrent) {
          setQrImageUrl(imageUrl)
          setQrCardUrl(cardUrl)
        }
      } catch (_error) {
        if (isCurrent) {
          setGenerationError('The QR card could not be prepared. Please close this window and try again.')
        }
      }
    }

    createQrImages()

    return () => {
      isCurrent = false
    }
  }, [greeting, publicUrl, visual])

  const copyPublicLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setIsCopied(true)

    window.setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#4B3435]/65 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-panel-title"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-[2rem] bg-[#FFFCFA] p-6 shadow-2xl ring-1 ring-[#D49AA6]/35 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D49AA6]">
              QR message ready
            </p>
            <h2 className="mt-2 text-2xl font-semibold" id="qr-panel-title">
              QR for {greeting.recipientName}
            </h2>
          </div>
          <button
            className="rounded-lg border border-[#D49AA6]/55 px-3 py-2 text-sm font-medium hover:bg-[#F7EBDD]"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div
          className="mx-auto mt-6 max-w-56 rounded-3xl p-3 shadow-sm ring-1 ring-[#D49AA6]/35"
          style={{ backgroundColor: visual.colors[0] }}
        >
          {qrCardUrl ? (
            <img
              alt={`${visual.label} printable QR card for ${greeting.recipientName}`}
              className="aspect-[2/3] w-full rounded-2xl object-cover"
              src={qrCardUrl}
            />
          ) : (
            <div className="aspect-[2/3] animate-pulse rounded-2xl bg-white/70" />
          )}
        </div>

        <p className="mt-5 text-center text-sm leading-6 text-stone-600">
          The printable card matches the {visual.label.toLowerCase()} theme selected for this greeting.
        </p>

        {generationError && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {generationError}
          </p>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-xl border border-[#D49AA6]/50 px-4 py-3 text-sm font-semibold hover:bg-[#F7EBDD]"
            onClick={copyPublicLink}
            type="button"
          >
            {isCopied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            className="rounded-xl border border-[#D49AA6]/50 px-4 py-3 text-center text-sm font-semibold hover:bg-[#F7EBDD]"
            href={publicUrl}
            rel="noreferrer"
            target="_blank"
          >
            Preview message
          </a>
          {qrImageUrl && (
            <a
              className="rounded-xl border border-[#D49AA6]/50 px-4 py-3 text-center text-sm font-semibold hover:bg-[#F7EBDD]"
              download={getQrDownloadName(greeting, 'qr-only')}
              href={qrImageUrl}
            >
              Download QR only
            </a>
          )}
          {qrCardUrl && (
            <a
              className="rounded-xl bg-[#722F43] px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#5F2638] sm:col-span-2"
              download={getQrDownloadName(greeting, 'print-card')}
              href={qrCardUrl}
            >
              Download themed print card
            </a>
          )}
        </div>

        <p className="mt-4 break-all rounded-xl bg-[#F7EBDD]/65 px-4 py-3 text-xs text-[#4B3435]/60">
          {publicUrl}
        </p>
      </section>
    </div>
  )
}

export default QrCodePanel
