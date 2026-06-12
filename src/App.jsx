import React, { useState, useEffect } from "react";
import "./App.css";
import profileImg from "./assets/profile.jpg";

const initialBlogPosts = [
  {
    id: 1,
    title: "Understanding the Node.js Event Loop",
    category: "NodeJS",
    date: "June 10, 2026",
    readTime: "5 min read",
    excerpt: "Demystifying the Node.js event loop, callback queue, microtasks, and how single-threaded JavaScript handles asynchronous operations efficiently.",
    content: `Node.js is renowned for its high performance and ability to handle thousands of concurrent connections. But how does a single-threaded runtime manage to be so efficient without blocking the main execution path? The answer lies in the **Event Loop**.

### What is the Event Loop?
The event loop is the secret sauce behind Node.js's non-blocking I/O model. When Node.js starts, it initializes the event loop, processes the provided input script, and then begins executing the loop phases.

### Phases of the Event Loop:
1. **Timers**: Executes callbacks scheduled by \`setTimeout()\` and \`setInterval()\`.
2. **Pending Callbacks**: Executes I/O callbacks deferred to the next loop iteration.
3. **Idle, Prepare**: Used internally by Node.js.
4. **Poll**: Retrieves new I/O events; executes I/O-related callbacks.
5. **Check**: Executes callbacks scheduled by \`setImmediate()\`.
6. **Close Callbacks**: Handles socket/handle close events.

### Best Practices to Prevent Blocking:
- Avoid CPU-intensive operations on the main thread.
- Break large computations into smaller chunks.
- Offload heavy operations to worker threads.`,
    likes: 24,
    comments: [
      { id: 1, author: "Rahul Sharma", text: "Great explanation! This finally cleared my doubts about setImmediate vs setTimeout(0).", date: "June 11, 2026" },
      { id: 2, author: "Aman Preet", text: "Very detailed guide, thanks Monu!", date: "June 12, 2026" }
    ]
  },
  {
    id: 2,
    title: "Mastering React State Management in 2026",
    category: "React",
    date: "May 28, 2026",
    readTime: "8 min read",
    excerpt: "A comprehensive comparison of modern React state management solutions: Context API, Redux Toolkit, Zustand, and when to use what.",
    content: `State management is one of the most critical decisions when architecting a React application. Over the years, the React ecosystem has evolved, offering developers several tools to manage data flow.

### 1. React Context API
Best for global state that changes infrequently (e.g., UI theme, user language preference).
- **Pros:** Built-in, no external dependencies, simple.
- **Cons:** Can lead to unnecessary re-renders if not optimized.

### 2. Zustand
A small, fast, and scalable bear-necessity state management solution.
- **Pros:** Extremely simple API, minimal boilerplate, no context provider wrapper required.
- **Cons:** Less structured for extremely massive enterprise setups.

### 3. Redux Toolkit (RTK)
The official, opinionated toolset for efficient Redux development.
- **Pros:** DevTools, powerful middleware, structured standards.
- **Cons:** Boilerplate is still relatively high compared to Zustand.

### Summary:
Use **Zustand** for most small-to-medium full-stack applications. Use **Context API** for simple static configs, and **Redux** if required by legacy constraints or massive team alignment.`,
    likes: 42,
    comments: [
      { id: 1, author: "Sneha Gupta", text: "Zustand has been my go-to for my last three projects. Highly recommend it!", date: "May 29, 2026" }
    ]
  },
  {
    id: 3,
    title: "MongoDB Indexing Strategies for Performance",
    category: "Database",
    date: "April 15, 2026",
    readTime: "6 min read",
    excerpt: "Learn how to optimize your MongoDB query speeds by implementing single-field, compound, and multikey indexes effectively.",
    content: `As your MongoDB collections grow to millions of documents, query execution times can degrade from milliseconds to seconds. Implementing a robust indexing strategy is the key to maintaining sub-second query performance.

### What is an Index?
Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan—scanning every document in a collection to select those that match the query statement.

### Key Index Types:
- **Single Field Indexes:** Indexing a single field, e.g., \`{ email: 1 }\`.
- **Compound Indexes:** Indexing multiple fields in a specific order, e.g., \`{ status: 1, dateCreated: -1 }\`. Essential for queries filtering by status and sorting by date.
- **Multikey Indexes:** Indexing fields that contain array values.

### Rule of Thumb (ESR Rule):
When creating compound indexes, follow the **E-S-R** rule:
1. **Equality:** Place equality fields first.
2. **Sort:** Place sort fields second.
3. **Range:** Place range filter fields last.`,
    likes: 18,
    comments: []
  }
];

