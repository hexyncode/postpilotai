import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', { username });
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log('Login response:', { status: res.status, data });
      if (res.ok) {
        localStorage.setItem('token', data.access_token);
        window.location.href = '/dashboard';
      } else {
        setError(data.msg || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-midnight-50">
      <form onSubmit={handleSubmit} className="bg-midnight-100 p-8 rounded-lg shadow-lg w-full max-w-sm border border-midnight-400">
        <h2 className="text-2xl font-bold mb-6 text-midnight-700 dark:text-midnight-600 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-midnight-200 text-midnight-700 dark:bg-midnight-300 dark:text-midnight-900 border border-midnight-400 focus:outline-none focus:ring-2 focus:ring-midnight-800"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 rounded bg-midnight-200 text-midnight-700 dark:bg-midnight-300 dark:text-midnight-900 border border-midnight-400 focus:outline-none focus:ring-2 focus:ring-midnight-800"
        />
        <button
          type="submit"
          className="w-full py-2 rounded bg-midnight-800 text-midnight-50 font-semibold hover:bg-midnight-700 transition-colors"
        >
          Login
        </button>
        {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
      </form>
    </div>
  );
}

export default Login; 