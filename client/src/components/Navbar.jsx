import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getAvatarUrl } from '../utils/api.js'

function Navbar() {
	const navigate = useNavigate()
	const location = useLocation()
	const { user, logout } = useAuth()

	if (!user) {
		return null
	}

	const doctorLinks = [
		{ to: '/doctor/dashboard', label: 'Dashboard' },
		{ to: '/doctor/profile', label: 'Profile' },
		{ to: '/doctor/consultations', label: 'Consultations' },
		{ to: '/doctor/prescriptions', label: 'Prescriptions' },
	]

	const patientLinks = [
		{ to: '/patient/dashboard', label: 'Dashboard' },
		{ to: '/patient/doctors', label: 'Doctors' },
		{ to: '/patient/prescriptions', label: 'Prescriptions' },
	]

	const links = user.role === 'doctor' ? doctorLinks : patientLinks

	const onLogout = () => {
		logout()
		navigate('/')
	}

	return (
		<header className={`app-navbar app-navbar--${user.role}`}>
			<div className="app-navbar__left">
				<Link className="brand-link" to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}>
					Online Prescription
				</Link>
				<nav className="app-navbar__links">
					{links.map((item) => (
						<Link
							key={item.to}
							to={item.to}
							className={`nav-link ${location.pathname === item.to ? 'nav-link--active' : ''}`}
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>

			<div className="app-navbar__user">
				<img className="app-navbar__avatar" src={getAvatarUrl(user.role, user.id)} alt={user.name} />
				<div className="app-navbar__meta">
					<strong>{user.name}</strong>
					<span className="role-badge">{user.role === 'doctor' ? 'Doctor' : 'Patient'}</span>
				</div>
				<button className="secondary-button" type="button" onClick={onLogout}>Logout</button>
			</div>
		</header>
	)
}

export default Navbar
