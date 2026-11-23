
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : 'User';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <span className="navbar-brand fw-bold">
          Team Directory
        </span>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <div className="d-flex align-items-center gap-2 text-white">
              <img
                src={user.image}
                alt={fullName}
                width="38"
                height="38"
                className="rounded-circle"
              />

              <div className="d-none d-sm-block">
                <div className="fw-semibold">{fullName}</div>
                <small>{user.email}</small>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
