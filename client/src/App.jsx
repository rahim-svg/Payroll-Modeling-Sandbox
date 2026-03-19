/**
 * @file App.jsx
 * @description Root component. Sets up routing with protected routes.
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
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bulk-run" element={<BulkRunPage />} />
            <Route path="/single-employee" element={<SingleEmployeePage />} />
            <Route path="/results/:runId" element={<ResultsPage />} />
            <Route path="/template" element={<TemplatePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
