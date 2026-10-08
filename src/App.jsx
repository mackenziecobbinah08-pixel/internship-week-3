import { useState } from 'react'
import './App.css'

const API_BASE = 'https://restcountries.com/v3.1'

function App() {
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) {
      setError('Please enter a country name')
      setCountry(null)
      setSearched(true)
      return
    }
    setLoading(true)
    setError('')
    setCountry(null)
    setSearched(true)
    try {
      const response = await fetch(
        `${API_BASE}/name/${encodeURIComponent(query.trim())}?fullText=false`
      )
      if (!response.ok) {
        if (response.status === 404) {
          setError('No country found')
        } else {
          setError('Failed to fetch country data')
        }
        return
      }
      const data = await response.json()
      setCountry(data[0])
    } catch (_err) {
      setError('An error occurred while fetching data')
    } finally {
      setLoading(false)
    }
  }

  const formatPopulation = (pop) => {
    if (pop === undefined || pop === null) return 'N/A'
    return pop.toLocaleString()
  }

  const getLanguages = (languages) => {
    if (!languages) return 'N/A'
    return Object.values(languages).join(', ')
  }

  const getCapital = (capital) => {
    if (!capital || !capital.length) return 'N/A'
    return capital.join(', ')
  }

  return (
    <div className="app">
      <h1>Country Info</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a country..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      <div className="results">
        {loading && <p className="state">Loading...</p>}
        {!loading && error && <p className="state error">{error}</p>}
        {!loading && !error && searched && !country && (
          <p className="state empty">No results found</p>
        )}
        {!loading && !error && !searched && (
          <p className="state empty">Search for a country to see its info</p>
        )}
        {!loading && !error && country && (
          <div className="country-card">
            <img
              src={country.flags?.svg || country.flags?.png}
              alt={country.flags?.alt || `${country.name?.common} flag`}
              className="country-flag"
            />
            <h2>{country.name?.common}</h2>
            {country.name?.official && (
              <p className="official-name">{country.name.official}</p>
            )}
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Capital:</span>
                <span className="value">{getCapital(country.capital)}</span>
              </div>
              <div className="info-item">
                <span className="label">Population:</span>
                <span className="value">{formatPopulation(country.population)}</span>
              </div>
              <div className="info-item">
                <span className="label">Region:</span>
                <span className="value">{country.region || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="label">Languages:</span>
                <span className="value">{getLanguages(country.languages)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
