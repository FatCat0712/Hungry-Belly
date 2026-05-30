import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUser } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { loginUser } = useLoginUser();

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await loginUser(form);
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="register-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-7 col-xl-6">
            <div className="register-card">
              <div className="register-card-header">
                <h1 className="register-title mb-2">Welcome Back</h1>
                <p className="register-subtitle mb-0">
                  Sign in with your email and password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="row g-3">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-4">
                  <p className="mb-0 text-muted small">
                    No account? <Link to="/register">Create one</Link>
                  </p>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing in..." : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
