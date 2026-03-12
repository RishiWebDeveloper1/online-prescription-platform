import { Link } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader.jsx'

function NotFound() {
	return (
		<main className="page-shell">
			<section className="auth-card compact-card">
				<SectionHeader eyebrow="404" title="Page not found" subtitle="The route you requested does not exist in this portal." />
				<Link className="btn btn--primary" to="/">Go home</Link>
			</section>
		</main>
	)
}

export default NotFound
