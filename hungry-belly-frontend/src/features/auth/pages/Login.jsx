import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import assets from "../../../shared/assets/assets";

import "../../../shared/styles/Login.css";
import { AuthContext } from "../context/auth-context";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      await loginUser(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please verify your credentials.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-glow login-glow-left" aria-hidden="true" />
      <div className="login-glow login-glow-right" aria-hidden="true" />

      <section className="login-card shadow-lg">
        <div className="text-center mb-4">
          <div className="login-icon-wrap mx-auto mb-3">
            <img
              src={assets.logo}
              alt="Hungry Belly"
              className="login-app-icon"
            />
          </div>
          <p className="login-kicker mb-2">Hungry Belly Admin</p>
          <h1 className="login-title mb-1">Sign in to continue</h1>
          <p className="login-subtitle mb-0">
            Manage restaurants, orders, users, and roles in one place.
          </p>
        </div>
        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3">
            <label htmlFor="email" className="form-label login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="form-control login-input"
              placeholder="name@company.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-control login-input"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-end align-items-center mb-4">
            <button type="button" className="btn btn-link p-0 login-link">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn login-submit w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Login;
