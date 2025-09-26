import React, { useState } from 'react';
import './ContactPage.css';

// --- Placeholder for an image of a phone/email icon, assuming it's imported in a global stylesheet or not used ---

const ContactPage: React.FC = () => {
    // State to manage form inputs
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Sending...');

        // In a real application, you would send this data to your backend API here.
        // For now, we simulate success and direct the user to the email.
        
        // --- SIMULATION ---
        setTimeout(() => {
            const subject = encodeURIComponent(`Query from ${formData.name}`);
            const body = encodeURIComponent(`Message: ${formData.message}\n\nEmail: ${formData.email}`);
            
            // Direct user to their email client (mailto link)
            window.location.href = `mailto:support@arogyapath.com?subject=${subject}&body=${body}`;

            setStatus('Thank you! Your message is ready in your email client. We will respond soon.');
            setFormData({ name: '', email: '', message: '' });
        }, 1500);
    };

    return (
        <div className="contact-page-container">
            <div className="contact-content-wrapper">
                <header className="contact-header">
                    <h1>Contact Our Team</h1>
                    <hr className="header-underline" />
                    <p className="header-subtext">
                        We would love to hear from you! Whether you have a question about our services, feedback on the application, or a partnership inquiry, please feel free to reach out using the form below.
                    </p>
                </header>

                <div className="contact-main-grid">
                    
                    {/* --- LEFT SIDE: CONTACT FORM --- */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <form onSubmit={handleSubmit} className="contact-form">
                            
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
                            <textarea name="message" placeholder="Your Message or Inquiry" value={formData.message} onChange={handleChange} rows={5} required></textarea>
                            
                            <button type="submit" className="submit-button" disabled={status.includes('Sending')}>
                                {status.includes('Sending') ? 'Sending...' : 'Submit Message'}
                            </button>

                            {status && <p className={`form-status ${status.includes('Thank you') ? 'success' : 'error'}`}>{status}</p>}
                        </form>
                    </div>

                    {/* --- RIGHT SIDE: INFO BOX --- */}
                    <div className="contact-info-section">
                        <div className="info-box">
                            <h3 className="info-title">Direct Contact Information</h3>
                            
                            <div className="contact-detail">
                                <span className="icon">✉️</span>
                                <p>
                                    **General Support**<br />
                                    <a href="mailto:support@arogyapath.com" className="contact-link">support@arogyapath.com</a>
                                </p>
                            </div>
                            
                            <div className="contact-detail">
                                <span className="icon">🤝</span>
                                <p>
                                    **Partnership Inquiries**<br />
                                    <a href="mailto:partnerships@arogyapath.com" className="contact-link">partnerships@arogyapath.com</a>
                                </p>
                            </div>
                            
                            <div className="info-promise">
                                <p>
                                    Our dedicated team typically responds within 1-2 business days. For urgent matters, please ensure you clearly state "URGENT" in your email subject.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;