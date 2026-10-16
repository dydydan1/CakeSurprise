import { useEffect, useState } from 'react'
import {
  occasionOptions,
  statusOptions,
  themeOptions
} from './greetingOptions.js'
import {
  getOccasionVisual,
  occasionThemeDefaults
} from './occasionVisuals.js'

const emptyGreeting = {
  recipientName: '',
  senderName: '',
  message: '',
  occasion: 'birthday',
  theme: 'birthday',
  status: 'draft',
  orderReference: ''
}

function GreetingForm({ greeting, isSaving, onCancel, onSave }) {
  const [formValues, setFormValues] = useState(emptyGreeting)

  useEffect(() => {
    if (!greeting) {
      setFormValues(emptyGreeting)
      return
    }

    setFormValues({
      recipientName: greeting.recipientName,
      senderName: greeting.senderName || '',
      message: greeting.message,
      occasion: greeting.occasion,
      theme: greeting.theme,
      status: greeting.status,
      orderReference: greeting.orderReference || ''
    })
  }, [greeting])

  const updateField = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
      ...(name === 'occasion' ? { theme: occasionThemeDefaults[value] } : {})
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(formValues)
  }

  const inputClassName = 'mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100'
  const occasionVisual = getOccasionVisual(formValues.occasion)

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">
            {greeting ? 'Edit greeting' : 'New greeting'}
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {greeting ? `For ${greeting.recipientName}` : 'Create a customer greeting'}
          </h2>
        </div>

        <div
          className="flex flex-col gap-4 rounded-2xl border border-white/80 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          style={{
            background: `linear-gradient(120deg, ${occasionVisual.colors[0]}, ${occasionVisual.colors[2]})`
          }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              Recipient palette
            </p>
            <p className="mt-1 font-semibold text-stone-800">{occasionVisual.label}</p>
          </div>
          <div className="flex gap-2" aria-label={`${occasionVisual.label} color palette`}>
            {occasionVisual.colors.map((color) => (
              <span
                className="size-9 rounded-full border-2 border-white shadow-sm"
                key={color}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <button
          className="rounded-lg px-3 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100"
          onClick={onCancel}
          type="button"
        >
          Close
        </button>
      </div>

      <form className="mt-7 space-y-6" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">Recipient name *</span>
            <input
              className={inputClassName}
              maxLength="100"
              name="recipientName"
              onChange={updateField}
              required
              value={formValues.recipientName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Sender name</span>
            <input
              className={inputClassName}
              maxLength="100"
              name="senderName"
              onChange={updateField}
              value={formValues.senderName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Occasion *</span>
            <select
              className={inputClassName}
              name="occasion"
              onChange={updateField}
              value={formValues.occasion}
            >
              {occasionOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Theme *</span>
            <select
              className={inputClassName}
              name="theme"
              onChange={updateField}
              value={formValues.theme}
            >
              {themeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Status *</span>
            <select
              className={inputClassName}
              name="status"
              onChange={updateField}
              value={formValues.status}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-stone-700">Order reference</span>
            <input
              className={inputClassName}
              maxLength="80"
              name="orderReference"
              onChange={updateField}
              placeholder="e.g. ORDER-1042"
              value={formValues.orderReference}
            />
          </label>
        </div>

        <label className="block">
          <span className="flex items-center justify-between gap-4 text-sm font-medium text-stone-700">
            <span>Greeting message *</span>
            <span className="font-normal text-stone-400">{formValues.message.length}/1000</span>
          </span>
          <textarea
            className={`${inputClassName} min-h-36 resize-y`}
            maxLength="1000"
            name="message"
            onChange={updateField}
            required
            value={formValues.message}
          />
        </label>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl border border-stone-300 px-5 py-3 font-semibold text-stone-700 hover:bg-stone-50"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-xl bg-[#b95670] px-5 py-3 font-semibold text-white hover:bg-[#9f4860] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? 'Saving…' : greeting ? 'Save changes' : 'Create greeting'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default GreetingForm
