import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [q, setQ] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login'); // quick guard if not logged
      return;
    }
    fetchNotes();
    // eslint-disable-next-line
  }, [user]);

  const fetchNotes = async (query) => {
    try {
      const res = await api.get('/notes', { params: { q: query || q } });
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (!title) { setErr('Title required'); return; }
      if (editingId) {
        await api.put(`/notes/${editingId}`, { title, content });
        setEditingId(null);
      } else {
        await api.post('/notes', { title, content });
      }
      setTitle(''); setContent('');
      fetchNotes();
    } catch (error) {
      setErr('Could not save note');
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content || '');
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { logout(); navigate('/login'); }} className="px-3 py-1 border rounded">Logout</button>
          </div>
        </header>

        <section className="mb-6">
          <form onSubmit={handleCreate} className="bg-white p-4 rounded shadow">
            {err && <div className="text-red-600 mb-2">{err}</div>}
            <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} className="w-full mb-2 p-2 border rounded" />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded">{editingId ? 'Update' : 'Create'}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(''); setContent(''); }} className="px-3 py-1 border rounded">Cancel</button>}
            </div>
          </form>
          <div className="flex gap-2 mt-2">
            <input placeholder="Search notes" value={q} onChange={e => setQ(e.target.value)} className="flex-1 p-2 border rounded" />
            <button onClick={() => fetchNotes(q)} className="px-3 py-1 bg-gray-800 text-white rounded">Search</button>
            <button onClick={() => { setQ(''); fetchNotes(''); }} className="px-3 py-1 border rounded">Clear</button>
          </div>
        </section>

        <section>
          <div className="grid gap-4">
            {notes.length === 0 && <div className="text-gray-600">No notes yet.</div>}
            {notes.map(note => (
              <div key={note._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="text-sm text-gray-600">{note.content}</p>
                    <div className="text-xs text-gray-400 mt-2">{new Date(note.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(note)} className="px-2 py-1 border rounded">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="px-2 py-1 border rounded">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
