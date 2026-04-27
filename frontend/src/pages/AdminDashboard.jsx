import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { Users, ShoppingBag, IndianRupee, Activity, TrendingUp, Edit, Trash2, Eye } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { token, url } = useContext(StoreContext);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
            setStats(response.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to fetch stats");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${url}/api/admin/users/tracking`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(response.data);
        } catch (error) {
            toast.error("Failed to fetch users");
        }
    };

    if (loading) return <div className="container">Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard animate-fade">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '2rem' }}>
                <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`}>Overview</button>
                <button onClick={() => { setActiveTab('users'); fetchUsers(); }} className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}>Users</button>
                <button onClick={() => setActiveTab('analytics')} className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`}>Analytics</button>
            </div>

            {activeTab === 'overview' && (
                <div className="overview-section">
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
                        <StatCard icon={<Users />} label="Total Users" value={stats?.totalUsers || 0} color="#007bff" />
                        <StatCard icon={<ShoppingBag />} label="Total Orders" value={stats?.totalOrders || 0} color="#ff4d00" />
                        <StatCard icon={<IndianRupee />} label="Total Revenue" value={`₹${stats?.totalRevenue || 0}`} color="#28a745" />
                        <StatCard icon={<Activity />} label="Daily Orders" value={stats?.dailyOrders?.slice(-1)[0]?.count || 0} color="#6f42c1" />
                    </div>

                    <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', flexWrap: 'wrap' }}>
                        <div className="card">
                            <h3>Daily Orders (Last 7 Days)</h3>
                            <div style={{ height: '300px', marginTop: '1rem' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.dailyOrders}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#ff4d00" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="card">
                            <h3>Most Ordered Items</h3>
                            <div style={{ height: '300px', marginTop: '1rem' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.mostOrdered}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#ffc107" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'users' && (
                <div className="users-section card">
                    <h3>User Management</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Points</th>
                                <th>Last Login</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td>{u.name}</td>
                                    <td>{u.phone}</td>
                                    <td><span className="badge badge-success">{u.points} Pts</span></td>
                                    <td>{new Date(u.lastLogin).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn" style={{ padding: '5px' }}><Eye size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                .stats-grid .card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .icon-circle {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                @media (max-width: 900px) {
                    .charts-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => (
    <div className="card">
        <div className="icon-circle" style={{ backgroundColor: color }}>
            {icon}
        </div>
        <div>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{label}</p>
            <h2 style={{ fontSize: '1.5rem' }}>{value}</h2>
        </div>
    </div>
);

export default AdminDashboard;
