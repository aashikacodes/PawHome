// Top menu bar. Links change depending on who is logged in.
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">PawHome</Link>

      <nav className="nav-links">
        <Link to="/">Find a pet</Link>

        {user?.role === "adopter" && <Link to="/my-applications">My applications</Link>}
        {user?.role === "shelter" && <Link to="/dashboard">Shelter dashboard</Link>}

        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn btn-small btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-small">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
