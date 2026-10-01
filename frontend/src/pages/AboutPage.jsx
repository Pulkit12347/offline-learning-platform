import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'Offline-first',
    description:
      'Keep learning even with unreliable connectivity. Progress syncs automatically when you’re back online.',
  },
  {
    title: 'Adaptive learning',
    description:
      'We track mastery across topics and detect knowledge gaps using prerequisite relationships between concepts.',
  },
  {
    title: 'Personalized recommendations',
    description:
      'When a topic is challenging, ConceptFlow points you back to the foundational concepts that unlock it.',
  },
  {
    title: 'Progress you can see',
    description:
      'A clear dashboard shows completed lessons, quiz performance, weak topics, and what to study next.',
  },
]

function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="flex flex-col items-center text-center">
        <img
          src="/conceptflow-wordmark.svg"
          alt="ConceptFlow"
          className="h-10 w-auto"
        />
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
          ConceptFlow is a modern, offline-first learning platform that delivers
          personalized education to students — even where internet access is
          limited or unreliable.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <article
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-12 rounded-2xl border border-indigo-100 bg-indigo-50 p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          Ready to start learning?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
          Create a free account and build your knowledge step by step, one concept
          at a time.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            to="/signup"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get started
          </Link>
          <Link
            to="/topics"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse topics
          </Link>
        </div>
      </section>
    </main>
  )
}

export default AboutPage
