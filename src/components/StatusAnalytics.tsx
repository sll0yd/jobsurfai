'use client'

import { JobStatus } from '@/lib/types'

interface StatusAnalyticsProps {
  jobs: Array<{ status: JobStatus }>
}

const statusConfig = {
  saved: {
    label: 'Saved',
    color: 'bg-gray-100 text-gray-800',
    icon: '📑',
  },
  applied: {
    label: 'Applied',
    color: 'bg-green-100 text-green-800',
    icon: '📤',
  },
  interview: {
    label: 'Interview',
    color: 'bg-blue-100 text-blue-800',
    icon: '👥',
  },
  offer: {
    label: 'Offer',
    color: 'bg-purple-100 text-purple-800',
    icon: '💼',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: '❌',
  },
}

const statusOrder: JobStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected']

export default function StatusAnalytics({ jobs }: StatusAnalyticsProps) {
  const counts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<JobStatus, number>)

  const total = jobs.length

  const calculateConversionRate = (from: JobStatus, to: JobStatus) => {
    const fromCount = counts[from] || 0
    const toCount = counts[to] || 0
    if (fromCount === 0) return 0
    return ((toCount / fromCount) * 100).toFixed(1)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Job Status Analytics</h2>
      
      {/* Status Distribution */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Status Distribution</h3>
        <div className="space-y-4">
          {statusOrder.map((status) => {
            const count = counts[status] || 0
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : '0'
            const config = statusConfig[status]

            return (
              <div key={status} className="flex items-center">
                <div className="w-24 flex items-center">
                  <span className="mr-2">{config.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{config.label}</span>
                </div>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {count} jobs ({percentage}%)
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Conversion Rates */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">Conversion Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Saved → Applied</div>
            <div className="text-2xl font-bold text-indigo-600">
              {calculateConversionRate('saved', 'applied')}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Applied → Interview</div>
            <div className="text-2xl font-bold text-indigo-600">
              {calculateConversionRate('applied', 'interview')}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Interview → Offer</div>
            <div className="text-2xl font-bold text-indigo-600">
              {calculateConversionRate('interview', 'offer')}%
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Offer → Rejected</div>
            <div className="text-2xl font-bold text-indigo-600">
              {calculateConversionRate('offer', 'rejected')}%
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 