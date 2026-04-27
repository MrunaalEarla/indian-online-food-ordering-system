import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminItems = () => {
    const { products, url, token, fetchProducts } = useContext(StoreContext);
    const [showForm, setShowForm] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        price: '',
        category: 'Biryani',
        image: '',
        isAvailable: true
    });

    const handleToggleAvailability = async (product) => {
        try {
            await axios.put(`${url}/api/products/${product._id}`, { isAvailable: !product.isAvailable }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Availability updated");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to update availability");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${url}/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Item deleted");
            fetchProducts();
        } catch (error) {
            toast.error("Failed to delete item");
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post(`${url}/api/products`, newItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("New item added!");
            setShowForm(false);
            setNewItem({ name: '', price: '', category: 'Biryani', image: '', isAvailable: true });
            fetchProducts();
        } catch (error) {
            toast.error("Failed to add item");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2>Item Management</h2>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    <Plus size={18} /> Add New Item
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleAdd} className="card animate-fade" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <input required placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input required type="number" placeholder="Price (₹)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="Biryani">Biryani</option>
                        <option value="Fried Rice">Fried Rice</option>
                        <option value="Manchurian">Manchurian</option>
                        <option value="Cool Drinks">Cool Drinks</option>
                        <option value="Ice Creams">Ice Creams</option>
                    </select>
                    <input required placeholder="Image URL" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                        {isSubmitting ? "Adding..." : "Save Item"}
                    </button>
                </form>
            )}

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td><img src={p.image} style={{ width: '40px', height: '40px', borderRadius: '5px', objectFit: 'cover' }} /></td>
                                <td><b>{p.name}</b></td>
                                <td>{p.category}</td>
                                <td>₹{p.price}</td>
                                <td>
                                    <button 
                                        onClick={() => handleToggleAvailability(p)}
                                        style={{ background: 'none', color: p.isAvailable ? 'var(--success)' : 'var(--gray)' }}
                                    >
                                        {p.isAvailable ? <ToggleRight size={30} /> : <ToggleLeft size={30} />}
                                    </button>
                                    <span style={{ fontSize: '0.7rem', display: 'block' }}>{p.isAvailable ? 'Available' : 'Out of Stock'}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => handleDelete(p._id)} style={{ color: 'var(--error)', background: 'none' }}><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminItems;
