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
  const [isAuthenticated, setIsAuthenticated] = useState(false);


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
      <div className="container mt-5">
        {!isAuthenticated && (
          <div className="text-center">
            <button
              className="btn btn-primary me-3"
              onClick={() => setShowSignupModal(true)}
            >
              Signup
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          </div>
        )}


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
              <div className="mt-5 text-center">
                <h2>Welcome to our App</h2>
                <p>Please signup or login to continue</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>

  );
}


export default App;




