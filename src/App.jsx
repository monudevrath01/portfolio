import React, { useState, useEffect } from "react";
import "./App.css";
import profileImg from "./assets/profile.jpg";

function App() {
  // Navbar toggle state for mobile
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  // Tracking active navigation section for indicator underline
  const [activeSection, setActiveSection] = useState("home");

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  // Handle active link tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "resume", "skills", "projects", "contact"];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setFormSubmitted(false), 5000);
    }
  };

  return (
    <div className="bg-primary-theme">
      {/* Sleek Floating Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top custom-navbar">
        <div className="container">
          <a className="brand-logo" href="#home" id="nav-logo" onClick={() => setIsNavExpanded(false)}>
            Portfolio
          </a>
          <button
            className="navbar-toggler border-0"
            type="button"
            aria-label="Toggle navigation"
            id="nav-toggler-btn"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse justify-content-end ${isNavExpanded ? "show" : ""}`} id="navbarNav">
            <div className="navbar-nav">
              <a 
                className={`nav-link-custom ${activeSection === "home" ? "active" : ""}`} 
                href="#home" 
                id="link-home" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("home"); }}
              >
                Home
              </a>
              <a 
                className={`nav-link-custom ${activeSection === "about" ? "active" : ""}`} 
                href="#about" 
                id="link-about" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("about"); }}
              >
                About
              </a>
              <a 
                className={`nav-link-custom ${activeSection === "resume" ? "active" : ""}`} 
                href="#resume" 
                id="link-resume" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("resume"); }}
              >
                Resume
              </a>
              <a 
                className={`nav-link-custom ${activeSection === "skills" ? "active" : ""}`} 
                href="#skills" 
                id="link-skills" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("skills"); }}
              >
                Skills
              </a>
              <a 
                className={`nav-link-custom ${activeSection === "projects" ? "active" : ""}`} 
                href="#projects" 
                id="link-projects" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("projects"); }}
              >
                Projects
              </a>
              <a 
                className={`nav-link-custom ${activeSection === "contact" ? "active" : ""}`} 
                href="#contact" 
                id="link-contact" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("contact"); }}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="container">
          <div className="row align-items-center">
            {/* Hero Text Details */}
            <div className="col-lg-7 text-start order-2 order-lg-1">
              <h1 className="hero-subtitle">
                Hi, I'm <span className="gradient-text">Monu</span>
              </h1>
              <h2 className="hero-role">MERN Stack Developer</h2>
              <p className="hero-desc">
                Specializing in building robust, high-performance, and scalable full-stack web applications using MongoDB, Express.js, React.js, and Node.js. Let's create something amazing together.
              </p>
              
              <div className="d-flex flex-wrap gap-3 mt-4">
                <a href="#contact" className="btn btn-pill-solid" id="hero-btn-hire">
                  Hire Me
                </a>
                <a href="#projects" className="btn btn-pill-outline" id="hero-btn-work">
                  View Work
                </a>
              </div>

              {/* Social Icons matching the Rehana screenshot */}
              <div className="social-icons-container" id="hero-social-links">
                <a 
                  href="https://github.com/monudevrath01" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-circle-btn" 
                  id="hero-social-github"
                  aria-label="GitHub Profile"
                >
                  <i className="bi bi-github"></i>
                </a>
                <a 
                  href="http://www.linkedin.com/in/monudevrath" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="social-circle-btn" 
                  id="hero-social-linkedin"
                  aria-label="LinkedIn Profile"
                >
                  <i className="bi bi-linkedin"></i>
                </a>
                <a 
                  href="mailto:monudevrath2003@gmail.com" 
                  className="social-circle-btn" 
                  id="hero-social-email"
                  aria-label="Email Address"
                >
                  <i className="bi bi-envelope-fill"></i>
                </a>
                <a 
                  href="/resume.pdf" 
                  download="Monu_Devrath_Resume.pdf"
                  className="social-circle-btn" 
                  id="hero-social-resume"
                  aria-label="Download Resume"
                  title="Download Resume PDF"
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                </a>
              </div>
            </div>

            {/* Profile Avatar inside clean circular frame */}
            <div className="col-lg-5 order-1 order-lg-2 mb-5 mb-lg-0">
              <div className="avatar-wrapper" id="profile-avatar-frame">
                <div className="avatar-glow"></div>
                <div className="avatar-circle-frame">
                  <div className="avatar-circle-inner">
                    <img src={profileImg} alt="Monu Devrath Avatar" className="avatar-img-rehana" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section className="about-section" id="about">
        <div className="container">
          <div className="row">
            {/* Left Column: Services Timeline */}
            <div className="col-lg-5 text-start order-2 order-lg-1">
              <div className="services-timeline" id="about-services-timeline">
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-icon-box">
                      <i className="bi bi-code-slash"></i>
                    </div>
                    <h3 className="timeline-title">Frontend Engineering (React)</h3>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-icon-box">
                      <i className="bi bi-cpu"></i>
                    </div>
                    <h3 className="timeline-title">Backend & REST APIs (Node/Express)</h3>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-icon-box">
                      <i className="bi bi-database"></i>
                    </div>
                    <h3 className="timeline-title">Database & WebSockets (MongoDB/Socket.io)</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Bio Paragraph & Stats */}
            <div className="col-lg-7 text-start order-1 order-lg-2 mb-5 mb-lg-0">
              <h2 className="section-title text-white" id="about-heading">
                About me
              </h2>
              <div className="section-subtitle-bar"></div>
              <p className="about-bio" id="about-bio-text">
                I am Monu Devrath, a passionate MERN Stack Developer. Currently interning at Seefat Technologies, 
                I focus on writing efficient RESTful APIs, integrating MongoDB databases, and building responsive frontends in React. 
                I started my coding journey with a love for logical challenges, and today, I enjoy turning complex problems into clean, usable web applications.
              </p>
              
              <div className="stats-container mt-5" id="about-counters">
                <div className="stat-box">
                  <h4 className="stat-number">5</h4>
                  <div className="stat-label">Projects Completed</div>
                </div>
                <div className="stat-box">
                  <h4 className="stat-number">100%</h4>
                  <div className="stat-label">Commitment Rate</div>
                </div>
                <div className="stat-box">
                  <h4 className="stat-number">1+</h4>
                  <div className="stat-label">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section className="resume-section" id="resume">
        <div className="container">
          <div className="row">
            {/* Experience Column */}
            <div className="col-lg-6 text-start pe-lg-5 mb-5 mb-lg-0">
              <h2 className="section-title text-white" id="experience-heading">
                Experience
              </h2>
              <div className="section-subtitle-bar"></div>
              
              <div className="resume-timeline" id="experience-timeline">
                <div className="resume-item">
                  <span className="resume-date">Present</span>
                  <h3 className="resume-title text-white">MERN Stack Developer Intern</h3>
                  <h4 className="resume-company">Seefat Technologies</h4>
                  <ul className="resume-details">
                    <li>Developing and maintaining full-stack web applications using the MERN stack.</li>
                    <li>Designing responsive and user-friendly interfaces with React.js.</li>
                    <li>Building RESTful APIs and integrating third-party services.</li>
                    <li>Working with MongoDB databases for efficient data storage and retrieval.</li>
                    <li>Collaborating with senior developers to deliver client-focused solutions.</li>
                  </ul>
                </div>
                
                <div className="resume-item">
                  <span className="resume-date">May 2025 - Nov 2025</span>
                  <h3 className="resume-title text-white">MERN Stack Trainee</h3>
                  <h4 className="resume-company">Inventcolabs Pvt. Ltd.</h4>
                  <ul className="resume-details">
                    <li>Completed intensive training in MERN Stack development.</li>
                    <li>Built multiple full-stack web applications and CRUD systems.</li>
                    <li>Gained practical experience in API development and database management.</li>
                    <li>Learned software development best practices and version control using Git.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education Column */}
            <div className="col-lg-6 text-start">
              <h2 className="section-title text-white" id="education-heading">
                Education
              </h2>
              <div className="section-subtitle-bar"></div>

              <div className="resume-timeline" id="education-timeline">
                <div className="resume-item">
                  <span className="resume-date">BCA Graduated</span>
                  <h3 className="resume-title text-white">Bachelor of Computer Applications (BCA)</h3>
                  <h4 className="resume-company">M.R. Government College, Fazilka</h4>
                  <p className="resume-text">
                    Gained a strong foundation in computer science principles, database systems, software engineering, and object-oriented programming.
                  </p>
                </div>

                <div className="resume-item">
                  <span className="resume-date">12th Grade Completed</span>
                  <h3 className="resume-title text-white">Senior Secondary (12th)</h3>
                  <h4 className="resume-company">Government Senior Secondary School, Nihal Khera</h4>
                  <p className="resume-text">
                    Completed higher secondary school curriculum with focus on academics, analytical thinking, and foundational science/mathematics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section" id="skills">
        <div className="container">
          <div className="text-start">
            <h2 className="section-title text-white" id="skills-heading">
              Skills
            </h2>
            <div className="section-subtitle-bar"></div>
          </div>
          <div className="skills-grid" id="skills-badge-list">
            {["MERN Stack Development", "JavaScript (ES6+)", "React.js", "Node.js", "Express.js", "MongoDB", "RESTful APIs", "HTML5 & CSS3", "Bootstrap", "Git & GitHub", "Responsive Web Design", "Problem Solving & Debugging"].map((skill) => (
              <span className="skill-badge-custom" key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="projects-section" id="projects">
        <div className="container">
          <div className="text-start">
            <h2 className="section-title text-white" id="projects-heading">
              Projects
            </h2>
            <div className="section-subtitle-bar"></div>
          </div>
          <div className="row g-4 mt-2" id="projects-cards-container">
            {/* E-Commerce Website */}
            <div className="col-lg-4 col-md-6">
              <div className="project-card" id="project-ecommerce">
                <div>
                  <div className="project-icon"><i className="bi bi-cart3"></i></div>
                  <h3 className="project-title text-white">E-Commerce Website</h3>
                  <p className="project-desc">
                    Developed a complete online shopping platform. Implemented user authentication and authorization, integrated product management, shopping cart, and order processing features with a responsive UI.
                  </p>
                </div>
                <div>
                  <div className="project-tags">
                    <span className="project-tag">React.js</span>
                    <span className="project-tag">Node.js</span>
                    <span className="project-tag">Express.js</span>
                    <span className="project-tag">MongoDB</span>
                  </div>
                  <a href="https://github.com/monudevrath01/ecommerce.git" target="_blank" rel="noreferrer" className="project-link" id="link-proj-ecommerce">
                    GitHub Code <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* BEFT Fitness Planner */}
            <div className="col-lg-4 col-md-6">
              <div className="project-card" id="project-fitness">
                <div>
                  <div className="project-icon"><i className="bi bi-heart-pulse-fill"></i></div>
                  <h3 className="project-title text-white">BEFT Fitness Planner</h3>
                  <p className="project-desc">
                    Developed a fitness planning platform for workout and diet management. Enabled users to track fitness goals and progress, and built interactive dashboards for personalized recommendations.
                  </p>
                </div>
                <div>
                  <div className="project-tags">
                    <span className="project-tag">React.js</span>
                    <span className="project-tag">Node.js</span>
                    <span className="project-tag">Express.js</span>
                    <span className="project-tag">MongoDB</span>
                  </div>
                  <a href="https://github.com/monudevrath01" target="_blank" rel="noreferrer" className="project-link" id="link-proj-fitness">
                    GitHub Code <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* School Management System */}
            <div className="col-lg-4 col-md-6">
              <div className="project-card" id="project-school">
                <div>
                  <div className="project-icon"><i className="bi bi-mortarboard-fill"></i></div>
                  <h3 className="project-title text-white">School Management System</h3>
                  <p className="project-desc">
                    Created a system to manage student records, attendance, and class schedules. Implemented role-based access for administrators, teachers, and students with automated attendance reporting.
                  </p>
                </div>
                <div>
                  <div className="project-tags">
                    <span className="project-tag">React.js</span>
                    <span className="project-tag">Node.js</span>
                    <span className="project-tag">Express.js</span>
                    <span className="project-tag">MongoDB</span>
                  </div>
                  <a href="https://github.com/monudevrath01" target="_blank" rel="noreferrer" className="project-link" id="link-proj-school">
                    GitHub Code <i className="bi bi-arrow-right"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extracurricular Section */}
      <section className="extra-section" id="achievements">
        <div className="container">
          <div className="extra-card" id="achievements-card">
            <span className="extra-badge">
              <i className="bi bi-trophy-fill"></i> Achievements & Extracurriculars
            </span>
            <h2 className="section-title text-white mb-4">Beyond Coding</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="timeline-icon-box fs-4 p-2 text-primary" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', flexShrink: 0 }}>
                    <i className="bi bi-award-fill"></i>
                  </div>
                  <div>
                    <h4 className="text-white fs-5 fw-bold">State-Level Kabaddi Player</h4>
                    <p className="text-secondary small">Competed at the state level in the Under-17 category, demonstrating discipline, strategy, and resilience.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="timeline-icon-box fs-4 p-2 text-primary" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', flexShrink: 0 }}>
                    <i className="bi bi-people-fill"></i>
                  </div>
                  <div>
                    <h4 className="text-white fs-5 fw-bold">Teamwork & Leadership</h4>
                    <p className="text-secondary small">Strong team collaboration and communication skills honed through active sports participation and group dynamics.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="timeline-icon-box fs-4 p-2 text-primary" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', flexShrink: 0 }}>
                    <i className="bi bi-rocket-takeoff-fill"></i>
                  </div>
                  <div>
                    <h4 className="text-white fs-5 fw-bold">Continuous Learner</h4>
                    <p className="text-secondary small">Active learner with an intense passion for modern web technologies and software engineering practices.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="row">
            {/* Contact Info */}
            <div className="col-lg-6 text-start contact-info-card pe-lg-5">
              <h2 className="section-title text-white" id="contact-heading">
                Contact
              </h2>
              <div className="section-subtitle-bar"></div>
              <p className="about-bio mb-5">
                Whether you have an internship request, a freelance task, or simply want to align on a project opportunity, feel free to get in touch.
              </p>
              
              <div className="contact-details" id="contact-details-list">
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div className="contact-detail-text">
                    <p className="label">Mail me at</p>
                    <p className="value text-white">monudevrath2003@gmail.com</p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div className="contact-detail-text">
                    <p className="label">Call me at</p>
                    <p className="value text-white">+91 9888049646</p>
                  </div>
                </div>
                <div className="contact-detail-item">
                  <div className="contact-detail-icon">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div className="contact-detail-text">
                    <p className="label">Location</p>
                    <p className="value text-white">Abohar, Punjab, India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-6 text-start mt-5 mt-lg-0">
              <div className="contact-form" id="contact-form-container">
                {formSubmitted && (
                  <div className="alert-success-custom" role="alert" id="form-success-alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Your message has been sent successfully. I will write back soon!
                  </div>
                )}
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group-custom">
                    <label className="form-label-custom" htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom" htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      className="form-control form-control-custom"
                      id="email"
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom" htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      id="subject"
                      placeholder="e.g. Project Inquiry"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom" htmlFor="message">Message</label>
                    <textarea
                      className="form-control form-control-custom"
                      id="message"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-pill-solid w-100 py-3" id="form-submit-btn">
                    Send Message <i className="bi bi-send-fill ms-2"></i>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} Monu Devrath. All rights reserved.
            </p>
            <div className="social-links">
              <a
                href="http://www.linkedin.com/in/monudevrath"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                id="footer-link-linkedin"
                aria-label="LinkedIn Profile"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="https://github.com/monudevrath01"
                target="_blank"
                rel="noreferrer"
                className="social-link"
                id="footer-link-github"
                aria-label="GitHub Profile"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="mailto:monudevrath2003@gmail.com"
                className="social-link"
                id="footer-link-email"
                aria-label="Email Address"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
