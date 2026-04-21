import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 1rem 0' }}>
            MES <span className="gradient-text">Sample Terminal</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
            Oracle Database & Production Monitoring System
          </p>
        </header>

        <div className="premium-card">
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              System Status
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Database</span>
                <div style={{ fontWeight: '600', color: '#10b981' }}>● Connected</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Server API</span>
                <div style={{ fontWeight: '600', color: '#6366f1' }}>Ready</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '1.5rem' }}>Interactive Counter for Test</p>
            <button onClick={() => setCount((count) => count + 1)}>
              Action Requested: {count}
            </button>
          </div>
        </div>

        <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          &copy; 2026 Antigravity Advanced Agentic Coding. All rights reserved.
        </footer>
      </div>
    </main>
  )
}

export default App
