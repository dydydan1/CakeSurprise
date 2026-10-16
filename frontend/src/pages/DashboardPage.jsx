import { useCallback, useEffect, useState } from 'react'
import GreetingForm from '../features/greetings/GreetingForm.jsx'
import GreetingList from '../features/greetings/GreetingList.jsx'
import QrCodePanel from '../features/greetings/QrCodePanel.jsx'
import { occasionOptions, statusOptions } from '../features/greetings/greetingOptions.js'
import {
  createGreeting,
  generateGreetingQr,
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

function DashboardPage({ admin, onLogout }) {
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

  const loadGreetings = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await listGreetings(filters)
      setGreetings(data.greetings)
      setPagination(data.pagination)
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

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
      setErrorMessage(error.message)
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
      setErrorMessage(error.message)
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
      setErrorMessage(error.message)
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
    <main className="min-h-screen bg-[#fffaf7] text-stone-900">
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Cake QR Surprise
            </p>
            <h1 className="mt-1 text-xl font-semibold">Greeting manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <p className="hidden text-right text-sm text-stone-500 sm:block">
              {admin.displayName}
            </p>
            <button
              className="rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold hover:bg-stone-100"
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
            greeting={editingGreeting}
            isSaving={isSaving}
            onCancel={closeGreetingForm}
            onSave={handleSaveGreeting}
          />
        ) : (
          <section className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffe8e8] via-[#fff6dc] to-[#e8e3ff] p-6 text-stone-900 ring-1 ring-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="absolute -right-12 -top-16 size-44 rounded-full bg-white/50 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <p className="text-sm font-semibold text-[#b95670]">Customer greetings</p>
              <h2 className="mt-2 text-2xl font-semibold">Create a memorable cake surprise</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                Create a greeting, activate it, then download a QR code for the cake card or packaging.
              </p>
            </div>
            <button
              className="relative shrink-0 rounded-xl bg-[#b95670] px-5 py-3 font-semibold text-white shadow-lg shadow-rose-200/70 hover:bg-[#9f4860]"
              onClick={openNewGreetingForm}
              type="button"
            >
              New greeting
            </button>
          </section>
        )}

        {errorMessage && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
            {errorMessage}
          </p>
        )}

        <section className="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
          <form className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]" onSubmit={handleSearch}>
            <input
              className="rounded-xl border border-stone-300 px-4 py-2.5 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100"
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search recipient, sender, or order reference"
              value={searchInput}
            />
            <select
              className="rounded-xl border border-stone-300 bg-white px-3 py-2.5"
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
              className="rounded-xl border border-stone-300 bg-white px-3 py-2.5"
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
              className="rounded-xl bg-[#b95670] px-5 py-2.5 font-semibold text-white hover:bg-[#9f4860]"
              type="submit"
            >
              Search
            </button>
          </form>
        </section>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Saved greetings</h2>
            <p className="mt-1 text-sm text-stone-500">
              {pagination.total} {pagination.total === 1 ? 'greeting' : 'greetings'}
            </p>
          </div>
        </div>

        <GreetingList
          generatingQrId={generatingQrId}
          greetings={greetings}
          isLoading={isLoading}
          onEdit={openEditGreetingForm}
          onOpenQr={handleOpenQr}
          onStatusChange={handleStatusChange}
        />

        {pagination.totalPages > 1 && (
          <nav className="flex items-center justify-center gap-3" aria-label="Greeting pages">
            <button
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => changePage(pagination.page - 1)}
              type="button"
            >
              Previous
            </button>
            <span className="text-sm text-stone-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
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
