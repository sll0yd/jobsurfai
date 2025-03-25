import type { JobStatus } from '@/lib/types'
import {
  BookmarkIcon,
  CheckCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline'

interface JobStatusProps {
  status: JobStatus
  onClick?: () => void
  interactive?: boolean
}

const statusConfig = {
  saved: {
    icon: BookmarkIcon,
    label: 'Saved',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  },
  applied: {
    icon: CheckCircleIcon,
    label: 'Applied',
    className: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  interview: {
    icon: CalendarIcon,
    label: 'Interview',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
  offer: {
    icon: CurrencyDollarIcon,
    label: 'Offer',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  },
  rejected: {
    icon: XCircleIcon,
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
}

export default function JobStatus({ status, onClick, interactive = false }: JobStatusProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200'
  const interactiveClasses = interactive ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2' : ''
  const statusClasses = `${baseClasses} ${config.className} ${interactiveClasses}`

  const content = (
    <>
      <Icon className="h-3.5 w-3.5 mr-1" />
      {config.label}
    </>
  )

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={statusClasses}
        aria-label={`Change status to ${config.label}`}
      >
        {content}
      </button>
    )
  }

  return <span className={statusClasses}>{content}</span>
} 