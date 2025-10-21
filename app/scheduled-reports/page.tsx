'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

interface Schedule {
  id: string
  reportType: string
  frequency: string
  timeOfDay: string
  nextRunAt: string
  lastRunAt: string | null
  isActive: boolean
  recipients: string[]
  adAccount: {
    accountName: string
  }
}

export default function ScheduledReportsPage() {
  const router = useRouter()
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchSchedules()
  }, [])

  async function fetchSchedules() {
    try {
      const response = await fetch('/api/scheduled-reports')
      if (response.ok) {
        const data = await response.json()
        setSchedules(data.schedules)
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleActive(scheduleId: string, isActive: boolean) {
    try {
      const response = await fetch(`/api/scheduled-reports/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        fetchSchedules()
      }
    } catch (error) {
      console.error('Error toggling schedule:', error)
    }
  }

  async function deleteSchedule(scheduleId: string) {
    if (!confirm('Are you sure you want to delete this scheduled report?')) {
      return
    }

    try {
      const response = await fetch(`/api/scheduled-reports/${scheduleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchSchedules()
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Scheduled Reports</h1>
              <p className="text-sm text-gray-500">Manage automatic report delivery</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => router.push('/dashboard')} className="btn-secondary">
                Back to Dashboard
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Scheduled Reports</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                + New Schedule
              </button>
            </div>
          </div>

          {schedules.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
              <p className="text-gray-600 mb-6">
                Set up automatic report delivery to save time and stay informed
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Your First Schedule
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {schedule.adAccount.accountName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            schedule.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {schedule.isActive ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Frequency:</span>{' '}
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}
                        </div>
                        <div>
                          <span className="font-medium">Time:</span> {schedule.timeOfDay}
                        </div>
                        <div>
                          <span className="font-medium">Next delivery:</span>{' '}
                          {new Date(schedule.nextRunAt).toLocaleString()}
                        </div>
                        {schedule.lastRunAt && (
                          <div>
                            <span className="font-medium">Last sent:</span>{' '}
                            {new Date(schedule.lastRunAt).toLocaleString()}
                          </div>
                        )}
                        <div className="col-span-2">
                          <span className="font-medium">Recipients:</span>{' '}
                          {schedule.recipients.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => toggleActive(schedule.id, schedule.isActive)}
                        className="btn-secondary text-sm"
                      >
                        {schedule.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-700 px-3 py-1 rounded-lg text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note about cron setup */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1 text-sm text-blue-800">
              <strong>Note:</strong> Scheduled reports require a cron job to be configured.
              In production, set up Vercel Cron or a similar service to call{' '}
              <code className="bg-blue-100 px-1 rounded">/api/cron/send-reports</code> hourly.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
