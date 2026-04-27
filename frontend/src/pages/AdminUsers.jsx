import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, TrendingUp, ShoppingBag } from 'lucide-react';

const AdminUsers = () => {
    const { token, url } = useContext(StoreContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${url}/api/admin/users/tracking`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(response.data);
            } catch (error) {
                toast.error("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>Customer Management</h2>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Email/Phone</th>
                            <th>Total Orders</th>
                            <th>Total Spending</th>
                            <th>Reward Points</th>
                            <th>Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td><b style={{ color: 'var(--primary)' }}>{u.name}</b></td>
                                <td>
                                    <div>{u.email || 'No email'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{u.phone}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <ShoppingBag size={14} /> {u.totalOrders}
                                    </div>
                                </td>
                                <td><b>₹{u.totalSpent}</b></td>
                                <td>
                                    <div className="badge badge-success">{u.points} Pts</div>
                                </td>
                                <td style={{ fontSize: '0.8rem' }}>
                                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
