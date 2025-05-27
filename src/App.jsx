import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import RecoverPasswordModal from './components/modals/RecoverPasswordModal';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './middlewares/PrivateRoute';
import './App.css'

function App() {
  return (
    <Router>
      <Header />
      
      <LoginModal />
      <RegisterModal />
      <RecoverPasswordModal />

      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Página inicial */}
        
        {/* Rotas Protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          } 
        />
      </Routes>

      <Footer />
    </Router>
  )
}

export default App;