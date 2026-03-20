import React from "react";
import UserForm from "./UserForm";

const UserDialog = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="dialog">
      <UserForm onClose={onClose} />

      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default UserDialog;
