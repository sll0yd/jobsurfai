export const colors = {
  primary: {
    100: 'bg-indigo-100',
    200: 'bg-indigo-200',
    800: 'text-indigo-800'
  },
  secondary: {
    100: 'bg-purple-100',
    200: 'bg-purple-200',
    800: 'text-purple-800'
  },
  success: {
    100: 'bg-green-100',
    200: 'bg-green-200',
    800: 'text-green-800'
  },
  warning: {
    100: 'bg-yellow-100',
    200: 'bg-yellow-200',
    800: 'text-yellow-800'
  },
  error: {
    100: 'bg-red-100',
    200: 'bg-red-200',
    800: 'text-red-800'
  },
  gray: {
    100: 'bg-gray-100',
    200: 'bg-gray-200',
    800: 'text-gray-800'
  }
} as const

export type ColorKey = keyof typeof colors
export type ColorShade = keyof typeof colors[ColorKey]

export const statusColors = {
  saved: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200',
  },
  applied: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200',
  },
  interview: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200',
  },
  offer: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200',
  },
  rejected: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-200',
  },
} 