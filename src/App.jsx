import { useState, useRef } from 'react'
import AnalysisResult from './components/AnalysisResult'
import './App.css'

const defaultProfile = {
  name: '',
  acreage: '',
  climateZone: '',
  soilType: '',
  annualRainfall: '',
  topography: '',
  goals: '',
}

const tabs = [
  { id: 'analyze', label: 'Analyze', icon: '🔍' },
  { id: 'map', label: 'Map', icon: '🗺️', disabled: true },
  { id: 'guilds', label: 'Guilds', icon: '🌿', disabled: true },
  { id: 'history', label: 'History', icon: '📋', disabled: true },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('analyze')
  const [profile, setProfile] = useState(defaultProfile)
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const resultRef = useRef(null)

  const update = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const analyzeMyLand = async () => {
    setLoading(true)
    setAnalysis(null)
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setAnalysis(data.analysis)
        // Scroll to results after a short delay
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    } catch (err) {
      setError('Failed to connect. Please check your connection and try again.')
    }
    setLoading(false)
  }

  const hasMinimumInput = profile.acreage || profile.climateZone || profile.goals

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">🌱</span>
            <span className="brand-name">PermaSage</span>
          </div>
          <nav className="nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`nav-tab ${activeTab === tab.id ? 'active' : ''} ${tab.disabled ? 'disabled' : ''}`}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
              >
                <span className="nav-tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {activeTab === 'analyze' && (
          <>
            <div className="page-header">
              <h1 className="page-title">Analyze your land</h1>
              <p className="page-subtitle">
                Describe your site and PermaSage will generate a personalized 
                permaculture assessment with zone layouts, plant guilds, and an action plan.
              </p>
            </div>

            {/* Land Profile Form */}
            <div className="card">
              {/* Section: Your Land */}
              <div className="form-section">
                <div className="form-section-label">Your Land</div>
                <div className="form-field">
                  <label htmlFor="name">Site name</label>
                  <input
                    id="name"
                    value={profile.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Give your site a name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="acreage">Acreage</label>
                    <input
                      id="acreage"
                      value={profile.acreage}
                      onChange={e => update('acreage', e.target.value)}
                      placeholder="e.g. 2.5"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="climateZone">USDA Climate Zone</label>
                    <input
                      id="climateZone"
                      value={profile.climateZone}
                      onChange={e => update('climateZone', e.target.value)}
                      placeholder="e.g. 6b"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Soil & Water */}
              <div className="form-section">
                <div className="form-section-label">Soil & Water</div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="soilType">Soil type</label>
                    <select id="soilType" value={profile.soilType} onChange={e => update('soilType', e.target.value)}>
                      <option value="">Select soil type...</option>
                      <option>Clay</option>
                      <option>Sandy</option>
                      <option>Loam</option>
                      <option>Sandy loam</option>
                      <option>Clay loam</option>
                      <option>Silt</option>
                      <option>Rocky / Gravelly</option>
                      <option>Peat</option>
                      <option>Not sure</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="annualRainfall">Annual rainfall (inches)</label>
                    <input
                      id="annualRainfall"
                      value={profile.annualRainfall}
                      onChange={e => update('annualRainfall', e.target.value)}
                      placeholder="e.g. 45"
                      type="number"
                    />
                  </div>
                </div>
              </div>

              {/* Section: Terrain & Vision */}
              <div className="form-section">
                <div className="form-section-label">Terrain & Vision</div>
                <div className="form-field">
                  <label htmlFor="topography">Topography</label>
                  <select id="topography" value={profile.topography} onChange={e => update('topography', e.target.value)}>
                    <option value="">Select terrain...</option>
                    <option>Flat</option>
                    <option>Gentle slope (south-facing)</option>
                    <option>Gentle slope (north-facing)</option>
                    <option>Gentle slope (east/west)</option>
                    <option>Steep slope</option>
                    <option>Rolling hills</option>
                    <option>Valley / Low-lying</option>
                    <option>Ridgetop / Exposed</option>
                    <option>Mixed terrain</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="goals">Goals & notes</label>
                  <textarea
                    id="goals"
                    value={profile.goals}
                    onChange={e => update('goals', e.target.value)}
                    placeholder="What's your vision? Food forest, market garden, homestead, wildlife habitat, water harvesting, carbon sequestration... Include any existing features, challenges, or dreams."
                    rows={4}
                  />
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={analyzeMyLand}
                disabled={loading || !hasMinimumInput}
              >
                {loading ? 'Analyzing...' : '🌿 Analyze my land'}
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="loading-bar">
                <p>PermaSage is studying your land profile...</p>
                <div className="loading-track">
                  <div className="loading-fill" />
                </div>
              </div>
            )}

            {/* Error */}
            {error && <div className="error-msg">{error}</div>}

            {/* Results */}
            <div ref={resultRef}>
              {analysis && <AnalysisResult text={analysis} />}
            </div>
          </>
        )}

        {/* Coming Soon tabs */}
        {activeTab !== 'analyze' && (
          <div className="coming-soon">
            <div className="coming-soon-icon">
              {tabs.find(t => t.id === activeTab)?.icon || '🌱'}
            </div>
            <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p>Coming soon to PermaSage</p>
          </div>
        )}
      </main>

      <footer className="footer">
        PermaSage — AI-powered permaculture design
      </footer>
    </>
  )
}
