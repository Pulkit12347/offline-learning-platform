import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { fetchTopic } from '../api/topics'

const DIFFICULTY_COPY = {
  beginner: {
    label: 'Beginner',
    description: 'A foundational concept to build confidence before moving ahead.',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'A bridge topic that connects basics to more advanced problem solving.',
  },
  advanced: {
    label: 'Advanced',
    description: 'A higher-level topic that depends on strong prerequisite knowledge.',
  },
}

function TopicDetailPage() {
  const { topicId } = useParams()
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const numericTopicId = Number(topicId)
  const isInvalidTopicId = !Number.isInteger(numericTopicId) || numericTopicId < 1

  useEffect(() => {
    let cancelled = false

    async function loadTopic() {
      if (isInvalidTopicId) {
        setError('Topic not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchTopic(numericTopicId)
        if (!cancelled) {
          setTopic(data)
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

    loadTopic()

    return () => {
      cancelled = true
    }
  }, [isInvalidTopicId, numericTopicId])

  const difficulty = useMemo(() => {
    if (!topic) {
      return null
    }

    return DIFFICULTY_COPY[topic.difficulty] ?? {
      label: topic.difficulty,
      description: 'A learning topic in the adaptive curriculum.',
    }
  }, [topic])

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            to="/topics"
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
          >
            Back to topics
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
            Loading topic...
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700"
            role="alert"
          >
            <p className="font-semibold">{error}</p>
            <Link
              to="/topics"
              className="mt-4 inline-flex rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Return to topics
            </Link>
          </div>
        )}

        {!loading && !error && topic && (
          <article className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Learning topic
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  {topic.name}
                </h1>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize text-slate-800">
                {difficulty.label}
              </span>
            </div>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              {topic.description}
            </p>

            <section className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-base font-semibold text-slate-950">
                Difficulty level
              </h2>
              <p className="mt-2 text-slate-600">{difficulty.description}</p>
            </section>
          </article>
        )}
      </main>
    </div>
  )
}

export default TopicDetailPage
