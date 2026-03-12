function ConsultationTable({ consultations = [] }) {
	if (!consultations.length) {
		return <p className="hero-copy">No consultations yet.</p>
	}

	return (
		<div className="table-wrap">
			<table className="simple-table">
				<thead>
					<tr>
						<th>Patient</th>
						<th>Illness history</th>
						<th>Recent surgery</th>
						<th>Allergies</th>
						<th>Transaction</th>
					</tr>
				</thead>
				<tbody>
					{consultations.map((item) => (
						<tr key={item._id}>
							<td>{item?.patient?.name}</td>
							<td>{item.currentIllnessHistory || item.symptoms}</td>
							<td>{item.recentSurgery || '-'}</td>
							<td>{item.allergies || '-'}</td>
							<td>{item.transactionId || '-'}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default ConsultationTable
