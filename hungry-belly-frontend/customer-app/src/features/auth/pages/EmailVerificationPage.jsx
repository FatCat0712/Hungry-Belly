import { Link, useLocation } from "react-router-dom";

function EmailVerificationPage() {
  const location = useLocation();
  const email = location.state?.email || "your email address";
  const firstName = location.state?.firstName || "there";

  return (
    <section
      className="py-5"
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(242, 107, 91, 0.18), transparent 35%), linear-gradient(180deg, #fff8f6 0%, #f8f9fa 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            <div
              className="card border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: "28px" }}
            >
              <div
                className="p-4 p-md-5 text-center text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #F26B5B 0%, #F5A35F 100%)",
                }}
              >
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{
                    width: "92px",
                    height: "92px",
                    background: "rgba(255, 255, 255, 0.16)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <i className="bi bi-envelope-check fs-1"></i>
                </div>
                <h1 className="fw-bold mb-2">Check your mailbox</h1>
                <p className="mb-0 text-white-75">
                  We sent a verification email so you can activate your account.
                </p>
              </div>

              <div className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <span className="badge rounded-pill text-bg-light px-3 py-2">
                    Verification email sent
                  </span>
                  <h2 className="h4 fw-bold mt-3 mb-2">Welcome, {firstName}</h2>
                  <p className="text-muted mb-0">
                    Please open <strong>{email}</strong> and click the link in
                    the email to finish creating your account.
                  </p>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="h-100 p-3 rounded-4 bg-light border text-center">
                      <i className="bi bi-inbox fs-3 text-danger"></i>
                      <p className="fw-semibold mb-1 mt-2">Open inbox</p>
                      <small className="text-muted">
                        Look for a message from Hungry Belly.
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="h-100 p-3 rounded-4 bg-light border text-center">
                      <i className="bi bi-cursor fs-3 text-danger"></i>
                      <p className="fw-semibold mb-1 mt-2">Tap the button</p>
                      <small className="text-muted">
                        Click the verification link inside the email.
                      </small>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="h-100 p-3 rounded-4 bg-light border text-center">
                      <i className="bi bi-bag-check fs-3 text-danger"></i>
                      <p className="fw-semibold mb-1 mt-2">Start ordering</p>
                      <small className="text-muted">
                        Return here once your account is active.
                      </small>
                    </div>
                  </div>
                </div>

                <div className="alert alert-warning border-0 rounded-4 mb-4">
                  <div className="d-flex gap-3 align-items-start">
                    <i className="bi bi-exclamation-triangle-fill fs-4"></i>
                    <div>
                      <h6 className="fw-bold mb-1">Didn\'t get the email?</h6>
                      <p className="mb-0 small">
                        Check spam or promotions, then try registering again if
                        the message still doesn\'t arrive.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link to="/register" className="btn btn-outline-primary px-4">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to register
                  </Link>
                  <Link to="/" className="btn btn-primary px-4">
                    <i className="bi bi-house-door me-2"></i>
                    Go to home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailVerificationPage;
