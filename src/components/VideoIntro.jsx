import { useState, useRef, useEffect } from 'react';
import './VideoIntro.css';

function VideoIntro() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showBloom, setShowBloom] = useState(false);
  const [showAura, setShowAura] = useState(false);
  const videoRef = useRef(null);

  const triggerTransition = () => {
    if (isFadingOut) return;
    
    if (videoRef.current) {
      videoRef.current.pause();
    }
    
    // 1. Aurora light / energy burst
    setShowBloom(true);
    
    // 2. Aura hero appears from center (magical materialization)
    setTimeout(() => {
      setShowAura(true);
    }, 1200); // Wait for the initial bloom to expand before starting materialization

    // 3. Home page reveals (fade out the intro container)
    setTimeout(() => {
      setIsFadingOut(true);
    }, 4500); // 1.2s + 2s materialization + ~1s hold

    // 4. Unmount component
    setTimeout(() => {
      window.dispatchEvent(new Event('videoIntroFinished'));
    }, 6500); 
  };

  useEffect(() => {
    // Preload Aura character image to avoid decoding lag
    const img = new Image();
    img.src = "/assets/a_clean_high_quality_3d_cgi_cartoon_illustration.png";
    if (img.decode) {
      img.decode().catch(() => {});
    }

    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }

    const timer = setTimeout(() => {
      triggerTransition();
    }, 2000); // Keep existing Aurora timing
    
    return () => {
      clearTimeout(timer);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <div className={`video-intro-container ${isFadingOut ? 'fade-out' : ''}`}>
      <video
        ref={videoRef}
        className="intro-video"
        src="/assets/Aurora_Borealis_flowing_in_waves_20260915143836 (2) (1).mp4"
        autoPlay
        playsInline
        muted
      />
      
      {showBloom && (
        <>
          {/* Atmospheric Mist */}
          <div className="aurora-mist m1"></div>
          <div className="aurora-mist m2"></div>
          <div className="aurora-mist m3"></div>

          {/* Flowing Ribbons */}
          <div className="aurora-ribbon r1"></div>
          <div className="aurora-ribbon r2"></div>

          {/* Expanding Energy Wave */}
          <div className="energy-wave"></div>
        </>
      )}

      {showAura && (
        <div className="aura-materialize-container">
          {/* Background glow forming */}
          <div className="aura-birth-glow"></div>
          
          {/* Tiny golden particles appearing */}
          <div className="aura-birth-particles">
             {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`birth-particle bp${i + 1}`}></div>
            ))}
          </div>

          {/* Aura Character Materialization & Title */}
          <div className="aura-hero-wrapper">
            <img 
              src="/assets/a_clean_high_quality_3d_cgi_cartoon_illustration.png" 
              alt="Aura Materializing" 
              className="aura-hero-materialize" 
            />
            <div className="aura-intro-text">
              <h1 className="aura-intro-name">Aura</h1>
              <p className="aura-intro-title">The Heart-Bright Kid Hero</p>
            </div>
          </div>
          
          {/* Heart-Bright Energy Pulse */}
          <div className="aura-heart-pulse"></div>
        </div>
      )}
    </div>
  );
}

export default VideoIntro;
