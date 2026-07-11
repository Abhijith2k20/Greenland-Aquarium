import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-enter relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 pb-20 pt-28 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-sm text-white/50">
        That link doesn’t exist. Head back home or browse the collection.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          data-cursor="hover"
          className="rounded-full bg-gradient-to-r from-[#eaf8ff] via-[#7ec8f0] to-[#6ed9a8] px-5 py-2.5 text-sm font-semibold text-black"
        >
          Home
        </Link>
        <Link
          to="/collection"
          data-cursor="hover"
          className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
        >
          Collection
        </Link>
      </div>
    </div>
  )
}
