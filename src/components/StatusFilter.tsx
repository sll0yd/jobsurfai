'use client'

import { JobStatus } from '@/lib/types'

interface StatusFilterProps {
  selectedStatus: JobStatus | 'all'
  onStatusChange: (status: JobStatus | 'all') => void
  counts: Record<JobStatus, number>
}

const statusConfig = {
  saved: {
    label: 'Saved',
    color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    icon: '📑',
  },
  applied: {
    label: 'Applied',
    color: 'bg-green-100 text-green-800 hover:bg-green-200',
    icon: '📤',
  },
  interview: {
    label: 'Interview',
    color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    icon: '👥',
  },
  offer: {
    label: 'Offer',
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    icon: '💼',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 hover:bg-red-200',
    icon: '❌',
  },
}

export default function StatusFilter({ selectedStatus, onStatusChange, counts }: StatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onStatusChange('all')}
        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
          selectedStatus === 'all'
            ? 'bg-indigo-100 text-indigo-800'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        All
        <span className="ml-2 text-xs bg-white px-2 py-0.5 rounded-full">
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>
      {Object.entries(statusConfig).map(([status, config]) => (
        <button
          key={status}
          onClick={() => onStatusChange(status as JobStatus)}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedStatus === status ? 'ring-2 ring-offset-2 ring-indigo-500' : ''
          } ${config.color}`}
        >
          <span className="mr-1">{config.icon}</span>
          {config.label}
          <span className="ml-2 text-xs bg-white px-2 py-0.5 rounded-full">
            {counts[status as JobStatus]}
          </span>
        </button>
      ))}
    </div>
  )
} 