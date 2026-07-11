import {Component} from 'react'

export default class ErrorBoundary extends Component {
  state = {hasError: false}

  static getDerivedStateFromError() {
    return {hasError: true}
  }

  componentDidCatch(error) {
    console.error('App error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090b] px-6 text-center text-white">
          <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-2 max-w-md text-sm text-white/50">
            Please refresh the page. If it keeps happening, contact us on WhatsApp.
          </p>
          <button
            type="button"
            className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm"
            onClick={() => window.location.assign('/')}
          >
            Go home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
