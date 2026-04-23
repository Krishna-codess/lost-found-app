import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://lost-found-backend-x2yl.onrender.com/api/register', form);
      alert('Registered successfully! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Full Name" style={{ width: '100%', padding: '8px' }} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Email" type="email" style={{ width: '100%', padding: '8px' }} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Password" type="password" style={{ width: '100%', padding: '8px' }} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center' }}>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}

export default Register;