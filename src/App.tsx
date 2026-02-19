// React imports
import { Route, Routes } from 'react-router-dom'

// Component imports
import Navbar from './components/navbar/Navbar'

// Page imports
import HomePage from './pages/home/HomePage'
import ProjectsPage from './pages/projects/ProjectsPage'
import AboutPage from './pages/about/AboutPage'
import ContactPage from './pages/contact/ContactPage'
import SkillsPage from './pages/skills/SkillsPage'

import './App.css'
function App() {

    return (
    <>
      <div className="app-container">
        <Navbar />

        {/* Add your routes and other components here */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/skills" element={<SkillsPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
