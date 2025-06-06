import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './middlewares/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginModal from './components/modals/LoginModal';
import RegisterModal from './components/modals/RegisterModal';
import RecoverPasswordModal from './components/modals/RecoverPasswordModal';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardUser from './pages/user/DashboardUser';
import ProfileUserModal from './components/modals/ProfileUserModal';
import ProfileAdminModal from './components/modals/ProfileAdminModal';

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

          <Route path="/admin/dashboard" element={
            <PrivateRoute role="admin">
              <DashboardAdmin />
            </PrivateRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute role="user">
              <DashboardUser />
            </PrivateRoute>
          } />
        </Routes>
        
        <ProfileUserModal />
        <ProfileAdminModal />

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;