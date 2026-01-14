import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full bg-black text-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Logo */}
        <Link to="/" className="font-bold text-lg text-center sm:text-left">
          Vibe
        </Link>

        {/* Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-4 items-center">
          <Link to="/">Home</Link>

          {!token && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="text-green-400">
                Register
              </Link>
            </>
          )}

          {token && role === "user" && (
            <>
              <Link to="/reserve">Reserve</Link>
              <Link to="/my-reservations">My Reservations</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {token && role === "admin" && (
            <>
              <Link to="/reserve">Reserve</Link>
              <Link to="/admin">Admin Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
