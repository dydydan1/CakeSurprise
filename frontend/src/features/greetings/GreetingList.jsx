import {
  getOptionLabel,
  occasionOptions,
  statusOptions,
  themeOptions
} from './greetingOptions.js'
import { toPlainMessagePreview } from './messageFormatting.js'

const statusStyles = {
  draft: 'bg-stone-100 text-stone-700',
  active: 'bg-emerald-100 text-emerald-700',
  disabled: 'bg-amber-100 text-amber-700',
  archived: 'bg-slate-200 text-slate-600'
}

const formatDate = (value) => {
  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'medium'
  }).format(new Date(value))
}

function GreetingList({
  canArchive,
  generatingQrId,
  greetings,
  isLoading,
  onEdit,
  onOpenQr,
  onStatusChange
}) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-[#FFFCFA] p-10 text-center text-[#4B3435]/60 ring-1 ring-[#D49AA6]/30">
        Loading QR messages…
      </div>
    )
  }

  if (greetings.length === 0) {
    return (
      <div className="rounded-3xl bg-[#FFFCFA] p-10 text-center ring-1 ring-[#D49AA6]/30">
        <h2 className="text-xl font-semibold">No QR messages found</h2>
        <p className="mt-2 text-sm text-[#4B3435]/60">Create a message or adjust your filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {greetings.map((greeting) => (
        <article
          className="rounded-2xl bg-[#FFFCFA] p-5 shadow-sm ring-1 ring-[#D49AA6]/30 sm:p-6"
          key={greeting.id}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold">{greeting.recipientName}</h2>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[greeting.status]}`}>
                  {getOptionLabel(statusOptions, greeting.status)}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
                {toPlainMessagePreview(greeting.message)}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
                <span>{getOptionLabel(occasionOptions, greeting.occasion)}</span>
                <span>{getOptionLabel(themeOptions, greeting.theme)} theme</span>
                {greeting.senderName && <span>From {greeting.senderName}</span>}
                <span>Created {formatDate(greeting.createdAt)}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              {greeting.status === 'active' && (
                <button
                  className="rounded-lg bg-[#722F43] px-3 py-2 text-sm font-semibold text-white hover:bg-[#5F2638] disabled:cursor-wait disabled:opacity-60"
                  disabled={generatingQrId === greeting.id}
                  onClick={() => onOpenQr(greeting)}
                  type="button"
                >
                  {generatingQrId === greeting.id
                    ? 'Preparing…'
                    : greeting.publicToken ? 'View QR' : 'Generate QR'}
                </button>
              )}

              <button
                className="rounded-lg border border-[#D49AA6]/50 px-3 py-2 text-sm font-medium hover:bg-[#F7EBDD]"
                onClick={() => onEdit(greeting)}
                type="button"
              >
                Edit
              </button>

              {greeting.status !== 'archived' && (
                <button
                  className="rounded-lg border border-[#D49AA6]/50 px-3 py-2 text-sm font-medium hover:bg-[#F7EBDD]"
                  onClick={() => onStatusChange(
                    greeting,
                    greeting.status === 'disabled' ? 'active' : 'disabled'
                  )}
                  type="button"
                >
                  {greeting.status === 'disabled' ? 'Activate' : 'Disable'}
                </button>
              )}

              {canArchive && (
                <button
                  className="rounded-lg border border-[#D49AA6]/50 px-3 py-2 text-sm font-medium hover:bg-[#F7EBDD]"
                  onClick={() => onStatusChange(
                    greeting,
                    greeting.status === 'archived' ? 'draft' : 'archived'
                  )}
                  type="button"
                >
                  {greeting.status === 'archived' ? 'Restore' : 'Archive'}
                </button>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default GreetingList
