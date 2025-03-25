'use client'

import { Job } from '@/lib/types'
import { useRouter } from 'next/navigation'

type JobListProps = {
  jobs: Job[]
  isLoading: boolean
}

export default function JobList({ jobs, isLoading }: JobListProps) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-6 py-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-3 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {jobs.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">
            No jobs found. Add your first job to get started!
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.position}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  job.status === 'saved' ? 'bg-gray-100 text-gray-800' :
                  job.status === 'applied' ? 'bg-green-100 text-green-800' :
                  job.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                  job.status === 'offer' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {job.location} • {job.type} • {job.experience_level}
              </div>
              {job.salary_range && (
                <div className="mt-1 text-sm text-gray-500">
                  {job.salary_range}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
} 