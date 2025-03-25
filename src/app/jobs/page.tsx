'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Job, JobStatus } from '@/lib/types'
import StatusFilter from '@/components/StatusFilter'

export default function JobsList() {
  const router = useRouter()
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | 'all'>('all')

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchJobs = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setJobs(data || [])
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [user, router])

  const filteredJobs = selectedStatus === 'all' ? jobs : jobs.filter((job) => job.status === selectedStatus)

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
        <button
          onClick={() => router.push('/jobs/new')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Job
        </button>
      </div>

      {/* Status Filter */}
      <div className="mb-8">
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          counts={statusCounts}
        />
      </div>

      {/* Jobs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {filteredJobs.length === 0 ? (
            <div className="px-6 py-4 text-gray-500">
              No jobs found. {selectedStatus === 'all' ? 'Try selecting a status.' : 'Add your first job to get started!'}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 