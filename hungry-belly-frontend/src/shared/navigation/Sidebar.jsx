import { useContext } from "react";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../features/auth/context/auth-context";

const Sidebar = ({ isOpen, setIsOpen, mobileOpen, setMobileOpen }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const userName = user?.firstName + " " + user?.lastName || "Admin User";
  const userRoles = Array.isArray(user?.roles)
    ? user.roles
        .map((role) => (typeof role === "string" ? role : role?.name))
        .filter(Boolean)
    : [];
  const initials = userName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const width = isOpen ? 240 : 72;

  let navItems = [
    { path: "/", label: "Dashboard", icon: "speedometer2" },
    { path: "/users", label: "Users", icon: "people" },
    { path: "/roles", label: "Roles", icon: "shield-lock" },
    { path: "/categories", label: "Categories", icon: "grid" },
    { path: "/foods/fd-204", label: "Foods", icon: "egg-fried" },
    { path: "/orders", label: "Orders", icon: "receipt" },
    { path: "/restaurants", label: "Restaurants", icon: "house" },
  ];

  if (userRoles.includes("ROLE_STAFF")) {
    navItems = navItems.filter(
      (item) => item.path !== "/users" && item.path !== "/roles",
    ); // Hide sidebar for staff
  }

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <aside
      className={`d-flex flex-column border-end flex-shrink-0 admin-sidebar${mobileOpen ? " mobile-open" : ""}`}
      style={{
        width,
        backgroundColor: "rgb(224, 57, 74)",
        color: "#fff",
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.11)",
        transition: "width 220ms ease",
        minWidth: 72,
        flexShrink: 0,
      }}
    >
      <div
        className="d-flex align-items-center justify-content-between p-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.18)" }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            className="bg-white rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 30, height: 30 }}
          >
            <img src={logo} alt="logo" style={{ width: 20, height: 20 }} />
          </div>
          {isOpen && (
            <div>
              <h5 className="mb-0" style={{ fontWeight: 600, color: "#fff" }}>
                Hungry Belly
              </h5>
              <small style={{ color: "rgba(255,255,255,0.85)" }}>
                Admin Panel
              </small>
            </div>
          )}
        </div>

        {/* Mobile: show X close button */}
        <button
          className="btn btn-sm btn-light p-1 d-flex d-md-none"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
          style={{ width: 28, height: 28 }}
        >
          <i className="bi bi-x" />
        </button>

        {/* Desktop: show collapse toggle */}
        <button
          className="btn btn-sm btn-light p-1 d-none d-md-flex"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle sidebar"
          style={{ width: 28, height: 28 }}
        >
          <i className={`bi bi-chevron-${isOpen ? "left" : "right"}`} />
        </button>
      </div>

      <nav
        className="nav flex-column flex-grow-1 p-2 gap-2"
        style={{ backgroundColor: "rgba(0,0,0,0.03)" }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center rounded ${
                isActive ? "bg-white text-dark fw-bold" : "text-white"
              }`
            }
            style={{
              padding: "0.55rem 0.65rem",
              transition: "background-color 160ms ease",
            }}
          >
            <i className={`bi bi-${item.icon} me-2`} />
            {isOpen && <span style={{ fontSize: 14 }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div
        className="p-3"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.22)",
          backgroundColor: "rgba(0,0,0,0.08)",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {isOpen ? (
          <>
            <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
              <Link
                className="d-flex align-items-center justify-content-between text-decoration-none text-white gap-4"
                to="/profile"
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: 34,
                    height: 34,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  {initials || "AD"}
                </div>
                <div className="d-flex flex-column gap-2">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {userName}
                  </span>
                  {userRoles.length > 0 && (
                    <div className="d-flex flex-wrap gap-1">
                      {userRoles.slice(0, 2).map((role) => (
                        <span
                          key={role}
                          className="rounded-pill px-2 py-1"
                          style={{
                            fontSize: 11,
                            lineHeight: 1,
                            backgroundColor: "rgba(255,255,255,0.18)",
                            color: "#fff",
                          }}
                        >
                          {role.replace("ROLE_", "")}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
              <button
                className="btn btn-sm"
                style={{ color: "rgba(255,255,255,0.85)" }}
                title="Logout"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.2)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-center" title={userName}>
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: 32,
                height: 32,
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
                fontSize: 11,
              }}
            >
              {initials || "AD"}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
