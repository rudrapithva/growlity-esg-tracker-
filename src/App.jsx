import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Calculator from './pages/Calculator'
import History from './pages/History'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Navigate } from 'react-router-dom'

// Admin Components
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminAccounts from './pages/admin/AdminAccounts'
import AdminCompliance from './pages/admin/AdminCompliance'
import AdminSettings from './pages/admin/AdminSettings'
import AdminLogin from './pages/admin/AdminLogin'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" />
  return children
}

const AdminRoute = ({ children }) => {
  const { adminAuth } = useAuth()
  if (!adminAuth) return <Navigate to="/main-access" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public auth route that does not use the Layout shell */}
          <Route path="/login" element={<Login />} />
          <Route path="/main-access" element={<AdminLogin />} />
          
          {/* Protected routes wrapped in the Layout shell */}
          <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/calculator" element={<ProtectedRoute><Layout><Calculator /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          
          {/* Dedicated Admin Portal Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="compliance" element={<AdminCompliance />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
