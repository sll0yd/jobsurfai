'use client'

import { JobStatus } from '@/lib/types'
import { format } from 'date-fns'
import { colors } from '@/lib/design-system'

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
    color: colors.gray[100],
    textColor: colors.gray[800],
    hoverColor: colors.gray[200],
    icon: '📑',
  },
  applied: {
    label: 'Applied',
    color: colors.success[100],
    textColor: colors.success[800],
    hoverColor: colors.success[200],
    icon: '📤',
  },
  interview: {
    label: 'Interview',
    color: colors.secondary[100],
    textColor: colors.secondary[800],
    hoverColor: colors.secondary[200],
    icon: '👥',
  },
  offer: {
    label: 'Offer',
    color: colors.primary[100],
    textColor: colors.primary[800],
    hoverColor: colors.primary[200],
    icon: '💼',
  },
  rejected: {
    label: 'Rejected',
    color: colors.error[100],
    textColor: colors.error[800],
    hoverColor: colors.error[200],
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
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-in-out"
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
                className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `bg-[${config.color}] text-[${config.textColor}] shadow-md`
                    : 'bg-white border-2 border-gray-300'
                } hover:bg-[${config.hoverColor}] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                title={`Change status to ${config.label}`}
              >
                <span className="text-xl transform transition-transform duration-300 group-hover:scale-110">
                  {config.icon}
                </span>
                {isActive && (
                  <span className="absolute -inset-1 rounded-full bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
              <div className="mt-3 text-center">
                <div className="text-sm font-medium text-gray-900">{config.label}</div>
                {date && (
                  <div className="text-xs text-gray-500 mt-1">
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