const parseChatLinks = (text) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <a 
        key={match.index} 
        href={match[2]} 
        target={match[2].startsWith("http") || match[2].endsWith(".pdf") ? "_blank" : "_self"}
        rel="noreferrer" 
        className="text-primary text-decoration-underline"
      >
        {match[1]}
      </a>
    );
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

function App() {
  // Navbar toggle state for mobile
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  // Tracking active navigation section for indicator underline
  const [activeSection, setActiveSection] = useState("home");

  // Form submission state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  // Blog search and categories state
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeBlogPost, setActiveBlogPost] = useState(null);
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAuthor, setNewCommentAuthor] = useState("");

  // Chatbot states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! 👋 I am Monu's virtual assistant. How can I help you today? Feel free to ask me about his skills, experience, projects, or how to contact him.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Scroll chat messages to bottom whenever messages list changes
  useEffect(() => {
    const chatContainer = document.getElementById("chat-messages-scroll");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatMessages, isTyping, isChatOpen]);

  // Handle chatbot response
  const triggerBotResponse = (userQuery) => {
    setIsTyping(true);
    setTimeout(() => {
      let botAnswer = "";
      const query = userQuery.toLowerCase().trim();

      if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("greetings") || query.includes("howdy")) {
        botAnswer = "Hello! 👋 I am Monu's virtual assistant. How can I help you today? You can ask me about Monu's skills, experience, projects, or how to hire him!";
      } else if (query.includes("skill") || query.includes("tech") || query.includes("mern") || query.includes("react") || query.includes("node") || query.includes("mongo") || query.includes("express") || query.includes("javascript")) {
        botAnswer = "Monu is a MERN Stack Developer. His core skills include React.js, Node.js, Express.js, MongoDB, JavaScript (ES6+), RESTful APIs, Bootstrap, HTML5/CSS3, and Git/GitHub.";
      } else if (query.includes("project") || query.includes("work") || query.includes("portfolio") || query.includes("ecommerce")) {
        botAnswer = "Monu's primary featured project is a full-featured MERN E-Commerce Website. It has user authentication, product search, cart functionalities, and checkout options. Check it out in the Projects section above!";
      } else if (query.includes("experience") || query.includes("intern") || query.includes("seefat") || query.includes("inventcolabs") || query.includes("job")) {
        botAnswer = "Monu is currently interning as a MERN Stack Developer Intern at Seefat Technologies. Before this, he completed a MERN Stack training program at Inventcolabs Pvt. Ltd.";
      } else if (query.includes("resume") || query.includes("cv") || query.includes("pdf") || query.includes("download")) {
        botAnswer = "You can download Monu's resume directly! [Click here to download Resume PDF](/resume.pdf) or click the Resume icon in the top section.";
      } else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("hire") || query.includes("call") || query.includes("number")) {
        botAnswer = "You can hire Monu by emailing him at monudevrath2003@gmail.com, calling him at +91 9888049646, or filling out the Contact Form at the bottom of the page!";
      } else {
        botAnswer = "That's a great question! For detailed information or custom inquiries, please email Monu at monudevrath2003@gmail.com, or use the contact form at the bottom of the page.";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "bot",
          text: botAnswer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMessage]);
    const query = chatInput.trim();
    setChatInput("");
    triggerBotResponse(query);
  };

  const handleSuggestionClick = (suggestionText) => {
    const cleanQuery = suggestionText.replace(/[^\w\s]/gi, '').trim();
    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: suggestionText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMessage]);
    triggerBotResponse(cleanQuery);
  };

  // Filter blog posts
  const filteredBlogPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle liking blog posts
  const handleLikePost = (postId) => {
    setBlogPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
    setActiveBlogPost(prev => prev && prev.id === postId ? { ...prev, likes: prev.likes + 1 } : prev);
  };

  // Handle adding comments to blog posts
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim() || !activeBlogPost) return;

    const newComment = {
      id: Date.now(),
      author: newCommentAuthor.trim(),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setBlogPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === activeBlogPost.id 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      )
    );

    setActiveBlogPost(prev => prev ? { ...prev, comments: [...prev.comments, newComment] } : null);
    setNewCommentText("");
    setNewCommentAuthor("");
  };

  // Handle active link tracking on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "resume", "skills", "projects", "blog", "contact"];
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
                className={`nav-link-custom ${activeSection === "blog" ? "active" : ""}`} 
                href="#blog" 
                id="link-blog" 
                onClick={() => { setIsNavExpanded(false); setActiveSection("blog"); }}
              >
                Blog
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
          <div className="row g-4 mt-2 justify-content-center" id="projects-cards-container">
            {/* E-Commerce Website */}
            <div className="col-lg-6 col-md-8">
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

      {/* Blog Section */}
      <section className="blog-section" id="blog">
        <div className="container">
          <div className="text-start">
            <h2 className="section-title text-white" id="blog-heading">
              Latest Blog Posts
            </h2>
            <div className="section-subtitle-bar"></div>
          </div>
          
          {/* Search and Category Filter bar */}
          <div className="row g-3 mb-4 mt-2 justify-content-between align-items-center" id="blog-filters">
            <div className="col-md-6">
              <div className="search-box-container">
                <i className="bi bi-search search-icon"></i>
                <input 
                  type="text" 
                  className="form-control form-control-custom search-input" 
                  placeholder="Search articles by title or content..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-5 d-flex justify-content-md-end gap-2 flex-wrap">
              {["All", "React", "NodeJS", "Database"].map((cat) => (
                <button 
                  key={cat} 
                  className={`btn-filter ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="row g-4" id="blog-posts-container">
            {filteredBlogPosts.length > 0 ? (
              filteredBlogPosts.map((post) => (
                <div className="col-lg-4 col-md-6" key={post.id}>
                  <div className="blog-card" id={`blog-card-${post.id}`}>
                    <div className="blog-card-body">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="blog-badge">{post.category}</span>
                        <span className="blog-date">{post.date}</span>
                      </div>
                      <h3 className="blog-title text-white">{post.title}</h3>
                      <p className="blog-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="blog-card-footer">
                      <span className="blog-readtime"><i className="bi bi-clock me-1"></i> {post.readTime}</span>
                      <button 
                        className="btn-read-more" 
                        onClick={() => {
                          setActiveBlogPost(post);
                          setNewCommentText("");
                          setNewCommentAuthor("");
                        }}
                      >
                        Read More <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <p className="text-secondary">No blog posts found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Post Detail Overlay Modal */}
      {activeBlogPost && (
        <div className="blog-modal-overlay" onClick={() => setActiveBlogPost(null)}>
          <div className="blog-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="blog-modal-close" onClick={() => setActiveBlogPost(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <div className="blog-modal-header">
              <span className="blog-badge mb-2 d-inline-block">{activeBlogPost.category}</span>
              <h2 className="blog-modal-title text-white">{activeBlogPost.title}</h2>
              <div className="blog-modal-meta text-secondary d-flex gap-3 align-items-center flex-wrap my-3">
                <span><i className="bi bi-calendar-event me-1"></i> {activeBlogPost.date}</span>
                <span><i className="bi bi-clock me-1"></i> {activeBlogPost.readTime}</span>
                <button 
                  className="btn-like-react border-0 bg-transparent text-secondary p-0" 
                  onClick={() => handleLikePost(activeBlogPost.id)}
                >
                  <i className="bi bi-heart-fill text-danger me-1"></i> {activeBlogPost.likes} Likes
                </button>
              </div>
            </div>
            
            <div className="blog-modal-body text-secondary">
              {activeBlogPost.content.split('\n\n').map((para, idx) => {
                if (para.startsWith('###')) {
                  return <h4 key={idx} className="text-white mt-4 mb-2">{para.replace('###', '').trim()}</h4>;
                }
                if (para.startsWith('-')) {
                  return (
                    <ul key={idx} className="ps-3 my-2 text-secondary">
                      {para.split('\n').map((li, lidx) => (
                        <li key={lidx}>{li.replace('-', '').trim()}</li>
                      ))}
                    </ul>
                  );
                }
                return <p key={idx} className="lh-lg mb-3">{para}</p>;
              })}
            </div>

            <hr className="my-4 border-secondary opacity-25" />

            {/* Comments Section */}
            <div className="blog-comments-section">
              <h3 className="text-white mb-4 fs-5"><i className="bi bi-chat-text-fill me-2 text-primary"></i> Comments ({activeBlogPost.comments.length})</h3>
              
              <div className="comments-list d-flex flex-column gap-3 mb-4">
                {activeBlogPost.comments.length > 0 ? (
                  activeBlogPost.comments.map((comment) => (
                    <div className="comment-item" key={comment.id}>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="comment-author text-white m-0 fs-6">{comment.author}</h5>
                        <span className="comment-date text-muted small">{comment.date}</span>
                      </div>
                      <p className="comment-text text-secondary m-0 small">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small italic">No comments yet. Be the first to share your thoughts!</p>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="comment-form mt-3">
                <h4 className="text-white fs-6 mb-3">Add a Comment</h4>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <input 
                      type="text" 
                      className="form-control form-control-custom text-sm" 
                      placeholder="Your name" 
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea 
                      className="form-control form-control-custom text-sm" 
                      rows="3"
                      placeholder="Write your comment..." 
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-pill-solid py-2 px-4 fs-7">
                      Post Comment
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat Widget */}
      <div className={`chat-widget-container ${isChatOpen ? "open" : ""}`} id="chat-widget">
        {/* Floating Action Button (FAB) */}
        <button 
          className="chat-fab" 
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Toggle Chat Bot"
          id="chat-toggle-btn"
        >
          {isChatOpen ? (
            <i className="bi bi-x-lg"></i>
          ) : (
            <>
              <i className="bi bi-chat-dots-fill"></i>
              <span className="chat-notification-badge">1</span>
            </>
          )}
        </button>

        {/* Chat Window Panel */}
        <div className="chat-window shadow-lg">
          {/* Header */}
          <div className="chat-header d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <div className="chat-avatar-wrapper">
                <img src={profileImg} alt="Monu Devrath" className="chat-avatar" />
                <span className="online-indicator"></span>
              </div>
              <div>
                <h4 className="chat-bot-name text-white m-0">Monu Devrath</h4>
                <p className="chat-bot-status m-0">Virtual Assistant</p>
              </div>
            </div>
            <button className="chat-close-btn bg-transparent border-0 text-white p-0 opacity-75" onClick={() => setIsChatOpen(false)}>
              <i className="bi bi-dash-lg fs-5"></i>
            </button>
          </div>

          {/* Messages scroll area */}
          <div className="chat-messages-area" id="chat-messages-scroll">
            {chatMessages.map((msg) => (
              <div className={`chat-message-bubble ${msg.sender}`} key={msg.id}>
                <div className="chat-message-text">
                  {msg.text.includes("[") ? (
                    parseChatLinks(msg.text)
                  ) : (
                    msg.text
                  )}
                </div>
                <div className="chat-message-time">{msg.time}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message-bubble bot typing">
                <div className="chat-typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Suggestion Chips */}
          <div className="chat-suggestions d-flex gap-1 overflow-x-auto py-2 px-3">
            {["💼 Hire Monu", "🛠️ Skills", "📄 Resume", "📞 Contact", "📁 Projects"].map((chip) => (
              <button 
                key={chip} 
                className="btn-suggestion-chip text-nowrap"
                onClick={() => handleSuggestionClick(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleSendMessage} className="chat-input-panel">
            <input 
              type="text" 
              className="chat-input form-control border-0" 
              placeholder="Ask me something about Monu..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={!chatInput.trim() || isTyping}>
              <i className="bi bi-send-fill"></i>
            </button>
          </form>
        </div>
      </div>

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
