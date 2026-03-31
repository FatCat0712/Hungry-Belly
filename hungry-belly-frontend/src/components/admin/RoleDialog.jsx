import React from "react";
import RoleForm from "./RoleForm";

const RoleDialog = ({ open, onClose, selectedRole }) => {
  if (!open) return null;

  return (
    <>
      <div
        className="modal-backdrop fade show"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1040,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <div
        className="modal fade show"
        tabIndex="-1"
        style={{
          display: "block",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1050,
          width: "100%",
          height: "100%",
          overflow: "auto",
          overflowY: "auto",
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg" style={{ margin: "auto" }}>
          <div className="modal-content" style={{ backgroundColor: "#ffffff" }}>
            <RoleForm onClose={onClose} selectedRole={selectedRole} />
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleDialog;
