import { useNavigate } from 'react-router-dom'
import PrimaryButton from './PrimaryButton.jsx'

function ConsultButton({ doctorId }) {
	const navigate = useNavigate()

	return (
		<PrimaryButton onClick={() => navigate(`/consult/${doctorId}`)}>
			Consult
		</PrimaryButton>
	)
}

export default ConsultButton
