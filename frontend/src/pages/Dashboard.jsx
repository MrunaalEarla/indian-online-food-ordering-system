import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { Package, Truck, CheckCircle, Clock, Edit2, Save, X, Camera, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { token, user, setUser, url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        address: user?.address || ""
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/orders/myorders`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
        if (user) {
            setProfileData({
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address
            });
            if (user.profilePic) setImagePreview(`${url}${user.profilePic}`);
        }
    }, [token, user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', profileData.name);
        formData.append('phone', profileData.phone);
        formData.append('email', profileData.email);
        formData.append('address', profileData.address);
        if (image) formData.append('profilePic', image);

        try {
            const response = await axios.put(`${url}/api/auth/profile`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#FFA500';
            case 'Preparing': return '#007BFF';
            case 'Out for Delivery': return '#FF4D00';
            case 'Delivered': return '#28A745';
            case 'Cancelled': return '#DC3545';
            default: return '#000';
        }
    };

    return (
        <div className="container animate-fade" style={{ padding: '2rem 20px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '2rem' }}>
                    <h1>My Dashboard</h1>
                    <div className="card" style={{ background: 'var(--accent)', padding: '10px 20px', fontWeight: 'bold' }}>
                        Reward Balance: {user?.points || 0} Points
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    borderRadius: '50%', 
                                    overflow: 'hidden', 
                                    background: '#eee',
                                    border: '3px solid var(--primary)'
                                }}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <User size={40} color="#ccc" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label style={{ 
                                        position: 'absolute', bottom: 0, right: 0, 
                                        background: 'var(--primary)', padding: '6px', 
                                        borderRadius: '50%', cursor: 'pointer', color: 'white',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                    }}>
                                        <Camera size={16} />
                                        <input type="file" hidden onChange={handleImageChange} accept="image/*" />
                                    </label>
                                )}
                            </div>
                            
                            {!isEditing ? (
                                <div>
                                    <h2 style={{ margin: 0 }}>{user?.name}</h2>
                                    <p style={{ color: 'var(--gray)', margin: '5px 0' }}>{user?.email}</p>
                                    <p style={{ margin: '5px 0' }}><b>Phone:</b> {user?.phone}</p>
                                    <p style={{ margin: '5px 0' }}><b>Address:</b> {user?.address}</p>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateProfile} style={{ flex: 1, minWidth: '250px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <input 
                                            placeholder="Name" 
                                            value={profileData.name} 
                                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                            required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                                        />
                                        <input 
                                            placeholder="Phone" 
                                            value={profileData.phone} 
                                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                            required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd' }}
                                        />
                                        <input 
                                            placeholder="Email" 
                                            value={profileData.email} 
                                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                            required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', gridColumn: 'span 2' }}
                                        />
                                        <textarea 
                                            placeholder="Address" 
                                            value={profileData.address} 
                                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                            required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ddd', gridColumn: 'span 2' }}
                                        />
                                    </div>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                                        <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Save size={16} /> Save Changes
                                        </button>
                                        <button type="button" onClick={() => setIsEditing(false)} className="btn" style={{ background: '#eee', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                        
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="btn" style={{ background: '#f8f8f8', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Order History</h2>
            <div className="order-list">
                {orders.length === 0 ? <p>No orders found.</p> : (
                    orders.map(order => (
                        <div key={order._id} className="card" style={{ marginBottom: '20px', padding: '25px', borderLeft: `8px solid ${getStatusColor(order.status)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <h3 style={{ margin: 0 }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                                        <span className="badge" style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleString()}</p>
                                    <div style={{ marginTop: '15px' }}>
                                        <p><b>Items:</b></p>
                                        <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                                            {order.items.map((i, idx) => (
                                                <li key={idx} style={{ fontSize: '0.9rem', color: '#444' }}>• {i.name} x {i.quantity}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p style={{ marginTop: '10px' }}><b>Delivery Address:</b> {order.address}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h2 style={{ color: 'var(--primary)', margin: 0 }}>₹{order.totalAmount}</h2>
                                    <p style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>+{order.pointsEarned} Pts Earned</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
