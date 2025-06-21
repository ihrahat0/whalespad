import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Import Supabase client

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data, error: supabaseError } = await supabase
        .from('admins')
        .select('id, username, password, role')
        .eq('username', username)
        .single();

      if (supabaseError && supabaseError.message.includes('rows not found')) {
        setError('Invalid username or password.');
        return;
      }
      if (supabaseError) {
        throw supabaseError;
      }

      // Simple password check (for demonstration, consider hashing in production)
      if (data.password === password) {
        // Store admin info in session storage for now
        sessionStorage.setItem('adminUser', JSON.stringify({ id: data.id, username: data.username, role: data.role }));
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message || 'An unexpected error occurred'}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-gray-300 text-sm font-bold mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-3 px-4 bg-gray-700 text-white leading-tight focus:outline-none focus:shadow-outline border-gray-600 focus:border-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;