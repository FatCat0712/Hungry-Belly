import React from "react";
import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";

const navItems = [
  { path: "/", label: "Dashboard", icon: "speedometer2" },
  { path: "/users", label: "Users", icon: "people" },
  { path: "/orders", label: "Orders", icon: "receipt" },
  { path: "/restaurants", label: "Restaurants", icon: "house" },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const width = isOpen ? 240 : 72;
  return (
    <aside
      className="d-flex flex-column border-end"
      style={{
        width,
        backgroundColor: "rgb(224, 57, 74)",
        color: "#fff",
        boxShadow: "2px 0 12px rgba(0, 0, 0, 0.11)",
        transition: "width 220ms ease",
        minWidth: 72,
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

        <button
          className="btn btn-sm btn-light p-1"
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
          borderTop: "1px solid rgba(255,255,255,0.18)",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        {isOpen ? (
          "Logged in as Admin"
        ) : (
          <i className="bi bi-person-circle fs-5"></i>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
