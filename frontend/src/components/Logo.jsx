import { Link } from 'react-router-dom'

// Combined brand lockup: the purple mark (favicon) + the ConceptFlow wordmark.
function Logo({ to = '/topics', className = '', wordmarkClassName = 'h-6' }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-2.5 ${className}`}
      aria-label="ConceptFlow home"
    >
      <img src="/favicon.svg" alt="" className="h-8 w-8" aria-hidden="true" />
      <img
        src="/conceptflow-wordmark.svg"
        alt="ConceptFlow"
        className={`w-auto ${wordmarkClassName}`}
      />
    </Link>
  )
}

export default Logo
