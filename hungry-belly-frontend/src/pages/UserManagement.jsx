import axios from "axios";
import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/users");
        const data = response.data.data;
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, []);

  return (
    <div className="container-fluid px-0">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <small className="text-uppercase text-secondary">Admin</small>
          <h1 className="h3 mb-1">User Management</h1>
          <p className="text-muted mb-0">
            Manage platform users, roles, and account status.
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2">
            <i className="bi bi-filter"></i> Filters
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2">
            <i className="bi bi-plus-lg"></i> Add User
          </button>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <small className="text-muted">Total Users</small>
                  <h5 className="mb-0">{users.length}</h5>
                </div>
                <i className="bi bi-people-fill fs-4 text-primary"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <small className="text-muted">Active Users</small>
                  <h5 className="mb-0">3</h5>
                </div>
                <i className="bi bi-check-circle-fill fs-4 text-success"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <small className="text-muted">Pending Approvals</small>
                  <h5 className="mb-0">1</h5>
                </div>
                <i className="bi bi-clock-fill fs-4 text-warning"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="card-title mb-0">All Users</h5>
              <small className="text-muted">Sorted by newest first</small>
            </div>
            <div className="input-group" style={{ maxWidth: 280 }}>
              <span className="input-group-text" id="search-addon">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                aria-label="Search users"
                aria-describedby="search-addon"
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40 }}
                        >
                          {user.photo || user.name.charAt(0)}
                        </div>
                        <div>{user.name}</div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      {user.roles.map((role) => (
                        <span className="badge bg-primary">{role}</span>
                      ))}
                    </td>
                    <td>
                      <span
                        className={`badge ${user.enabled ? "bg-success" : "bg-secondary"}`}
                      >
                        {user.enabled ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-secondary me-1">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
