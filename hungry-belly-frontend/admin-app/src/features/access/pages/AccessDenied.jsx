import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="text-center">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
          style={{
            width: 72,
            height: 72,
            backgroundColor: "rgba(220, 53, 69, 0.12)",
          }}
        >
          <i
            className="bi bi-shield-lock fs-2 text-danger"
            aria-hidden="true"
          ></i>
        </div>

        <h1 className="h3 mb-2">Access Denied</h1>
        <p className="text-muted mb-4">
          You do not have permission to access this page. Contact an
          administrator if you think this is a mistake.
        </p>

        <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
          <Link to="/" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
