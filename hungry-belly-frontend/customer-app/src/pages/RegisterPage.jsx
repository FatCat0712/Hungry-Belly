import { useState } from "react";
import { assets } from "../assets/assets";

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    photo: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const selectedFile = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: selectedFile }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Registration form submitted");
  };

  return (
    <section className="register-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-9 col-xl-8">
            <div className="register-card">
              <div className="register-card-header">
                <h1 className="register-title mb-2">Create User Account</h1>
                <p className="register-subtitle mb-0">
                  Fill in the details below to register a new user profile.
                </p>
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
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
                      placeholder="jane.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="firstName"
                      className="form-label fw-semibold"
                    >
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      className="form-control"
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="lastName"
                      className="form-label fw-semibold"
                    >
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      className="form-control"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
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
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label fw-semibold"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label fw-semibold"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="text"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold d-block">
                      Photo
                    </label>
                    <div className="register-photo-row">
                      <input
                        id="photo"
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </div>

                    <div className="form-check mt-1 ">
                      <label className="form-label" htmlFor="useDefault">
                        <img
                          src={formData.photo ? formData.photo : assets.upload}
                          alt=""
                          width={98}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button type="submit" className="btn btn-primary px-4">
                    Register User
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

export default RegisterPage;
