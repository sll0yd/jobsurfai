'use client'

import { useEffect, useState, use } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Job, JobStatus } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import JobStatusComponent from '@/components/JobStatus'
import Link from 'next/link'

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { user } = useAuth()
  const router = useRouter()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<Job>>({})

  useEffect(() => {
    const fetchJob = async () => {
      if (!user) return

      const supabase = createClient()
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', resolvedParams.id)
        .single()

      if (error) {
        console.error('Error fetching job:', error)
        router.push('/jobs')
        return
      }

      setJob(data)
      setFormData(data)
      setLoading(false)
    }

    fetchJob()
  }, [user, resolvedParams.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !job) return

    const supabase = createClient()
    const { error } = await supabase
      .from('jobs')
      .update(formData)
      .eq('id', job.id)

    if (error) {
      console.error('Error updating job:', error)
      return
    }

    // Create activity record
    await supabase.from('activities').insert({
      job_id: job.id,
      user_id: user.id,
      type: 'updated',
      details: 'Job details updated',
    })

    setJob({ ...job, ...formData })
    setIsEditing(false)
  }

  const handleStatusChange = async (newStatus: JobStatus) => {
    if (!user || !job) return

    const supabase = createClient()
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', job.id)

    if (error) {
      console.error('Error updating job status:', error)
      return
    }

    // Create activity record
    await supabase.from('activities').insert({
      job_id: job.id,
      user_id: user.id,
      type: 'status_changed',
      details: `Job status changed to ${newStatus}`,
    })

    setJob({ ...job, status: newStatus })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Job not found</h1>
          <p className="mt-4 text-gray-600">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Job' : job.position}
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            {isEditing && (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    id="position"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.requirements || ''}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="salary_range" className="block text-sm font-medium text-gray-700">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary_range"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.salary_range || ''}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="job_url" className="block text-sm font-medium text-gray-700">
                    Job URL
                  </label>
                  <input
                    type="url"
                    id="job_url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.job_url || ''}
                    onChange={(e) => setFormData({ ...formData, job_url: e.target.value })}
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Company</h2>
                  <p className="mt-1 text-gray-600">{job.company}</p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Position</h2>
                  <p className="mt-1 text-gray-600">{job.position}</p>
                </div>

                {job.location && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Location</h2>
                    <p className="mt-1 text-gray-600">{job.location}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-medium text-gray-900">Status</h2>
                  <div className="mt-2 flex space-x-2">
                    {(['saved', 'applied', 'interview', 'offer', 'rejected'] as JobStatus[]).map(
                      (status) => (
                        <JobStatusComponent
                          key={status}
                          status={status}
                          onClick={() => handleStatusChange(status)}
                          interactive
                        />
                      )
                    )}
                  </div>
                </div>

                {job.description && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Description</h2>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{job.description}</p>
                  </div>
                )}

                {job.requirements && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Requirements</h2>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
                  </div>
                )}

                {job.salary_range && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Salary Range</h2>
                    <p className="mt-1 text-gray-600">{job.salary_range}</p>
                  </div>
                )}

                {job.job_url && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Job URL</h2>
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-indigo-600 hover:text-indigo-800"
                    >
                      View Job Posting
                    </a>
                  </div>
                )}

                {job.notes && (
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Notes</h2>
                    <p className="mt-1 text-gray-600 whitespace-pre-wrap">{job.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              className="h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
} 