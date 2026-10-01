import { useEffect, useState } from 'react'
import { fetchTopics } from '../api/topics'
import TopicCard from '../components/TopicCard'

function TopicsPage() {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadTopics() {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchTopics()
        if (!cancelled) {
          setTopics(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTopics()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Topics
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Browse learning topics and build your knowledge step by step.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <p className="text-center text-slate-600">Loading topics...</p>
        )}

        {error && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
            role="alert"
          >
            {error}
          </div>
        )}

        {!loading && !error && topics.length === 0 && (
          <p className="text-center text-slate-600">No topics available yet.</p>
        )}

        {!loading && !error && topics.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default TopicsPage
