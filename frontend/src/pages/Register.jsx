import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setErr('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <label className="block mb-2">
          <span className="text-sm">Name</span>
          <input required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1 block w-full p-2 border rounded" />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1 block w-full p-2 border rounded" />
        </label>
        <button className="w-full py-2 bg-green-600 text-white rounded">Register</button>
        <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
      </form>
    </div>
  );
}
