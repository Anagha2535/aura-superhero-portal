import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import OurStory from './pages/OurStory'
import TalkToAura from './pages/TalkToAura'
import Powers from './pages/Powers'
import AurasWorld from './pages/AurasWorld'
import VideoIntro from './components/VideoIntro'

function AppRoutes({ introDone }) {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Force the app to open on Home page if intro is still playing
    if (!introDone && location.pathname !== '/') {
      navigate('/', { replace: true })
    }
  }, [introDone, location.pathname, navigate])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<OurStory />} />
        <Route path="/chat" element={<TalkToAura />} />
        <Route path="/powers" element={<Powers />} />
        <Route path="/auras-world" element={<AurasWorld />} />
      </Routes>
      {!introDone && <VideoIntro />}
    </>
  )
}

function App() {
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    const handleIntroFinished = () => setIntroDone(true)
    window.addEventListener('videoIntroFinished', handleIntroFinished)
    return () => window.removeEventListener('videoIntroFinished', handleIntroFinished)
  }, [])

  return (
    <Router>
      <AppRoutes introDone={introDone} />
    </Router>
  )
}

export default App
