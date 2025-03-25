'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Job } from '@/lib/types'
import StatusTimeline from '@/components/StatusTimeline'

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    const fetchJob = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', resolvedParams.id)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setJob(data)
      } catch (error) {
        console.error('Error fetching job:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [user, router, resolvedParams.id])

  const handleStatusChange = async (newStatus: string) => {
    if (!job) return

    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('jobs')
        .update({
          status: newStatus,
          [`${newStatus}_date`]: new Date().toISOString(),
        })
        .eq('id', job.id)
        .select()
        .single()

      if (error) throw error
      setJob(data)
    } catch (error) {
      console.error('Error updating job status:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
          <p className="mt-2 text-gray-500">The job you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.position}</h1>
                <p className="text-lg text-gray-500">{job.company}</p>
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {/* Status Timeline */}
            <div className="mb-8">
              <StatusTimeline
                currentStatus={job.status}
                dates={{
                  saved: job.saved_date,
                  applied: job.applied_date,
                  interview: job.interview_date,
                  offer: job.offer_date,
                  rejected: job.rejected_date,
                }}
                onStatusChange={handleStatusChange}
              />
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.location}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.type}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.experience_level}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Salary Range</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.salary_range}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Job Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.description}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Requirements</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.requirements}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{job.notes}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 