import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import RecoverPasswordModal from './components/modals/RecoverPasswordModal';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './middlewares/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />

        <LoginModal />
        <RegisterModal />
        <RecoverPasswordModal />

        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>} 
          />
        </Routes>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;