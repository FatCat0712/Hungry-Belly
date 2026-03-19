import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="flex-grow-1 bg-light overflow-auto p-3">
        <Outlet />
      </main>
    </div>
  );
}
