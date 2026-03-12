import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import DoctorSignup from './pages/DoctorSignup.jsx'
import DoctorLogin from './pages/DoctorLogin.jsx'
import PatientSignup from './pages/PatientSignup.jsx'
import PatientLogin from './pages/PatientLogin.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import DoctorsList from './pages/DoctorsList.jsx'
import ConsultationForm from './pages/ConsultationForm.jsx'
import DoctorProfile from './pages/DoctorProfile.jsx'
import DoctorConsultations from './pages/DoctorConsultations.jsx'
import PrescriptionPage from './pages/PrescriptionPage.jsx'
import PatientPrescriptions from './pages/PatientPrescriptions.jsx'
import NotFound from './pages/NotFound.jsx'
import { useAuth } from './hooks/useAuth.js'

function ProtectedRoute({ allowedRole, children }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return <Navigate to={allowedRole === 'doctor' ? '/doctor/login' : '/patient/login'} replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/doctor/signup" element={<DoctorSignup />} />
      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/doctors"
        element={
          <ProtectedRoute allowedRole="patient">
            <DoctorsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/consult/:doctorId"
        element={
          <ProtectedRoute allowedRole="patient">
            <ConsultationForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/consultations"
        element={
          <ProtectedRoute allowedRole="doctor">
            <DoctorConsultations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/prescriptions"
        element={
          <ProtectedRoute allowedRole="doctor">
            <PrescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/prescriptions"
        element={
          <ProtectedRoute allowedRole="patient">
            <PatientPrescriptions />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
