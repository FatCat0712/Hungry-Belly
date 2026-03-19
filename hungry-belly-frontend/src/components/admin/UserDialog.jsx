import React from "react";
import UserForm from "./UserForm";

const UserDialog = ({ open, onClose, onSubmit, initialData }) => {
  if (!open) return null;

  return (
    <div className="dialog">
      <h2>{initialData ? "Edit User" : "Add User"}</h2>
      <UserForm
        initial={initialData}
        onSubmit={(data) => {
          onSubmit(data);
          onClose();
        }}
        onClose={onClose}
      />

      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default UserDialog;
