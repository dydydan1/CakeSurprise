const sharedIconProps = {
  'aria-hidden': true,
  fill: 'none',
  focusable: 'false',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2.2,
  viewBox: '0 0 64 64'
}

const BirthdayIcon = () => (
  <svg {...sharedIconProps}>
    <path d="M16 32h32v19H16zM13 51h38M16 39h32M22 32v-8M32 32v-8M42 32v-8" />
    <path d="M22 20c-3-3 0-7 0-7s3 4 0 7ZM32 20c-3-3 0-7 0-7s3 4 0 7ZM42 20c-3-3 0-7 0-7s3 4 0 7Z" />
    <path d="M16 39c4 4 7-4 11 0s7-4 11 0 7-4 10 0" />
  </svg>
)

const MonthsaryIcon = () => (
  <svg {...sharedIconProps}>
    <rect height="38" rx="5" width="42" x="11" y="15" />
    <path d="M11 25h42M21 11v8M43 11v8" />
    <path d="M32 44s-9-5-9-11c0-5 7-6 9-1 2-5 9-4 9 1 0 6-9 11-9 11Z" />
  </svg>
)

const AnniversaryIcon = () => (
  <svg {...sharedIconProps}>
    <circle cx="25" cy="34" r="13" />
    <circle cx="39" cy="34" r="13" />
    <path d="m32 9 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
  </svg>
)

const HeartIcon = () => (
  <svg {...sharedIconProps}>
    <path d="M32 52S11 40 11 24c0-12 16-16 21-5 5-11 21-7 21 5 0 16-21 28-21 28Z" />
    <path d="M45 13c2 1 4 3 5 5" />
  </svg>
)

const GraduationIcon = () => (
  <svg {...sharedIconProps}>
    <path d="m8 25 24-12 24 12-24 12L8 25Z" />
    <path d="M18 31v11c8 7 20 7 28 0V31M56 25v17" />
    <circle cx="56" cy="46" r="2" />
  </svg>
)

const CelebrationIcon = () => (
  <svg {...sharedIconProps}>
    <path d="m32 8 3 16 13-9-8 14 16 2-16 4 10 13-14-8-2 16-4-16-13 9 8-14-16-2 16-4-10-13 14 8 3-16Z" />
  </svg>
)

const GiftIcon = () => (
  <svg {...sharedIconProps}>
    <path d="M12 27h40v26H12zM9 20h46v10H9zM32 20v33" />
    <path d="M32 20c-7 0-15-1-15-7 0-7 11-6 15 7Zm0 0c7 0 15-1 15-7 0-7-11-6-15 7Z" />
  </svg>
)

function OccasionArtwork({ icon }) {
  const icons = {
    birthday: BirthdayIcon,
    monthsary: MonthsaryIcon,
    anniversary: AnniversaryIcon,
    heart: HeartIcon,
    graduation: GraduationIcon,
    celebration: CelebrationIcon,
    gift: GiftIcon
  }
  const Icon = icons[icon] || GiftIcon

  return <Icon />
}

export default OccasionArtwork
