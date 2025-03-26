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
  const [copied, setCopied] = useState(false)

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

  const getStatusColor = (status: Job['status']) => {
    const colors = {
      saved: 'bg-gray-100 text-gray-800',
      applied: 'bg-blue-100 text-blue-800',
      interview: 'bg-yellow-100 text-yellow-800',
      offer: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  const getStatusText = (status: Job['status']) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const copyToClipboard = async (text: string | undefined) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const getTimeInStatus = () => {
    if (!job) return null
    const statusDate = job[`${job.status}_date`]
    if (!statusDate) return null

    const date = new Date(statusDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
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
          <p className="mt-2 text-gray-500">The job you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Card */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.position}</h1>
                    <p className="text-lg text-gray-500">{job.company}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusText(job.status)}
                    </span>
                    {getTimeInStatus() && (
                      <span className="text-sm text-gray-500">
                        {getTimeInStatus()}
                      </span>
                    )}
                  </div>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
              </div>
              <div className="px-6 py-4">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                    <dd className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-900">{job.contact_name || 'Not provided'}</span>
                      {job.contact_name && (
                        <button
                          onClick={() => copyToClipboard(job.contact_name)}
                          className="ml-2 text-indigo-600 hover:text-indigo-500"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Email</dt>
                    <dd className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-900">{job.contact_email || 'Not provided'}</span>
                      {job.contact_email && (
                        <button
                          onClick={() => copyToClipboard(job.contact_email)}
                          className="ml-2 text-indigo-600 hover:text-indigo-500"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Contact Phone</dt>
                    <dd className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-gray-900">{job.contact_phone || 'Not provided'}</span>
                      {job.contact_phone && (
                        <button
                          onClick={() => copyToClipboard(job.contact_phone)}
                          className="ml-2 text-indigo-600 hover:text-indigo-500"
                        >
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Application Timeline Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Application Timeline</h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {Object.entries({
                    saved: job.saved_date,
                    applied: job.applied_date,
                    interview: job.interview_date,
                    offer: job.offer_date,
                    rejected: job.rejected_date,
                  }).map(([status, date]) => (
                    date && (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 capitalize">{status}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(date).toLocaleDateString()}
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 