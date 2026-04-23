import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://lost-found-backend-x2yl.onrender.com';

function Dashboard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { authorization: token };

  useEffect(() => {
    if (!token) navigate('/');
    else fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/api/items`, { headers });
      setItems(res.data);
    } catch (err) {
      setError('Failed to fetch items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/api/items/${editId}`, form, { headers });
        setEditId(null);
      } else {
        await axios.post(`${API}/api/items`, form, { headers });
      }
      setForm({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await axios.delete(`${API}/api/items/${id}`, { headers });
      fetchItems();
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({ itemName: item.itemName, description: item.description, type: item.type, location: item.location, contactInfo: item.contactInfo });
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${API}/api/items/search?name=${search}`, { headers });
      setItems(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {localStorage.getItem('name')} 👋</h2>
        <button onClick={logout} style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>{editId ? '✏️ Edit Item' : '➕ Add Item'}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="Item Name" value={form.itemName} onChange={e => setForm({...form, itemName: e.target.value})} required style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px' }}>
            <option>Lost</option>
            <option>Found</option>
          </select>
          <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <input placeholder="Contact Info" value={form.contactInfo} onChange={e => setForm({...form, contactInfo: e.target.value})} style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
          <button type="submit" style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            {editId ? 'Update Item' : 'Add Item'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ itemName: '', description: '', type: 'Lost', location: '', contactInfo: '' }); }} style={{ padding: '10px 20px', marginLeft: '10px', background: 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🔍 Search Items</h3>
        <input placeholder="Search by item name..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px', width: '60%', marginRight: '10px' }} />
        <button onClick={handleSearch} style={{ padding: '8px 16px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Search</button>
        <button onClick={fetchItems} style={{ padding: '8px 16px', marginLeft: '10px', background: 'gray', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Show All</button>
      </div>

      <h3>📋 All Items ({items.length})</h3>
      {items.length === 0 && <p>No items found.</p>}
      {items.map(item => (
        <div key={item._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0 }}>{item.itemName}</h4>
            <span style={{ padding: '4px 10px', background: item.type === 'Lost' ? 'red' : 'green', color: 'white', borderRadius: '12px', fontSize: '12px' }}>{item.type}</span>
          </div>
          <p style={{ margin: '8px 0' }}>{item.description}</p>
          <p style={{ margin: '4px 0' }}>📍 {item.location} &nbsp; 📞 {item.contactInfo}</p>
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handleEdit(item)} style={{ padding: '6px 14px', background: 'orange', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
            <button onClick={() => handleDelete(item._id)} style={{ padding: '6px 14px', marginLeft: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;