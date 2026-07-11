import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import {ContentProvider} from './context/ContentContext'
import ErrorBoundary from './components/ErrorBoundary'
import Seo from './components/Seo'
import Analytics from './components/Analytics'

export default function App() {
  return (
    <ErrorBoundary>
      <ContentProvider>
        <BrowserRouter>
          <Seo />
          <Analytics />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/collection" element={<Collection />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </ErrorBoundary>
  )
}
