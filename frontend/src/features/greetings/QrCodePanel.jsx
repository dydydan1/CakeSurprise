import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const getDownloadName = (recipientName) => {
  const safeName = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `cake-surprise-${safeName || 'greeting'}.png`
}

function QrCodePanel({ greeting, onClose }) {
  const [qrImageUrl, setQrImageUrl] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const publicUrl = `${window.location.origin}/surprise/${greeting.publicToken}`

  useEffect(() => {
    let isCurrent = true

    const createQrImage = async () => {
      const imageUrl = await QRCode.toDataURL(publicUrl, {
        width: 640,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#1c1917',
          light: '#ffffff'
        }
      })

      if (isCurrent) {
        setQrImageUrl(imageUrl)
      }
    }

    createQrImage()

    return () => {
      isCurrent = false
    }
  }, [publicUrl])

  const copyPublicLink = async () => {
    await navigator.clipboard.writeText(publicUrl)
    setIsCopied(true)

    window.setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-panel-title"
    >
      <section className="max-h-[calc(100vh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Ready to print
            </p>
            <h2 className="mt-2 text-2xl font-semibold" id="qr-panel-title">
              QR for {greeting.recipientName}
            </h2>
          </div>
          <button
            className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-medium hover:bg-stone-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-72 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
          {qrImageUrl ? (
            <img
              alt={`QR code for ${greeting.recipientName}'s cake surprise`}
              className="aspect-square w-full"
              src={qrImageUrl}
            />
          ) : (
            <div className="aspect-square animate-pulse rounded-2xl bg-stone-100" />
          )}
        </div>

        <p className="mt-5 text-center text-sm leading-6 text-stone-600">
          Place this code on the cake card or packaging. Scanning it opens the recipient’s surprise message.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            className="rounded-xl border border-stone-300 px-4 py-3 text-sm font-semibold hover:bg-stone-50"
            onClick={copyPublicLink}
            type="button"
          >
            {isCopied ? 'Link copied' : 'Copy link'}
          </button>
          <a
            className="rounded-xl border border-stone-300 px-4 py-3 text-center text-sm font-semibold hover:bg-stone-50"
            href={publicUrl}
            rel="noreferrer"
            target="_blank"
          >
            Preview surprise
          </a>
          <a
            className="rounded-xl bg-rose-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-rose-400 sm:col-span-2"
            download={getDownloadName(greeting.recipientName)}
            href={qrImageUrl}
          >
            Download QR image
          </a>
        </div>

        <p className="mt-4 break-all rounded-xl bg-stone-50 px-4 py-3 text-xs text-stone-500">
          {publicUrl}
        </p>
      </section>
    </div>
  )
}

export default QrCodePanel
