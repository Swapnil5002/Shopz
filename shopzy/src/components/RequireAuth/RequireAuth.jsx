import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function RequireAuth({ children }) {
  const user = useSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default RequireAuth
