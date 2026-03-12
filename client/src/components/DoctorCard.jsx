import ConsultButton from './ConsultButton.jsx'
import { getAvatarUrl } from '../utils/api.js'
import Card from './Card.jsx'

function DoctorCard({ doctor }) {
	return (
		<Card className="doctor-card">
			<img className="doctor-card__avatar" src={getAvatarUrl('doctor', doctor._id)} alt={doctor.name} />
			<div>				
			<h3>{doctor.name}</h3>
			<p>Specialist: {doctor.specialty}</p>
			<p>Exp: {doctor.yearsOfExperience} Years</p>
			</div>
			<ConsultButton doctorId={doctor._id} />
		</Card>
	)
}

export default DoctorCard
