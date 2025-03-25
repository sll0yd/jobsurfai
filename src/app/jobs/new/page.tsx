'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Job } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewJob() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Job>>({
    status: 'saved',
  })
  const [jobUrl, setJobUrl] = useState('')
  const [jobText, setJobText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...formData,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      // Create activity record
      await supabase.from('activities').insert({
        job_id: data.id,
        user_id: user.id,
        type: 'created',
        details: 'New job application created',
      })

      router.push(`/jobs/${data.id}`)
    } catch (error) {
      console.error('Error creating job:', error)
      setError('Failed to create job. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExtractFromUrl = async () => {
    if (!jobUrl) {
      setError('Please enter a job posting URL')
      return
    }

    setExtracting(true)
    setError(null)
    try {
      const response = await fetch('/api/extract-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: jobUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract job details')
      }

      setFormData((prev) => ({
        ...prev,
        ...data,
        job_url: jobUrl,
      }))
    } catch (error) {
      console.error('Error extracting job details:', error)
      setError(error instanceof Error ? error.message : 'Failed to extract job details')
    } finally {
      setExtracting(false)
    }
  }

  const handleExtractFromText = async () => {
    if (!jobText) {
      setError('Please enter job posting text')
      return
    }

    setExtracting(true)
    setError(null)
    try {
      const response = await fetch('/api/extract-job/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: jobText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract job details')
      }

      setFormData((prev) => ({
        ...prev,
        ...data,
      }))
    } catch (error) {
      console.error('Error extracting job details:', error)
      setError(error instanceof Error ? error.message : 'Failed to extract job details')
    } finally {
      setExtracting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add New Job</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* AI Extraction Section */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">AI-Powered Job Extraction</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="job-url" className="block text-sm font-medium text-gray-700">
                    Job URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="url"
                      id="job-url"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Paste job posting URL"
                      value={jobUrl}
                      onChange={(e) => setJobUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleExtractFromUrl}
                      disabled={extracting || !jobUrl}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {extracting ? 'Extracting...' : 'Extract Details'}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="job-text" className="block text-sm font-medium text-gray-700">
                    Job Description Text
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="job-text"
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="Paste job description text"
                      value={jobText}
                      onChange={(e) => setJobText(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleExtractFromText}
                        disabled={extracting || !jobText}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {extracting ? 'Extracting...' : 'Extract Details'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  required
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
                  required
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

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 