/**
 * @file App.jsx
 * @description Root application component.
 *              Sets up React Router with protected and public routes.
 *              All routes requiring authentication are wrapped in ProtectedRoute.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import BulkRunPage from '@/pages/BulkRunPage'
import SingleEmployeePage from '@/pages/SingleEmployeePage'
import ResultsPage from '@/pages/ResultsPage'
import TemplatePage from '@/pages/TemplatePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route — login page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes — require valid JWT token */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bulk-run" element={<BulkRunPage />} />
            <Route path="/single-employee" element={<SingleEmployeePage />} />
            <Route path="/results/:runId" element={<ResultsPage />} />
            <Route path="/template" element={<TemplatePage />} />
          </Route>

          {/* Catch-all — redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
