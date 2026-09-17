import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/OurStory.css';

const chapters = [
  {
    num: "01",
    title: "BEFORE THE LIGHT",
    text: <>Aura was an ordinary kid with an unusual habit:<br />she noticed the things other people missed.<br /><br />The quiet friend.<br />The worried smile.<br />The person who needed <span className="highlight-gold">someone to simply listen</span>.<br /><br />She believed that even the <span className="highlight-gold">smallest act of kindness</span><br />could make someone's day brighter.</>,
    visualClass: "visual-ch1",
    imgSrc: "/assets/ch1.jpg",
    visualContent: <div className="particles warm-particles"></div>
  },
  {
    num: "02",
    title: "THE NIGHT EVERYTHING CHANGED",
    text: <>One quiet night, beneath a sky filled with northern<br />lights, Aura saw something strange.<br /><br />A <span className="highlight-gold">tiny golden light</span> appeared among the stars.<br /><br />It wasn't falling like a meteor.<br /><br />It was <span className="highlight-gold">searching for someone</span>.</>,
    visualClass: "visual-ch2",
    imgSrc: "/assets/ch2.jpg",
    visualContent: (
      <>
        <div className="living-star star-ch2-main"></div>
        <div className="particle-emitter emit-ch2"></div>
        <div className="drifting-stars cold-stars"></div>
        <div className="aurora-flow aurora-ch2"></div>
      </>
    )
  },
  {
    num: "03",
    title: "THE HEART-BRIGHT SPARK",
    text: <>When Aura reached toward the light, it became a tiny<br />cosmic star.<br /><br />The moment she touched it, something changed.<br /><br />She could feel the <span className="highlight-gold">emotions people carried inside</span> —<br />their worries, their fears, and the <span className="highlight-gold">hope they sometimes<br />forgot they had</span>.</>,
    visualClass: "visual-ch3",
    imgSrc: "/assets/ch3.jpg",
    visualContent: (
      <>
        <div className="living-star star-ch3-main"></div>
        <div className="particle-emitter emit-ch3"></div>
        <div className="drifting-stars warm-stars"></div>
      </>
    )
  },
  {
    num: "04",
    title: "BECOMING AURA",
    text: <>Aura soon discovered that her greatest power wasn't<br />strength.<br /><br />It was <span className="highlight-gold">empathy</span>.<br /><br />With courage, kindness, cosmic energy and smart tools,<br />she could help people <span className="highlight-gold">turn fear into confidence</span>.</>,
    visualClass: "visual-ch4",
    imgSrc: "/assets/ch4.jpg",
    visualContent: (
      <>
        <div className="living-star star-ch4-main"></div>
        <div className="sparkles-container">
          <div className="sparkle s1"></div>
          <div className="sparkle s2"></div>
          <div className="sparkle s3"></div>
          <div className="sparkle s4"></div>
        </div>
      </>
    )
  },
  {
    num: "05",
    title: "A DIFFERENT KIND OF HERO",
    text: <>Aura didn't become a hero to fight monsters.<br /><br />She became one to help people face the moments that<br />felt impossible.<br /><br />Sometimes her mission was as simple as helping someone<br />feel heard.<br /><br />Because sometimes, the greatest superpower is <span className="highlight-gold">simply<br />being there</span>.</>,
    visualClass: "visual-ch5",
    imgSrc: "/assets/ch5.jpg",
    visualContent: (
      <>
        <div className="emotional-lights">
          <div className="float-up light-1"></div>
          <div className="float-up light-2"></div>
          <div className="float-up heart-1"></div>
          <div className="float-up heart-2"></div>
        </div>
      </>
    )
  },
  {
    num: "06",
    title: "YOUR LIGHT MATTERS",
    text: <>Aura's journey is still beginning.<br /><br />She knows she can't solve every problem in the world.<br /><br />But she has learned something important:<br /><br /><span className="highlight-gold">One small light can help another light shine.</span></>,
    visualClass: "visual-ch6",
    imgSrc: "/assets/ch6.jpg",
    visualContent: (
      <>
        <div className="living-star star-ch6-main"></div>
        <div className="aurora-flow aurora-ch6"></div>
        <div className="drifting-stars mixed-stars"></div>
      </>
    )
  }
];

function OurStory() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.3 });

    const elements = document.querySelectorAll('.chapter, .final-message');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Timeline progress effect
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled through the container
      const scrolled = Math.max(0, windowHeight / 2 - top);
      const progress = Math.min(100, Math.max(0, (scrolled / height) * 100));
      
      const progressBar = document.querySelector('.timeline-progress');
      if (progressBar) {
        progressBar.style.height = `${progress}%`;
      }

      // Parallax effect
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        const visuals = document.querySelectorAll('.chapter-visual');
        visuals.forEach((visual) => {
          const rect = visual.getBoundingClientRect();
          const visualCenter = rect.top + rect.height / 2;
          const distance = visualCenter - (windowHeight / 2);
          // Very subtle parallax factor
          const yOffset = distance * 0.06;
          visual.style.setProperty('--parallax-y', `${yOffset}px`);
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="our-story-page">
      <div className="our-story-bg"></div>
      
      {/* Back to Home Button */}
      <Link to="/" className="global-back-btn">
        <span className="back-arrow">←</span> BACK TO HOME
      </Link>

      <div className="story-container">
        
        {/* Opening */}
        <section className="story-opening">
          <span className="eyebrow">THE BEGINNING</span>
          <h1 className="main-heading">Every Hero Has a Beginning.</h1>
          <p className="opening-text">
            Before she became the Heart-Bright Kid Hero, Aura was<br />
            just a kid who believed one small act of kindness could<br />
            change everything.
          </p>
        </section>

        {/* Timeline Chapters */}
        <section className="timeline-container" ref={containerRef}>
          <div className="timeline-line">
            <div className="timeline-progress"></div>
          </div>
          
          {chapters.map((ch, index) => (
            <div key={index} className="chapter">
              <div className="timeline-node"></div>
              
              <div className="chapter-content">
                <span className="chapter-number">CHAPTER {ch.num}</span>
                <h2 className="chapter-title">{ch.title}</h2>
                <p className="chapter-text">{ch.text}</p>
              </div>
              
              <div className={`chapter-visual ${ch.visualClass}`}>
                <img src={ch.imgSrc} alt={`Chapter ${ch.num} Visual`} className="chapter-img" />
                <div className="visual-overlays">
                  {ch.visualContent}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Final Message */}
        <section className="final-message">
          <h2 className="final-large-text">
            You don't have to be super<br />
            to make someone's world brighter.
          </h2>
          <p className="final-small-text">Every little light can make a difference.</p>
        </section>

      </div>
    </div>
  );
}

export default OurStory;
