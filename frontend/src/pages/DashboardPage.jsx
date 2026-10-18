import { useCallback, useEffect, useState } from 'react'
import BrandLockup from '../components/BrandLockup.jsx'
import GreetingForm from '../features/greetings/GreetingForm.jsx'
import GreetingList from '../features/greetings/GreetingList.jsx'
import QrCodePanel from '../features/greetings/QrCodePanel.jsx'
import { occasionOptions, statusOptions } from '../features/greetings/greetingOptions.js'
import {
  createGreeting,
  generateGreetingQr,
  isUnauthorizedError,
  listGreetings,
  updateGreeting
} from '../lib/api.js'

const initialFilters = {
  search: '',
  status: '',
  occasion: '',
  page: 1,
  limit: 10
}

function DashboardPage({ admin, onLogout, onSessionExpired }) {
  const canArchive = admin.role === 'owner'
  const [greetings, setGreetings] = useState([])
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0
  })
  const [filters, setFilters] = useState(initialFilters)
  const [searchInput, setSearchInput] = useState('')
  const [editingGreeting, setEditingGreeting] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [generatingQrId, setGeneratingQrId] = useState(null)
  const [qrGreeting, setQrGreeting] = useState(null)

  const handleRequestError = useCallback((error) => {
    if (isUnauthorizedError(error)) {
      onSessionExpired()
      return
    }

    setErrorMessage(error.message)
  }, [onSessionExpired])

  const loadGreetings = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await listGreetings(filters)
      setGreetings(data.greetings)
      setPagination(data.pagination)
    } catch (error) {
      handleRequestError(error)
    } finally {
      setIsLoading(false)
    }
  }, [filters, handleRequestError])

  useEffect(() => {
    loadGreetings()
  }, [loadGreetings])

  const handleSearch = (event) => {
    event.preventDefault()
    setFilters((currentFilters) => ({
      ...currentFilters,
      search: searchInput.trim(),
      page: 1
    }))
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
      page: 1
    }))
  }

  const openNewGreetingForm = () => {
    setEditingGreeting(null)
    setIsFormOpen(true)
    setErrorMessage('')
  }

  const openEditGreetingForm = (greeting) => {
    setEditingGreeting(greeting)
    setIsFormOpen(true)
    setErrorMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeGreetingForm = () => {
    setEditingGreeting(null)
    setIsFormOpen(false)
  }

  const handleSaveGreeting = async (formValues) => {
    setIsSaving(true)
    setErrorMessage('')

    try {
      if (editingGreeting) {
        await updateGreeting(editingGreeting.id, formValues)
      } else {
        await createGreeting(formValues)
      }

      closeGreetingForm()
      await loadGreetings()
    } catch (error) {
      handleRequestError(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStatusChange = async (greeting, status) => {
    setErrorMessage('')

    try {
      await updateGreeting(greeting.id, { status })
      await loadGreetings()
    } catch (error) {
      handleRequestError(error)
    }
  }

  const handleOpenQr = async (greeting) => {
    setErrorMessage('')
    setGeneratingQrId(greeting.id)

    try {
      let selectedGreeting = greeting

      if (!greeting.publicToken) {
        const data = await generateGreetingQr(greeting.id)
        selectedGreeting = data.greeting
        await loadGreetings()
      }

      setQrGreeting(selectedGreeting)
    } catch (error) {
      handleRequestError(error)
    } finally {
      setGeneratingQrId(null)
    }
  }

  const changePage = (page) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page
    }))
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#F7EBDD_0%,_#FFFCFA_28%,_#F9F1ED_100%)] text-[#4B3435]">
      <header className="border-b border-[#D49AA6]/30 bg-[#FFFCFA]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <BrandLockup showTagline />
            <h1 className="sr-only">QR message manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-right text-sm text-[#4B3435]/65 sm:block">
              {admin.displayName}
            </p>
            <button
              className="rounded-xl border border-[#D49AA6]/55 px-4 py-2 text-sm font-semibold text-[#722F43] transition hover:bg-[#F7EBDD]"
              onClick={onLogout}
              type="button"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-7 px-6 py-8 sm:py-10">
        {isFormOpen ? (
          <GreetingForm
            canArchive={canArchive}
            greeting={editingGreeting}
            isSaving={isSaving}
            onCancel={closeGreetingForm}
            onSave={handleSaveGreeting}
          />
        ) : (
          <section className="relative flex flex-col gap-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#D49AA6] via-[#E6BBC4] to-[#F7EBDD] p-6 text-[#4B3435] shadow-[0_22px_60px_rgba(114,47,67,0.12)] ring-1 ring-white/70 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="absolute -right-12 -top-16 size-44 rounded-full bg-white/45 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#722F43]">Personalized QR messages</p>
              <h2 className="mt-2 text-2xl font-semibold">Create a message worth discovering</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4B3435]/75">
                Write the message, choose an occasion theme, activate it, and generate a QR card ready to share or print.
              </p>
            </div>
            <button
              className="relative shrink-0 rounded-xl bg-[#722F43] px-5 py-3 font-semibold text-white shadow-lg shadow-[#722F43]/20 transition hover:bg-[#5F2638]"
              onClick={openNewGreetingForm}
              type="button"
            >
              New QR message
            </button>
          </section>
        )}

        {errorMessage && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

        <section className="rounded-2xl bg-[#FFFCFA] p-4 shadow-sm ring-1 ring-[#D49AA6]/30">
          <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]" onSubmit={handleSearch}>
            <input
              className="rounded-xl border border-[#D49AA6]/45 bg-white px-4 py-2.5 outline-none focus:border-[#722F43] focus:ring-4 focus:ring-[#D49AA6]/20"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search recipient or sender"
              value={searchInput}
            />
            <select
              className="rounded-xl border border-[#D49AA6]/45 bg-white px-3 py-2.5"
              name="status"
              onChange={handleFilterChange}
              value={filters.status}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <select
              className="rounded-xl border border-[#D49AA6]/45 bg-white px-3 py-2.5"
              name="occasion"
              onChange={handleFilterChange}
              value={filters.occasion}
            >
              <option value="">All occasions</option>
              {occasionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <button
              className="rounded-xl bg-[#722F43] px-5 py-2.5 font-semibold text-white transition hover:bg-[#5F2638]"
              type="submit"
            >
              Search
            </button>
          </form>
        </section>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">QR messages</h2>
            <p className="mt-1 text-sm text-[#4B3435]/60">
              {pagination.total} {pagination.total === 1 ? 'message' : 'messages'}
            </p>
          </div>
        </div>

        <GreetingList
          canArchive={canArchive}
          generatingQrId={generatingQrId}
          greetings={greetings}
          isLoading={isLoading}
          onEdit={openEditGreetingForm}
          onOpenQr={handleOpenQr}
          onStatusChange={handleStatusChange}
        />

        {pagination.totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3" aria-label="QR message pages">
            <button
              className="rounded-lg border border-[#D49AA6]/50 px-4 py-2 text-sm font-medium hover:bg-[#F7EBDD] disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => changePage(pagination.page - 1)}
              type="button"
            >
              Previous
            </button>
            <span className="text-sm text-[#4B3435]/60">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="rounded-lg border border-[#D49AA6]/50 px-4 py-2 text-sm font-medium hover:bg-[#F7EBDD] disabled:opacity-40"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => changePage(pagination.page + 1)}
              type="button"
            >
              Next
            </button>
          </nav>
        )}
      </div>

      {qrGreeting && (
        <QrCodePanel
          greeting={qrGreeting}
          onClose={() => setQrGreeting(null)}
        />
      )}
    </main>
  )
}

export default DashboardPage
