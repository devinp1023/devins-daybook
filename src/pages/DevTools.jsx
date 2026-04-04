import { useState } from 'react'
import { loadTestData, clearTestData, clearAllData, getAllEntries } from '../data/entries'
import { clearAllPhotos } from '../data/photos'

const headerStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 20,
  background: 'var(--bg-header)',
  padding: '18px 20px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
}

const cardStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-card)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
}

const buttonBase = {
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  fontFamily: 'var(--font-mono)',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: '16px',
}

export default function DevTools({ onMenuOpen }) {
  const [message, setMessage] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  function showMessage(text, type = 'success') {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  function handleLoadTestData() {
    const count = loadTestData()
    if (count > 0) {
      showMessage(`Loaded ${count} test entries`)
    } else {
      showMessage('Test data already loaded', 'info')
    }
  }

  function handleClearTestData() {
    const count = clearTestData()
    showMessage(`Removed ${count} test entries`)
  }

  async function handleClearAll() {
    if (!confirmClear) {
      setConfirmClear(true)
      return
    }
    clearAllData()
    await clearAllPhotos()
    setConfirmClear(false)
    showMessage('All data cleared')
  }

  const entries = getAllEntries()
  const testCount = entries.filter((e) => e.id.startsWith('test-')).length
  const realCount = entries.length - testCount

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg-page)' }}>
      {/* Header */}
      <div style={headerStyle}>
        <button
          onClick={onMenuOpen}
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-sidebar)',
            fontSize: '22px',
            cursor: 'pointer',
            padding: '4px',
            minWidth: '44px',
            minHeight: '44px',
          }}
        >
          &#9776;
        </button>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: '22px',
            color: 'var(--text-sidebar)',
            margin: 0,
          }}
        >
          Dev Tools
        </h1>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Status bar */}
        <div
          style={{
            ...cardStyle,
            marginBottom: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--teal-primary)',
                }}
              >
                {entries.length}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-secondary)',
                }}
              >
                Total
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {realCount}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-secondary)',
                }}
              >
                Real
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'var(--text-meta)',
                }}
              >
                {testCount}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  color: 'var(--text-secondary)',
                }}
              >
                Test
              </div>
            </div>
          </div>
        </div>

        {/* Toast message */}
        {message && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: 600,
              background:
                message.type === 'success'
                  ? 'var(--bg-tag)'
                  : 'rgba(26,106,88,0.08)',
              color: 'var(--teal-primary)',
              border: '1px solid var(--border-tag)',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Load test data */}
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--bg-tag)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              📦
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Load Test Data
            </h3>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              margin: '0 0 4px',
              lineHeight: 1.5,
            }}
          >
            Adds ~27 entries across all 11 cities with realistic journal content. Entries are spread across the full trip timeline.
          </p>
          <button
            onClick={handleLoadTestData}
            style={{
              ...buttonBase,
              background: 'var(--teal-primary)',
              color: '#fff',
            }}
          >
            Load Test Data
          </button>
        </div>

        {/* Clear test data */}
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'var(--bg-tag)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              🧹
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Clear Test Data Only
            </h3>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              margin: '0 0 4px',
              lineHeight: 1.5,
            }}
          >
            Removes only test entries (prefixed with "test-"). Your real entries stay untouched.
          </p>
          <button
            onClick={handleClearTestData}
            style={{
              ...buttonBase,
              background: 'var(--bg-tag)',
              color: 'var(--teal-primary)',
              border: '1px solid var(--border-tag)',
            }}
          >
            Clear Test Data
          </button>
        </div>

        {/* Clear all data */}
        <div style={{ ...cardStyle, marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#fff0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}
            >
              🗑️
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Clear All Data
            </h3>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              margin: '0 0 4px',
              lineHeight: 1.5,
            }}
          >
            Wipes everything — all entries and all photos. The app resets to a clean first-launch state.
          </p>
          {confirmClear ? (
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={handleClearAll}
                style={{
                  ...buttonBase,
                  flex: 1,
                  marginTop: 0,
                  background: '#dc3545',
                  color: '#fff',
                }}
              >
                Yes, delete everything
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                style={{
                  ...buttonBase,
                  flex: 1,
                  marginTop: 0,
                  background: 'var(--bg-tag)',
                  color: 'var(--text-secondary)',
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleClearAll}
              style={{
                ...buttonBase,
                background: '#fff0f0',
                color: '#dc3545',
                border: '1px solid #f5c6cb',
              }}
            >
              Clear All Data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
