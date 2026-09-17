import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import '../styles/Powers.css';

const POWERS = [
  {
    id: 1,
    title: "HEART-BRIGHT EMPATHY",
    description: "Aura can sense when someone is struggling and understand their emotions.",
    icon: "♥",
    color: "var(--power-golden)",
    accentColor: "#FFD76A"
  },
  {
    id: 2,
    title: "COURAGE SPARK",
    description: "Aura transforms fear and doubt into courage.",
    icon: "⚡",
    color: "var(--power-yellow)",
    accentColor: "#FFD76A"
  },
  {
    id: 3,
    title: "KINDNESS RADIANCE",
    description: "Aura's kindness creates positive energy that spreads to others.",
    icon: "✨",
    color: "var(--power-pink)",
    accentColor: "#63E6E2"
  },
  {
    id: 4,
    title: "EMOTION VISION",
    description: "Aura can recognize emotional signals that others cannot easily see.",
    icon: "👁",
    color: "var(--power-purple)",
    accentColor: "#9370DB"
  },
  {
    id: 5,
    title: "HEALING LIGHT",
    description: "Aura uses compassionate energy to comfort and emotionally support someone who is hurting.",
    icon: "🌟",
    color: "var(--power-gold-light)",
    accentColor: "#FFD76A"
  },
  {
    id: 6,
    title: "SMART HERO",
    description: "Aura combines empathy with smart technology and tools to solve problems and help people.",
    icon: "⚙",
    color: "var(--power-cyan)",
    accentColor: "#63E6E2"
  }
];

function Powers() {
  const [revealed, setRevealed] = useState(false);
  const [activePower, setActivePower] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 500);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const getRadii = () => {
    // Dynamic radii based on window dimensions to keep everything in viewport
    const maxR = 320;
    const paddingX = 200; // Left/right safe padding
    const paddingY = 260; // Top/bottom safe padding (extra for bottom description text)
    
    const dynamicRx = (windowSize.width / 2) - paddingX;
    const dynamicRy = (windowSize.height / 2) - paddingY;
    
    // Fallbacks for very small screens before media query kicks in
    return {
      rx: Math.max(160, Math.min(maxR, dynamicRx)),
      ry: Math.max(160, Math.min(maxR, dynamicRy))
    };
  };

  const getPosForPower = (index) => {
    const { rx, ry } = getRadii();
    // rx is dynamic horizontal radius, ry is vertical
    // Create organic offsets so it's not a perfect box
    const xOffset = rx * 0.1;
    const yOffset = ry * 0.1;
    
    switch (index) {
      case 0: return { x: -rx, y: -ry };               // Top Left: Heart-Bright Empathy
      case 1: return { x: rx, y: -ry };                // Top Right: Courage Spark
      case 2: return { x: rx + xOffset, y: 0 };        // Middle Right: Kindness Radiance
      case 3: return { x: -(rx + xOffset), y: 0 };     // Middle Left: Emotion Vision
      case 4: return { x: -rx, y: ry };                // Bottom Left: Healing Light
      case 5: return { x: rx, y: ry };                 // Bottom Right: Smart Hero
      default: return { x: 0, y: 0 };
    }
  };

  const getStyleForPower = (index) => {
    const { x, y } = getPosForPower(index);
    return {
      '--target-x': `${x}px`,
      '--target-y': `${y}px`,
      '--delay': `${index * 0.4}s`,
      '--power-color': POWERS[index].color
    };
  };

  const getPathForPower = (index) => {
    const { x, y } = getPosForPower(index);
    const { ry } = getRadii();
    
    // Create an elegant organic sag/curve towards the power
    let cp1x = x * 0.5;
    let cp1y = y;
    
    // Give top paths an upward curve, bottom paths a downward curve
    if (y < 0) cp1y = y - (ry * 0.3);
    else if (y > 0) cp1y = y + (ry * 0.3);
    else {
      // Middle paths droop naturally
      cp1y = ry * 0.4;
    }
    
    return `M 0 0 Q ${cp1x} ${cp1y} ${x} ${y}`;
  };

  return (
    <div className="powers-page">
      <Navbar />
      
      <div className="powers-intro">
        <h1 className={`powers-title ${revealed ? 'visible' : ''}`}>AURA'S POWERS</h1>
        <p className={`powers-subtitle ${revealed ? 'visible' : ''}`}>Every power begins with a little light.</p>
      </div>

      <div className="powers-container">
        <div className="powers-bg-effects">
          <div className="aurora-borealis"></div>
          <div className="stars-overlay"></div>
        </div>

        <svg className="connections-layer" viewBox="-400 -400 800 800">
          {POWERS.map((power, index) => (
            <React.Fragment key={`path-group-${power.id}`}>
              {/* Base glowing line */}
              <path 
                className={`connection-line ${revealed ? 'visible' : ''} ${activePower === power.id ? 'active' : ''}`}
                d={getPathForPower(index)}
                style={{
                  stroke: power.color,
                  transitionDelay: `${(index * 0.4) + 0.2}s`
                }}
              />
              {/* Flowing animated energy particle */}
              <path 
                className={`energy-particle ${revealed ? 'visible' : ''} ${activePower === power.id ? 'active' : ''}`}
                d={getPathForPower(index)}
                style={{
                  stroke: power.color,
                  animationDelay: `${(index * 0.4) + 0.2}s`
                }}
              />
            </React.Fragment>
          ))}
        </svg>

        <div className="aura-center-wrapper">
          <div className={`aura-glow-pulse ${revealed ? 'visible' : ''}`}></div>
          <img 
            src="/assets/aura-powers-center.png" 
            alt="Aura reaching for a star" 
            className="powers-center-image" 
            draggable="false" 
          />
        </div>

        <div className="powers-orbit-container">
          {POWERS.map((power, index) => {
            // Determine direction to expand based on explicit Left/Right position
            let directionClass = '';
            // Left side powers (indices 0, 3, 4) expand left
            if (index === 0 || index === 3 || index === 4) directionClass = 'expand-left';
            // Right side powers (indices 1, 2, 5) expand right
            else if (index === 1 || index === 2 || index === 5) directionClass = 'expand-right';

            return (
              <div 
                key={power.id}
                className={`power-node ${revealed ? 'emerged' : ''} ${activePower === power.id ? 'active' : ''} ${directionClass}`}
                style={getStyleForPower(index)}
                onMouseEnter={() => setActivePower(power.id)}
                onMouseLeave={() => setActivePower(null)}
                onClick={() => setActivePower(activePower === power.id ? null : power.id)}
              >
                <div className="power-icon" style={{ color: power.color, boxShadow: `0 0 20px ${power.color}80` }}>
                  {power.icon}
                </div>
                <div className="power-content">
                  <h3 className="power-name" style={{ color: power.color, textShadow: `0 0 12px color-mix(in srgb, ${power.color} 40%, transparent)` }}>{power.title}</h3>
                  <p className="power-desc">{power.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Powers;
