import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
import QueueDisplayPage from './pages/QueueDisplayPage';
import './App.css'

const MainLayout = () => {
  return (
    <>
      <Header />
      <>
        <Outlet />
      </>
      <Footer />
    </>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoginModal />
        <RegisterModal />
        <RecoverPasswordModal />
        <ProfileUserModal />
        <ProfileAdminModal />

        <Routes>
          <Route path="/display/:uuid" element={<QueueDisplayPage />} />

          <Route element={<MainLayout />}>
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

          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;