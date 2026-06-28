import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/servicemen", label: "Find Servicemen" },
  { to: "/booking", label: "Book Service", protected: true },
  { to: "/bookings", label: "History", protected: true },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white">
            SW
          </span>
          ServiceWale
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks
            .filter((link) => !link.protected || isAuthenticated)
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 sm:inline-flex"
              >
                {user?.name || "Profile"}
              </Link>
              <button onClick={handleLogout} className="btn-secondary py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary py-2">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-2">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="container-page flex gap-2 overflow-x-auto pb-3 lg:hidden">
        {navLinks
          .filter((link) => !link.protected || isAuthenticated)
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
      </div>
    </header>
  );
}
