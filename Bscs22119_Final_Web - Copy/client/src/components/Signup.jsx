import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/axios';
import './components.css';
import sampleImage from '../assets/sample1.png';
import sampleImage2 from '../assets/sample2.png';
import sampleImage3 from '../assets/sample__.png';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img
        src={sampleImage}
        alt="Sign Up Illustration"
        className="signup-image"
      />

      <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
          />
          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Ok'}
          </button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>

      <img
        src={sampleImage2}
        alt="Sign Up Illustration"
        className="signup-image"
      />


      <img
        src={sampleImage3}
        alt="Sign Up Illustration"
        className="signup-image2"
      />

    </>
  );
}

export default Signup;
