function Card({ className = '', children }) {
  return <section className={`ui-card ${className}`.trim()}>{children}</section>
}

export default Card
