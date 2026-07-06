import { Link } from 'react-router-dom'

const DIFFICULTY_STYLES = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-rose-100 text-rose-800',
}

function TopicCard({ topic }) {
  const badgeClass =
    DIFFICULTY_STYLES[topic.difficulty] ?? 'bg-slate-100 text-slate-800'

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{topic.name}</h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${badgeClass}`}
        >
          {topic.difficulty}
        </span>
      </div>
      <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-slate-600">
        {topic.description}
      </p>
      <Link
        to={`/topics/${topic.id}`}
        className="mt-5 inline-flex w-fit items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        View topic
      </Link>
    </article>
  )
}

export default TopicCard
