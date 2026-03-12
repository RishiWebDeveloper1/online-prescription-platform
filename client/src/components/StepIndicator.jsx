function StepIndicator({ step }) {
	return (
		<div className="step-indicator">
			{[1, 2, 3].map((number) => (
				<div className={`step-pill ${step === number ? 'step-pill--active' : ''}`} key={number}>
					Step {number}
				</div>
			))}
		</div>
	)
}

export default StepIndicator
