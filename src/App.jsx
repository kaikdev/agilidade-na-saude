import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import RecoverPasswordModal from './components/modals/RecoverPasswordModal';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Header />
      
      <LoginModal />
      <RegisterModal />
      <RecoverPasswordModal />

      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Rota para a página inicial */}
        
      </Routes>

      <Footer />
    </Router>
  )
}

export default App;