'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Job, Activity, DashboardStats } from '@/lib/types'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import JobStatusComponent from '@/components/JobStatus'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      const supabase = createClient()

      // Fetch jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch activities
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      // Calculate statistics
      const totalJobs = jobs?.length || 0
      const jobsByStatus = jobs?.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const stats: DashboardStats = {
        total_jobs: totalJobs,
        jobs_by_status: {
          saved: jobsByStatus['saved'] || 0,
          applied: jobsByStatus['applied'] || 0,
          interview: jobsByStatus['interview'] || 0,
          offer: jobsByStatus['offer'] || 0,
          rejected: jobsByStatus['rejected'] || 0,
        },
        recent_activities: activities || [],
        application_rate: totalJobs > 0 ? ((jobsByStatus['applied'] || 0) / totalJobs) * 100 : 0,
        interview_rate: totalJobs > 0 ? ((jobsByStatus['interview'] || 0) / totalJobs) * 100 : 0,
        offer_rate: totalJobs > 0 ? ((jobsByStatus['offer'] || 0) / totalJobs) * 100 : 0,
      }

      setStats(stats)
      setRecentJobs(jobs || [])
      setRecentActivities(activities || [])
      setLoading(false)
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/jobs/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Add New Job
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">{stats?.total_jobs || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Application Rate</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {stats?.application_rate.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Interview Rate</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {stats?.interview_rate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Jobs</h2>
              <Link
                href="/jobs/new"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Add New Job
              </Link>
            </div>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{job.position}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <JobStatusComponent status={job.status} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100">
                      <span className="text-indigo-600">
                        {activity.type === 'created'
                          ? '📝'
                          : activity.type === 'updated'
                          ? '✏️'
                          : activity.type === 'status_changed'
                          ? '🔄'
                          : '📌'}
                      </span>
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.details}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 