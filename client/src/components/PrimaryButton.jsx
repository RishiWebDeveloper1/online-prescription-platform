function PrimaryButton({ children, type = 'button', disabled, onClick, variant = 'primary' }) {
  const className = variant === 'secondary' ? 'btn btn--secondary' : 'btn btn--primary'

  return (
    <button className={className} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

export default PrimaryButton
