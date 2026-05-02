import React, { useState, useEffect, useCallback } from 'react';
import { getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, getBookings, updateBookingStatus, deleteBooking, getOrders, updateOrderStatus, deleteOrder } from '../api';
import { useApp } from '../context/AppContext';

const Admin = () => {
  const { showToast } = useApp();
  const [menuItems, setMenuItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [menuForm, setMenuForm] = useState({ name: '', description: '', price: '', category: 'General' });
  const [editingId, setEditingId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const adminPassword = 'admin123';

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsLoggedIn(true);
      showToast('Welcome, Admin!', 'success');
    } else {
      showToast('Incorrect password!', 'error');
    }
  };

  const loadMenu = useCallback(async () => {
    try {
      setMenuLoading(true);
      const res = await getMenuItems();
      setMenuItems(res.data.data || []);
    } catch { showToast('Failed to load menu items', 'error'); }
    finally { setMenuLoading(false); }
  }, [showToast]);

  const loadBookings = useCallback(async () => {
    try {
      setBookingsLoading(true);
      const res = await getBookings();
      setBookings(res.data.data || []);
    } catch { showToast('Failed to load bookings', 'error'); }
    finally { setBookingsLoading(false); }
  }, [showToast]);

  const loadOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch { showToast('Failed to load orders', 'error'); }
    finally { setOrdersLoading(false); }
  }, [showToast]);

  useEffect(() => { loadMenu(); loadBookings(); loadOrders(); }, [loadMenu, loadBookings, loadOrders]);

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    if (!menuForm.name || !menuForm.description || !menuForm.price) {
      showToast('Please fill all required fields', 'error'); return;
    }
    try {
      if (editingId) {
        await updateMenuItem(editingId, menuForm);
        showToast('Menu item updated!');
        setEditingId(null);
      } else {
        await addMenuItem(menuForm);
        showToast('Menu item added!');
      }
      setMenuForm({ name: '', description: '', price: '', category: 'General' });
      loadMenu();
    } catch (err) { showToast(err.response?.data?.message || 'Failed to save item', 'error'); }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setMenuForm({ name: item.name, description: item.description, price: item.price, category: item.category });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try { await deleteMenuItem(id); showToast('Menu item deleted!'); loadMenu(); }
    catch { showToast('Failed to delete item', 'error'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateBookingStatus(id, status); showToast('Status updated!'); loadBookings(); }
    catch { showToast('Failed to update status', 'error'); loadBookings(); }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try { await deleteBooking(id); showToast('Booking deleted!'); loadBookings(); }
    catch { showToast('Failed to delete booking', 'error'); }
  };

  const handleOrderStatusChange = async (id, status) => {
    try { await updateOrderStatus(id, status); showToast('Order status updated!'); loadOrders(); }
    catch { showToast('Failed to update order status', 'error'); loadOrders(); }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try { await deleteOrder(id); showToast('Order deleted!'); loadOrders(); }
    catch { showToast('Failed to delete order', 'error'); }
  };

  const exportToCSV = () => {
    if (bookings.length === 0) { showToast('No bookings to export', 'error'); return; }
    const headers = ['Name', 'Email', 'Phone', 'Guests', 'Date', 'Time', 'Message', 'Status'];
    const csvData = bookings.map(b => [
      `"${b.name}"`, `"${b.email}"`, `"${b.phone || '-'}"`, b.guests,
      `"${new Date(b.contact_date).toLocaleDateString()}"`, `"${b.contact_time}"`,
      `"${b.message.replace(/"/g, '""')}"`, `"${b.status}"`
    ]);
    const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported to CSV successfully!', 'success');
  };

  const categories = ['Appetizers','Main Course','Italian','Japanese','Asian','Beverages','Desserts','Healthy','General'];

  if (!isLoggedIn) {
    return (
      <section className="section">
        <div className="login-container" style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🔐 Admin Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label>Admin Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} required />
            </div>
            <button type="submit" className="admin-btn" style={{ width: '100%', padding: '12px' }}>Login</button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#666' }}>Default password: <code>admin123</code></p>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="admin-wrapper">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2>🛠️ Admin Dashboard</h2>
          <button onClick={() => setIsLoggedIn(false)} className="admin-btn" style={{ background: '#ef4444', padding: '8px 15px', fontSize: '14px' }}>
            🚪 Logout
          </button>
        </div>
        <div className="admin-container">

          {/* Stats */}
          <div className="admin-section">
            <div className="section-header"><h3>📊 Quick Stats</h3></div>
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon">🍽️</div><div className="stat-info"><h4>{menuItems.length}</h4><p>Menu Items</p></div></div>
              <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-info"><h4>{bookings.filter(b=>b.status==='pending').length}</h4><p>Pending Bookings</p></div></div>
              <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-info"><h4>{bookings.filter(b=>b.status==='confirmed').length}</h4><p>Confirmed</p></div></div>
              <div className="stat-card"><div className="stat-icon">🛒</div><div className="stat-info"><h4>{orders.filter(o=>o.status==='pending').length}</h4><p>Pending Orders</p></div></div>
              <div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-info"><h4>4.8</h4><p>Rating</p></div></div>
            </div>
          </div>

          {/* Menu Management */}
          <div className="admin-section">
            <div className="section-header">
              <h3>🍽️ Menu Management</h3>
              <p>{editingId ? 'Editing existing item' : 'Add new menu item'}</p>
            </div>
            <form className="admin-form" onSubmit={handleMenuSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Dish Name *</label>
                  <input value={menuForm.name} onChange={e=>setMenuForm({...menuForm,name:e.target.value})} placeholder="e.g. Grilled Salmon" required />
                </div>
                <div className="form-group">
                  <label>Price *</label>
                  <input type="number" value={menuForm.price} onChange={e=>setMenuForm({...menuForm,price:e.target.value})} placeholder="0.00" min="0" step="0.01" required />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={menuForm.category} onChange={e=>setMenuForm({...menuForm,category:e.target.value})}>
                  {categories.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea value={menuForm.description} onChange={e=>setMenuForm({...menuForm,description:e.target.value})} placeholder="Describe the dish..." required rows="3"></textarea>
              </div>
              <div style={{display:'flex',gap:'10px'}}>
                <button type="submit" className="admin-btn">{editingId ? '✏️ Update Item' : '➕ Add Menu Item'}</button>
                {editingId && <button type="button" className="admin-btn" style={{background:'#6b7280'}} onClick={()=>{setEditingId(null);setMenuForm({name:'',description:'',price:'',category:'General'});}}>Cancel</button>}
              </div>
            </form>

            <div className="table-container">
              <h4>📋 Current Menu Items</h4>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead>
                  <tbody>
                    {menuLoading ? (
                      <tr><td colSpan="5" style={{textAlign:'center'}}>⏳ Loading...</td></tr>
                    ) : menuItems.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign:'center'}}>No menu items found</td></tr>
                    ) : menuItems.map(item => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.description.substring(0,50)}...</td>
                        <td>${item.price}</td>
                        <td>{item.category}</td>
                        <td className="action-buttons">
                          <button className="edit-btn" onClick={()=>handleEdit(item)}>Edit</button>
                          <button className="delete-btn" onClick={()=>handleDeleteMenu(item._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Booking Management */}
          <div className="admin-section">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>📅 Booking Management</h3>
              <button onClick={exportToCSV} className="admin-btn" style={{ background: '#059669', padding: '8px 15px', fontSize: '14px' }}>
                📁 Export to Excel (CSV)
              </button>
            </div>
            <div className="table-container">
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Guests</th><th>Message</th><th>Date & Time</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {bookingsLoading ? (
                      <tr><td colSpan="9" style={{textAlign:'center'}}>⏳ Loading...</td></tr>
                    ) : bookings.length === 0 ? (
                      <tr><td colSpan="9" style={{textAlign:'center'}}>No bookings found</td></tr>
                    ) : bookings.map(b => (
                      <tr key={b._id}>
                        <td>{b.name}</td>
                        <td>{b.email}</td>
                        <td>{b.phone || '-'}</td>
                        <td>{b.guests}</td>
                        <td title={b.message}>{b.message.substring(0,40)}...</td>
                        <td>{new Date(b.contact_date).toLocaleDateString()} {b.contact_time}</td>
                        <td>{b.paymentMethod}</td>
                        <td>
                          <select className="status-select" value={b.status} onChange={e=>handleStatusChange(b._id,e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="action-buttons">
                          <button className="delete-btn" onClick={()=>handleDeleteBooking(b._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Orders Management */}
          <div className="admin-section">
            <div className="section-header">
              <h3>🛒 Orders Management</h3>
              <p>Manage food orders</p>
            </div>
            <div className="table-container">
              {ordersLoading ? (
                <div className="loading">Loading orders...</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Type</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="8" style={{textAlign:'center'}}>No orders found</td></tr>
                    ) : orders.map(o => (
                      <tr key={o._id}>
                        <td>{o.customerName}</td>
                        <td>{o.customerEmail}</td>
                        <td>{o.items.map(i => `${i.menuItem.name} x${i.quantity}`).join(', ')}</td>
                        <td>₹{o.totalAmount}</td>
                        <td>{o.deliveryType}</td>
                        <td>{o.paymentMethod}</td>
                        <td>
                          <select className="status-select" value={o.status} onChange={e=>handleOrderStatusChange(o._id,e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready">Ready</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="action-buttons">
                          <button className="delete-btn" onClick={()=>handleDeleteOrder(o._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default Admin;
