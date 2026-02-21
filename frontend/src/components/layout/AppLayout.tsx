import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";
import Brand from "./Brand";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <Brand />

        <div className="header-group">
          <nav className="nav-links" aria-label="Dashboard navigation">
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
            >
              Profile
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
            >
              Orders
            </NavLink>
          </nav>

          <div className="header-user">{user?.email}</div>

          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      <main className="app-main">
        <section className="app-canvas">
          <div className="page-wrap">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
