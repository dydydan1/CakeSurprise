const occasionVisuals = {
  birthday: {
    label: 'Birthday joy',
    introTitle: (name) => `A sweet surprise for ${name}`,
    teaser: 'Today is a little brighter because of you. A special message is waiting inside.',
    buttonLabel: 'Open my birthday surprise',
    icon: 'birthday',
    colors: ['#FFF4C7', '#FF8B8B', '#BDE7F6'],
    primary: '#D95F6A',
    ink: '#3F2B2A',
    closing: 'With warmest wishes,',
    particles: ['✦', '•', '✧', '•', '★', '✦'],
    divider: '✦'
  },
  monthsary: {
    label: 'Happy monthsary',
    introTitle: (name) => `${name}, another beautiful month of us`,
    teaser: 'A small surprise for another month of memories, laughter, and love.',
    buttonLabel: 'Open our little love story',
    icon: 'monthsary',
    colors: ['#F9DCE5', '#DDD2F5', '#FFF7E8'],
    primary: '#8B6FB5',
    ink: '#3F324B',
    closing: 'With all my love,',
    particles: ['♡', '✦', '♥', '✧', '♡', '✦'],
    divider: '♡'
  },
  anniversary: {
    label: 'Happy anniversary',
    introTitle: (name) => `${name}, another beautiful chapter`,
    teaser: 'A timeless message for everything you have shared and everything still ahead.',
    buttonLabel: 'Open our anniversary message',
    icon: 'anniversary',
    colors: ['#F3E4C3', '#C98D96', '#DCE8DA'],
    primary: '#9B5C66',
    ink: '#463331',
    closing: 'With all my love,',
    particles: ['✦', '♡', '✧', '♡', '✦', '✧'],
    divider: '∞'
  },
  romantic: {
    label: 'A message from the heart',
    introTitle: (name) => `${name}, something heartfelt is waiting`,
    teaser: 'Some feelings deserve more than ordinary words. This one was made just for you.',
    buttonLabel: 'Open my love message',
    icon: 'heart',
    colors: ['#FCE2E7', '#B76E79', '#F4E5C2'],
    primary: '#9C5362',
    ink: '#482E34',
    closing: 'With love,',
    particles: ['♥', '♡', '♥', '♡', '✦', '♡'],
    divider: '♡'
  },
  valentines: {
    label: "Valentine's surprise",
    introTitle: (name) => `${name}, you are someone’s favorite`,
    teaser: 'A little love, a sweet surprise, and a message chosen especially for you.',
    buttonLabel: 'Open my Valentine',
    icon: 'heart',
    colors: ['#FFE4E8', '#E9707B', '#FFD8C7'],
    primary: '#B94653',
    ink: '#492B31',
    closing: 'Yours, with love,',
    particles: ['♥', '♡', '♥', '✦', '♡', '♥'],
    divider: '♡'
  },
  graduation: {
    label: 'Graduation glow',
    introTitle: (name) => `${name}, your moment has arrived`,
    teaser: 'All your hard work and bright dreams led to this. A special message is waiting.',
    buttonLabel: 'Open my graduation message',
    icon: 'graduation',
    colors: ['#E9E0FF', '#CDEFE2', '#E8C66A'],
    primary: '#7863AD',
    ink: '#342F47',
    closing: 'Cheering you on,',
    particles: ['★', '✦', '✧', '★', '✦', '✧'],
    divider: '★'
  },
  celebration: {
    label: 'Time to celebrate',
    introTitle: (name) => `${name}, this beautiful moment is yours`,
    teaser: 'A joyful surprise is ready to make this celebration even more memorable.',
    buttonLabel: 'Open my celebration',
    icon: 'celebration',
    colors: ['#FFE1D6', '#CDECF0', '#E3D9FA'],
    primary: '#B65E7A',
    ink: '#3D3040',
    closing: 'With joyful wishes,',
    particles: ['✦', '★', '✧', '•', '★', '✦'],
    divider: '✦'
  },
  other: {
    label: 'A special message',
    introTitle: (name) => `${name}, something meaningful is waiting`,
    teaser: 'A thoughtful surprise was prepared especially for this moment.',
    buttonLabel: 'Open my surprise',
    icon: 'gift',
    colors: ['#EEF2FF', '#E8E2F3', '#F7E7D3'],
    primary: '#75658F',
    ink: '#383342',
    closing: 'Made especially for you,',
    particles: ['✦', '✧', '•', '✦', '✧', '★'],
    divider: '✦'
  }
}

export const getOccasionVisual = (occasion) => {
  return occasionVisuals[occasion] || occasionVisuals.other
}

export const getGreetingVisual = (greeting) => {
  const visualKey = greeting?.theme === 'elegant'
    ? greeting?.occasion
    : greeting?.theme

  return getOccasionVisual(visualKey)
}

export const occasionThemeDefaults = {
  birthday: 'birthday',
  monthsary: 'monthsary',
  anniversary: 'anniversary',
  romantic: 'romantic',
  valentines: 'valentines',
  graduation: 'graduation',
  celebration: 'celebration',
  other: 'elegant'
}
