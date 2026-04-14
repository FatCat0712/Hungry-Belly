import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../navigation/Sidebar";
import "../styles/AdminLayout.css";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="d-flex vh-100 overflow-hidden">
      {mobileOpen && (
        <div
          className="admin-sidebar-backdrop d-md-none"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className="flex-grow-1 bg-light d-flex flex-column overflow-hidden position-relative"
        style={{ minWidth: 0 }}
      >
        {/* Mobile topbar — only visible below md */}
        <div className="d-flex d-md-none align-items-center gap-2 px-3 py-2 bg-white border-bottom shadow-sm flex-shrink-0">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list fs-5" />
          </button>
          <span className="fw-semibold">Admin Panel</span>
        </div>
        <div className="flex-grow-1 overflow-auto p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
