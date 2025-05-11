import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import Swal from 'sweetalert2';
import Dashboard from './components/Dashboard';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';

function App() {
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
  
  const handleSignupSuccess = () => {
    setShowSignupModal(false);
    Swal.fire({
      title: 'Success!',
      text: 'Account created successfully. Please login.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      setShowLoginModal(true);
    });
  };
  
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    localStorage.setItem('isAuthenticated', true);
    setIsAuthenticated(true);
    Swal.fire({
      title: 'Logged In!',
      text: 'You have successfully logged in.',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };
  
  const handleLogout = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        setIsAuthenticated(false);
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }
    });
  };
  
  return (
    <Router>
      <div className="app-container">
        {/* Improved Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <div className="navbar-brand d-flex align-items-center">
              <i className="bi bi-calendar-check fs-3 me-2"></i>
              <span className="fw-bold">TimeTable Master</span>
            </div>
            
            {!isAuthenticated && (
              <div className="ms-auto">
                <button
                  className="btn btn-outline-light me-2"
                  onClick={() => setShowSignupModal(true)}
                >
                  <i className="bi bi-person-plus me-1"></i> Sign Up
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => setShowLoginModal(true)}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </button>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="ms-auto">
                <button
                  className="btn btn-outline-light"
                  onClick={()=>{handleLogout()
                    localStorage.removeItem('isAuthenticated');
                    setIsAuthenticated(false);
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Signup and Login Modals */}
        <Signup
          show={showSignupModal}
          onHide={() => setShowSignupModal(false)}
          onSuccess={handleSignupSuccess}
        />
        <Login
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
        
        {/* Main Content */}
        <div className="container py-5">
          <Routes>
            <Route
              path="/dashboard"
              element={
                isAuthenticated ?
                <Dashboard onLogout={handleLogout} /> :
                <Navigate to="/" replace />
              }
            />
            <Route
              path="/"
              element={
                isAuthenticated ?
                <Navigate to="/dashboard" replace /> :
                <HomeContent onSignup={() => setShowSignupModal(true)} onLogin={() => setShowLoginModal(true)} />
              }
            />
          </Routes>
        </div>
        
        {/* Footer */}
        <footer className="bg-dark text-white py-4 mt-auto">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5><i className="bi bi-calendar-check me-2"></i>TimeTable Master</h5>
                <p className="small">The ultimate solution for organizing your schedule and managing your time effectively.</p>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold">Quick Links</h6>
                <ul className="list-unstyled">
                  <li><a href="#" className="text-decoration-none text-white-50">About Us</a></li>
                  <li><a href="#" className="text-decoration-none text-white-50">Features</a></li>
                  <li><a href="#" className="text-decoration-none text-white-50">FAQ</a></li>
                  <li><a href="#" className="text-decoration-none text-white-50">Contact</a></li>
                </ul>
              </div>
              <div className="col-md-3">
                <h6 className="fw-bold">Connect With Us</h6>
                <div className="d-flex gap-3 fs-5">
                  <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
                  <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
                  <a href="#" className="text-white"><i className="bi bi-instagram"></i></a>
                  <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
                </div>
              </div>
            </div>
            <hr />
            <div className="text-center small">
              <p className="mb-0">&copy; {new Date().getFullYear()} TimeTable Master. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Home content component with features showcase
function HomeContent({ onSignup, onLogin }) {
  return (
    <div>
      {/* Hero Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">Organize Your Schedule Like Never Before</h1>
          <p className="lead text-muted mb-4">
            TimeTable Master helps you create, manage, and optimize your schedule. Perfect for students, 
            teachers, professionals, and anyone who wants to make the most of their time.
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-primary btn-lg px-4" onClick={onSignup}>
              Get Started
            </button>
            <button className="btn btn-outline-secondary btn-lg px-4" onClick={onLogin}>
              Sign In
            </button>
          </div>
        </div>
        <div className="col-lg-6 mt-5 mt-lg-0">
          {/* <img 
            src="/api/placeholder/600/400" 
            alt="Schedule Calendar" 
            className="img-fluid rounded shadow"
          /> */}
          <video
  className="w-full h-auto rounded-xl shadow-lg"
  autoPlay
  loop
  muted
  playsInline
  style={{ maxWidth: '100%', height: '30%' }}
>
  <source
  src='https://media.istockphoto.com/id/1545583333/video/paper-diary-organizer-with-time-closeup-4k-movie.mp4?s=mp4-640x640-is&k=20&c=IA8_BjYjS3rqKO2WcTxhx3o9yjxwTRU3bxSaWdDUdWU='
    type="video/mp4"
  />
  Your browser does not support the video tag.
</video>



        </div>
      </div>
      
      {/* Features Section */}
      <h2 className="text-center mb-5 mt-5 pt-3">Key Features</h2>
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3 mx-auto" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-calendar-week fs-3"></i>
              </div>
              <h4 className="card-title">Easy Scheduling</h4>
              <p className="card-text text-muted">
                Create and manage your weekly schedule with our intuitive drag-and-drop interface.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3 mx-auto" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-bell fs-3"></i>
              </div>
              <h4 className="card-title">Reminders & Alerts</h4>
              <p className="card-text text-muted">
                Never miss an important task or appointment with customizable reminders.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="feature-icon bg-primary bg-opacity-10 text-primary p-3 rounded-circle mb-3 mx-auto" style={{width: '70px', height: '70px'}}>
                <i className="bi bi-share fs-3"></i>
              </div>
              <h4 className="card-title">Easy Sharing</h4>
              <p className="card-text text-muted">
                Share your schedule with friends, classmates, or colleagues effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials */}
      {/* <h2 className="text-center mb-4 pt-3">What Our Users Say</h2>
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="mb-3 text-warning">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <p className="card-text fst-italic mb-3">
                "TimeTable Master has transformed how I manage my university schedule. I can easily keep track of all my classes and assignments now!"
              </p>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <span>JS</span>
                </div>
                <div>
                  <h6 className="mb-0">James Smith</h6>
                  <small className="text-muted">Engineering Student</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="mb-3 text-warning">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
              </div>
              <p className="card-text fst-italic mb-3">
                "As a teacher, this app helps me organize my classes perfectly. The reminder feature ensures I'm always prepared for my lectures."
              </p>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <span>LP</span>
                </div>
                <div>
                  <h6 className="mb-0">Lisa Parker</h6>
                  <small className="text-muted">High School Teacher</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="mb-3 text-warning">
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-fill"></i>
                <i className="bi bi-star-half"></i>
              </div>
              <p className="card-text fst-italic mb-3">
                "The interface is intuitive and user-friendly. I've tried many scheduling apps, but TimeTable Master is by far the best!"
              </p>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                  <span>AJ</span>
                </div>
                <div>
                  <h6 className="mb-0">Amanda Johnson</h6>
                  <small className="text-muted">Project Manager</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      
      {/* CTA Section */}
      <div className="text-center bg-light p-5 rounded-3 mt-5">
        <h2 className="mb-3">Ready to optimize your schedule?</h2>
        <p className="lead text-muted mb-4">Join thousands of users who have improved their time management with TimeTable Master.</p>
        <button className="btn btn-primary btn-lg px-4 py-2" onClick={onSignup}>
          Create Free Account
        </button>
      </div>
    </div>
  );
}

export default App;