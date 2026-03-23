import React from "react";
import UserForm from "./UserForm";

const UserDialog = ({ open, onClose, selectedUser }) => {
  if (!open) return null;

  return (
    <div className="dialog">
      <UserForm onClose={onClose} selectedUser={selectedUser} />
    </div>
  );
};

export default UserDialog;
