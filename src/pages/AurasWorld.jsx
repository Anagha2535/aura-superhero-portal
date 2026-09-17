import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/AurasWorld.css'

function AurasWorld() {
  const [isVideoFinished, setIsVideoFinished] = useState(false)
  const [isRevealingOptions, setIsRevealingOptions] = useState(false)
  const navigate = useNavigate()

  const handleVideoEnded = () => {
    // 1. Video finishes. Trigger the star burst animation.
    setIsVideoFinished(true)
    
    // 2. Wait for burst to finish, then reveal the 2x2 grid
    setTimeout(() => {
      setIsRevealingOptions(true)
    }, 1500) // 1.5s reveal delay
  }

  const handleBack = (e) => {
    e.preventDefault()
    navigate('/')
  }

  return (
    <div className="auras-world-page">
      {/* Magical environmental effects */}
      <div className="aw-environment">
        <div className="aw-stars"></div>
        <div className="aw-particles"></div>
        <div className="aw-ambient-glow"></div>
      </div>

      {/* Cinematic Video Container */}
      <div className={`aw-video-container ${isVideoFinished ? 'dimmed' : ''}`}>
        <video 
          src="/assets/aura_character_watermark_removed.mp4" 
          autoPlay 
          playsInline
          onEnded={handleVideoEnded}
          className="aw-cinematic-video"
        />
        {/* Post-video star burst */}
        <div className={`aw-video-burst ${isVideoFinished && !isRevealingOptions ? 'active' : ''}`}>
          <div className="burst-star">✦</div>
          <div className="burst-bloom"></div>
        </div>
      </div>

      {/* Navigation Options - Hidden until video finishes */}
      {isRevealingOptions && (
        <div className="aw-options-overlay">
          <div className="aw-options-content">
            <div className="aw-ending-text">
              <h2>AURA'S WORLD</h2>
              <p>Every little light can make a difference.</p>
              <div className="aw-ending-stars">✦ ✦ ✦</div>
            </div>

            <nav className="aw-nav-stack">
              <Link to="/powers" className="aw-stack-card">
                <span className="aw-card-icon">✦</span>
                <span className="aw-card-text">POWERS</span>
                <div className="aw-card-glow"></div>
              </Link>
              
              <Link to="/story" className="aw-stack-card">
                <span className="aw-card-icon">✦</span>
                <span className="aw-card-text">OUR STORY</span>
                <div className="aw-card-glow"></div>
              </Link>
              
              <Link to="/chat" className="aw-stack-card">
                <span className="aw-card-icon">✦</span>
                <span className="aw-card-text">TALK TO AURA</span>
                <div className="aw-card-glow"></div>
              </Link>

              <button onClick={handleBack} className="aw-stack-card aw-stack-back">
                <span className="aw-card-icon">←</span>
                <span className="aw-card-text">BACK TO HOME</span>
                <div className="aw-card-glow"></div>
              </button>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

export default AurasWorld
