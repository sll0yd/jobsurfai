'use client'

import { JobStatus } from '@/lib/types'
import { format } from 'date-fns'

interface StatusTimelineProps {
  currentStatus: JobStatus
  dates: {
    saved?: string
    applied?: string
    interview?: string
    offer?: string
    rejected?: string
  }
  onStatusChange: (status: JobStatus) => void
}

const statusConfig = {
  saved: {
    label: 'Saved',
    color: 'bg-gray-100 text-gray-800',
    hoverColor: 'hover:bg-gray-200',
    icon: '📑',
  },
  applied: {
    label: 'Applied',
    color: 'bg-green-100 text-green-800',
    hoverColor: 'hover:bg-green-200',
    icon: '📤',
  },
  interview: {
    label: 'Interview',
    color: 'bg-blue-100 text-blue-800',
    hoverColor: 'hover:bg-blue-200',
    icon: '👥',
  },
  offer: {
    label: 'Offer',
    color: 'bg-purple-100 text-purple-800',
    hoverColor: 'hover:bg-purple-200',
    icon: '💼',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    hoverColor: 'hover:bg-red-200',
    icon: '❌',
  },
}

// Reorder statuses to show Saved at the left extremity
const statusOrder: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected']

export default function StatusTimeline({
  currentStatus,
  dates,
  onStatusChange,
}: StatusTimelineProps) {
  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{
            width: `${(statusOrder.indexOf(currentStatus) / (statusOrder.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Status Steps */}
      <div className="relative flex justify-between">
        {statusOrder.map((status, index) => {
          const config = statusConfig[status]
          const isActive = statusOrder.indexOf(currentStatus) >= index
          const date = dates[status]

          return (
            <div key={status} className="flex flex-col items-center">
              <button
                onClick={() => onStatusChange(status)}
                className={`group relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                  isActive ? config.color : 'bg-white border-2 border-gray-300'
                } ${config.hoverColor} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                title={`Change status to ${config.label}`}
              >
                <span className="text-lg transform transition-transform duration-200 group-hover:scale-110">
                  {config.icon}
                </span>
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                )}
              </button>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">{config.label}</div>
                {date && (
                  <div className="text-xs text-gray-500">
                    {format(new Date(date), 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 