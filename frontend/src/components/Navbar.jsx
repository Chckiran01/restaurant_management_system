import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

const commonLinks = (
  <>
    <Link to="/" onClick={() => setOpen(false)} className="block py-2">
      Home
    </Link>

    <Link to="/reserve" onClick={() => setOpen(false)} className="block py-2">
      Reserve
    </Link>

    {token && role === "user" && (
      <Link
        to="/my-reservations"
        onClick={() => setOpen(false)}
        className="block py-2"
      >
        My Reservations
      </Link>
    )}

    {token && role === "admin" && (
      <Link
        to="/admin"
        onClick={() => setOpen(false)}
        className="block py-2"
      >
        Admin Dashboard
      </Link>
    )}

    {token && (
      <button
        onClick={handleLogout}
        className="mt-2 bg-red-600 px-4 py-2 rounded w-full text-left"
      >
        Logout
      </button>
    )}
  </>
);

  return (
    <nav className="fixed top-0 w-full bg-black text-white z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold">
          Vibe
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/">Home</Link>
          <Link to="/reserve">Reserve</Link>

          {token && role === "admin" && (
            <Link to="/admin">Admin Dashboard</Link>
          )}

          {token ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="text-green-400">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-black px-6 pb-4 border-t border-gray-700">
          {!token ? (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setOpen(false)}
                className="block py-2 text-green-400"
              >
                Register
              </Link>
            </>
          ) : (
            commonLinks
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
