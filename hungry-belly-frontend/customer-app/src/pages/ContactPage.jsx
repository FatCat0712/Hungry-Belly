import { useState } from 'react'

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="py-5" style={{ backgroundColor: '#F8F9FA', minHeight: '100vh' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <h1 className="section-title text-center mb-4">Contact Us</h1>
            <p className="section-subtitle text-center">
              Have questions? We would love to hear from you. Send us a message!
            </p>

            <div className="row g-4 mt-4">
              {/* Contact Info */}
              <div className="col-lg-4">
                <div className="card p-4 h-100">
                  <h5 className="fw-bold mb-4">Get in Touch</h5>
                  
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: 'rgba(242, 107, 91, 0.1)'
                        }}
                      >
                        <i className="bi bi-geo-alt" style={{ color: '#F26B5B', fontSize: '1.25rem' }}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Address</h6>
                        <small className="text-muted">123 Food Street, City Center</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: 'rgba(242, 107, 91, 0.1)'
                        }}
                      >
                        <i className="bi bi-telephone" style={{ color: '#F26B5B', fontSize: '1.25rem' }}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Phone</h6>
                        <small className="text-muted">+1 (555) 123-4567</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: 'rgba(242, 107, 91, 0.1)'
                        }}
                      >
                        <i className="bi bi-envelope" style={{ color: '#F26B5B', fontSize: '1.25rem' }}></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold">Email</h6>
                        <small className="text-muted">support@hungrybelly.com</small>
                      </div>
                    </div>
                  </div>

                  <hr />

                  <h6 className="fw-bold mb-3">Business Hours</h6>
                  <ul className="list-unstyled mb-0 text-muted">
                    <li className="mb-2">
                      <i className="bi bi-clock me-2"></i>
                      Mon - Fri: 9:00 AM - 10:00 PM
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-clock me-2"></i>
                      Sat - Sun: 10:00 AM - 11:00 PM
                    </li>
                    <li>
                      <i className="bi bi-headset me-2"></i>
                      24/7 Customer Support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Contact Form */}
              <div className="col-lg-8">
                <div className="card p-4">
                  <h5 className="fw-bold mb-4">Send us a Message</h5>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold">Subject</label>
                        <select
                          className="form-select"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select a subject</option>
                          <option value="general">General Inquiry</option>
                          <option value="order">Order Issue</option>
                          <option value="feedback">Feedback</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-bold">Message</label>
                        <textarea
                          className="form-control"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          required
                        ></textarea>
                      </div>
                      <div className="col-12">
                        <button type="submit" className="btn btn-primary px-5">
                          <i className="bi bi-send me-2"></i>
                          Send Message
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-5">
              <h2 className="section-title text-center mb-4">Frequently Asked Questions</h2>
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq1"
                    >
                      How do I track my order?
                    </button>
                  </h2>
                  <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      You can track your order in real-time through the Orders page. You will receive updates 
                      via SMS and email at each stage of delivery.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq2"
                    >
                      What are the delivery hours?
                    </button>
                  </h2>
                  <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Delivery hours vary by restaurant. Most restaurants deliver from 10:00 AM to 10:00 PM, 
                      but some offer late-night delivery. Check individual restaurant pages for exact hours.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header">
                    <button 
                      className="accordion-button collapsed" 
                      type="button" 
                      data-bs-toggle="collapse" 
                      data-bs-target="#faq3"
                    >
                      Can I cancel my order?
                    </button>
                  </h2>
                  <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Orders can be cancelled within 2 minutes of placing them. After that, the restaurant 
                      may have already started preparing your food. Contact support for assistance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
