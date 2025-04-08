import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
// import { auth, signInWithEmailAndPassword } from '../firebase';
import { auth, signInWithEmailAndPassword} from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Login = ({ show, onHide, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Reset form
      setEmail('');
      setPassword('');
      setErrors({});
      onSuccess();
      navigate('/dashboard');
    } catch (error) {
      setErrors({ form: 'Invalid email or password' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!errors.email}
              placeholder="Enter email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!errors.password}
              placeholder="Password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.form && (
            <div className="alert alert-danger">{errors.form}</div>
          )}

          <Button 
            variant="success" 
            type="submit" 
            disabled={isSubmitting}
            className="w-100"
          >
            {isSubmitting ? 'Logging In...' : 'Login'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Login;