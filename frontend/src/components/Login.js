import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://lost-found-backend-x2yl.onrender.com/api/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Email" type="email" style={{ width: '100%', padding: '8px' }} onChange={e => setForm({...form, email: e.target.value})} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input placeholder="Password" type="password" style={{ width: '100%', padding: '8px' }} onChange={e => setForm({...form, password: e.target.value})} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center' }}>New user? <a href="/register">Register</a></p>
    </div>
  );
}

export default Login;