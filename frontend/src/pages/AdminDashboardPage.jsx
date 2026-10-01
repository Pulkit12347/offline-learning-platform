import { useEffect, useState } from 'react'
import { fetchAdminDashboard } from '../api/admin'

function StatCard({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        accent ? 'border-indigo-200 bg-indigo-50' : 'border-slate-200 bg-white'
      }`}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  )
}

function formatDate(value) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchAdminDashboard()
        if (!cancelled) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin dashboard
        </h1>
        <p className="mt-2 text-slate-600">
          User growth and how students are performing across the platform.
        </p>
      </header>

      {loading && <p className="text-slate-600">Loading dashboard…</p>}

      {error && !loading && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <div className="space-y-8">
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total users" value={data.total_users} accent />
            <StatCard label="Students" value={data.students} />
            <StatCard label="Verified" value={data.verified_users} />
            <StatCard label="New this week" value={data.new_users_last_7_days} />
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Account status</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Verified users" value={data.verified_users} />
                <Row label="Awaiting verification" value={data.unverified_users} />
                <Row label="Admins" value={data.admin_users} />
              </dl>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Students by grade</h2>
              {data.users_by_grade.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No students yet.</p>
              ) : (
                <dl className="mt-4 space-y-3 text-sm">
                  {data.users_by_grade.map((row) => (
                    <Row key={row.grade} label={row.grade} value={row.count} />
                  ))}
                </dl>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">
                Performance
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Quizzes taken" value={data.total_quizzes_taken} />
                <Row label="Questions answered" value={data.total_questions_answered} />
                <Row label="Average accuracy" value={`${data.average_accuracy}%`} />
              </dl>
              <p className="mt-4 text-xs text-slate-400">
                Performance metrics populate once quizzes are launched.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Student performance
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Grade</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Quizzes</th>
                    <th className="px-6 py-3">Answered</th>
                    <th className="px-6 py-3">Accuracy</th>
                    <th className="px-6 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.student_performance.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                        No students have signed up yet.
                      </td>
                    </tr>
                  ) : (
                    data.student_performance.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {student.grade || '—'}
                        </td>
                        <td className="px-6 py-4">
                          {student.is_verified ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                              Verified
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{student.quizzes_taken}</td>
                        <td className="px-6 py-4 text-slate-700">
                          {student.questions_answered}
                        </td>
                        <td className="px-6 py-4 text-slate-700">{student.accuracy}%</td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(student.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  )
}

export default AdminDashboardPage
