import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { initializeEntries } from './data/entries'
import Sidebar from './components/Sidebar'
import Feed from './pages/Feed'
import EntryDetail from './pages/EntryDetail'
import NewEntry from './pages/NewEntry'
import MapView from './pages/MapView'
import PhotoRoll from './pages/PhotoRoll'
import CitySummaries from './pages/CitySummaries'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    initializeEntries()
  }, [])

  // Pages that manage their own headers (detail, composer)
  const hideGlobalHeader = ['/new', '/edit'].some((p) =>
    location.pathname.startsWith(p)
  ) || location.pathname.startsWith('/entry/')

  return (
    <div className="min-h-screen flex justify-center" style={{ background: '#e8f0ee' }}>
      {/* Mobile shell */}
      <div
        className="relative w-full min-h-screen overflow-hidden"
        style={{
          maxWidth: '430px',
          background: 'var(--bg-page)',
          boxShadow: '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main>
          <Routes>
            <Route
              path="/"
              element={<Feed onMenuOpen={() => setSidebarOpen(true)} />}
            />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/new" element={<NewEntry />} />
            <Route path="/edit/:id" element={<NewEntry />} />
            <Route
              path="/map"
              element={<MapView onMenuOpen={() => setSidebarOpen(true)} />}
            />
            <Route
              path="/photos"
              element={<PhotoRoll onMenuOpen={() => setSidebarOpen(true)} />}
            />
            <Route
              path="/cities"
              element={<CitySummaries onMenuOpen={() => setSidebarOpen(true)} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  )
}
