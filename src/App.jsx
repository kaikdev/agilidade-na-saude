import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Rota para a página inicial */}
        
      </Routes>

      <Footer />
    </Router>
  )
}

export default App;