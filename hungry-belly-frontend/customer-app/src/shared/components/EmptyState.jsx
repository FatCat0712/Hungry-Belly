import { Link } from 'react-router-dom'

function EmptyState({ icon, title, description, actionText, actionLink }) {
  return (
    <div className="empty-state">
      <i className={`bi ${icon}`}></i>
      <h4>{title}</h4>
      <p>{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary mt-3">
          {actionText}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
