import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container-page flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ServiceWale</p>
          <p>Trusted home services, repairs, installation and maintenance.</p>
        </div>
      </footer>
    </div>
  );
}
