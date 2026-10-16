export const occasionOptions = [
  { value: 'birthday', label: 'Birthday' },
  { value: 'monthsary', label: 'Monthsary' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'valentines', label: "Valentine's Day" },
  { value: 'graduation', label: 'Graduation' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'other', label: 'Other' }
]

export const themeOptions = [
  { value: 'birthday', label: 'Birthday Joy' },
  { value: 'monthsary', label: 'Monthsary Sweetness' },
  { value: 'anniversary', label: 'Anniversary Elegance' },
  { value: 'romantic', label: 'Romantic' },
  { value: 'valentines', label: "Valentine's Day" },
  { value: 'graduation', label: 'Graduation Glow' },
  { value: 'elegant', label: 'Elegant' },
  { value: 'celebration', label: 'Celebration' }
]

export const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
  { value: 'archived', label: 'Archived' }
]

export const getOptionLabel = (options, value) => {
  return options.find((option) => option.value === value)?.label || value
}
