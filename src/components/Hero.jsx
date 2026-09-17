import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()

  const handleCtaClick = (e) => {
    e.preventDefault()
    if (isClicked) return
    setIsClicked(true)
    setTimeout(() => {
      navigate('/auras-world')
    }, 1400) // 1.4s cinematic delay
  }

  return (
    <section className="hero">
      <div className={`hero-content ${isClicked ? 'transitioning' : ''}`}>
        <span className="hero-eyebrow">✦ THE WORLD NEEDS A LITTLE MORE LIGHT</span>

        <h1 className="hero-heading">
          <span className="heading-white">Small Hearts</span>
          <br />
          <span className="heading-gradient">Create Big Change</span>
        </h1>

        <p className="hero-description">
          Meet Aura, the Heart-Bright Kid Superhero. Using cosmic empathy,
          kindness and smart tools, I help turn worries into courage — because
          every little action can make a brighter world.
        </p>

        <div className="hero-cta-group">
          <div className="cta-wrapper">
            <button 
              className={`hero-cta ${isHovered ? 'hovered' : ''} ${isClicked ? 'clicked' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleCtaClick}
            >
              Enter Aura's World <span className="cta-arrow">→</span>
            </button>
            
            {/* The SVG Energy Trail that animates on hover */}
            <svg className={`cta-magic-trail ${isHovered && !isClicked ? 'active' : ''}`} viewBox="0 0 600 200" preserveAspectRatio="none">
              <path 
                className="magic-path-glow" 
                d="M 50 100 Q 250 -50 550 150" 
              />
              <path 
                className="magic-path-core" 
                d="M 50 100 Q 250 -50 550 150" 
              />
              <path 
                className="magic-particle" 
                d="M 50 100 Q 250 -50 550 150" 
              />
            </svg>

            {/* Click transition burst elements */}
            <div className={`cta-burst-container ${isClicked ? 'active' : ''}`}>
              <div className="burst-star">✦</div>
              <div className="burst-bloom"></div>
            </div>
          </div>
        </div>

        <p className="hero-supporting">
          Every little light can make a difference. 
          <span className="tiny-floating-star">✦</span>
        </p>
      </div>
    </section>
  )
}

export default Hero
