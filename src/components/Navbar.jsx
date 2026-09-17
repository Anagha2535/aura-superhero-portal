import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span>
          <div className="brand-text">
            <span className="brand-name">Aura</span>
            <span className="brand-tagline">The Heart-Bright Kid Hero</span>
          </div>
        </Link>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <li><Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
          <li><Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>Talk to Aura</Link></li>
          <li><Link to="/story" className={`nav-link ${location.pathname === '/story' ? 'active' : ''}`}>Our Story</Link></li>
          <li><Link to="/powers" className={`nav-link ${location.pathname === '/powers' ? 'active' : ''}`}>Powers</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
