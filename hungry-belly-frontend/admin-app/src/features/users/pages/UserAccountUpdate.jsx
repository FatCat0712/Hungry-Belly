import { useContext } from "react";

import { AuthContext } from "../../auth/context/auth-context";
import AccountForm from "../components/AccountForm";

const UserAccountUpdate = () => {
  const { user: loggedInUser } = useContext(AuthContext);

  return (
    <div className="container-fluid px-0">
      <div className="mb-3">
        <small className="text-uppercase text-secondary">Admin / Users</small>
        <h1 className="h3 mb-1 text-center">Edit Account</h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <AccountForm loggedInUser={loggedInUser} />
        </div>
      </div>
    </div>
  );
};

export default UserAccountUpdate;
