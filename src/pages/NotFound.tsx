import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-site flex-col items-start px-5 py-32 sm:px-8">
      <h1 className="type-page-title">
        That page doesn’t exist.
      </h1>
      <p className="type-body mt-4 text-ink-muted">
        The link may be out of date, or the page has moved.
      </p>
      <Link
        to="/"
        className="type-ui mt-8 rounded-md bg-blue-600 px-6 py-3 text-white transition-colors duration-200 hover:bg-blue-700"
      >
        Back home
      </Link>
    </div>
  )
}
