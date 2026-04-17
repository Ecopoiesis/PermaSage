import { useState } from 'react'

const defaultProfile = {
  name: '',
  acreage: '',
  climateZone: '',
  soilType: '',
  annualRainfall: '',
  topography: '',
  goals: '',
}

function App() {
  const [profile, setProfile] = useState(defaultProfile)

  const update = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }
const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeMyLand = async () => {
    setLoading(true)
    setAnalysis(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      })
      const data = await res.json()
      if (data.error) {
        setAnalysis('Error: ' + data.error)
      } else {
        setAnalysis(data.analysis)
      }
    } catch (err) {
      setAnalysis('Failed to connect to the server.')
    }
    setLoading(false)
  }
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24, fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 4 }}>PermaSage</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>Describe your land and get AI-powered permaculture guidance.</p>

      <label>Site name</label>
      <input
        value={profile.name}
        onChange={e => update('name', e.target.value)}
        placeholder="e.g. Sunny Acres"
      />

      <label>Acreage</label>
      <input
        value={profile.acreage}
        onChange={e => update('acreage', e.target.value)}
        placeholder="e.g. 2.5"
        type="number"
      />

      <label>USDA Climate Zone</label>
      <input
        value={profile.climateZone}
        onChange={e => update('climateZone', e.target.value)}
        placeholder="e.g. 6b"
      />

      <label>Soil type</label>
      <select value={profile.soilType} onChange={e => update('soilType', e.target.value)}>
        <option value="">Select...</option>
        <option>Clay</option>
        <option>Sandy</option>
        <option>Loam</option>
        <option>Silt</option>
        <option>Rocky</option>
        <option>Peat</option>
      </select>

      <label>Annual rainfall (inches)</label>
      <input
        value={profile.annualRainfall}
        onChange={e => update('annualRainfall', e.target.value)}
        placeholder="e.g. 45"
        type="number"
      />

      <label>Topography</label>
      <select value={profile.topography} onChange={e => update('topography', e.target.value)}>
        <option value="">Select...</option>
        <option>Flat</option>
        <option>Gentle slope</option>
        <option>Steep slope</option>
        <option>Rolling hills</option>
        <option>Valley</option>
        <option>Ridgetop</option>
      </select>

      <label>Goals & notes</label>
      <textarea
        value={profile.goals}
        onChange={e => update('goals', e.target.value)}
        placeholder="What do you want from your land? Food forest, market garden, habitat restoration..."
        rows={4}
      />

      <button
        style={{
          marginTop: 16,
          padding: '12px 24px',
          backgroundColor: '#2d6a4f',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          fontSize: 16,
          cursor: 'pointer',
          width: '100%',
        }}
        onClick={() => analyzeMyLand()}
      >
        Analyze my land
      </button>
      {loading && <p style={{ marginTop: 24, color: '#666' }}>Analyzing your land...</p>}

      {analysis && (
        <div style={{
          marginTop: 24,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 8,
          border: '1px solid #ddd',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.6,
        }}>
          <h2 style={{ fontSize: 20, marginBottom: 12, color: '#2d6a4f' }}>Your PermaSage Analysis</h2>
          {analysis}
        </div>
      )}
    </div>
  )
}

export default App