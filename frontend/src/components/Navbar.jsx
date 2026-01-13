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
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg">
          Vibe 
        </Link>

        {/* Links */}
        <div className="space-x-6 flex items-center">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>

          {/* Guest */}
          {!token && (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link
                to="/register"
                className="text-green-400 hover:text-green-300"
              >
                Register
              </Link>
            </>
          )}

          {/* User */}
          {token && role === "user" && (
            <>
              <Link to="/reserve" className="hover:text-gray-300">
                Reserve
              </Link>

              <Link to="/my-reservations" className="hover:text-gray-300">
                My Reservations
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {/* Admin */}
          {token && role === "admin" && (
            <>
            <Link to="/reserve" className="hover:text-gray-300">
      Reserve
    </Link>
              <Link to="/admin" className="hover:text-gray-300">
                Admin Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
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
