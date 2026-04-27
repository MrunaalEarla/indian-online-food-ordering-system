import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Package, Truck, CheckCircle, Clock, Trash2 } from 'lucide-react';

const AdminOrders = () => {
    const { token, url } = useContext(StoreContext);
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${url}/api/orders/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data);
        } catch (error) {
            toast.error("Failed to fetch orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (orderId, status) => {
        try {
            await axios.patch(`${url}/api/orders/${orderId}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const updatePaymentStatus = async (orderId, paymentStatus) => {
        try {
            await axios.patch(`${url}/api/orders/${orderId}/status`, { paymentStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(`Payment status updated to ${paymentStatus}`);
            fetchOrders();
        } catch (error) {
            toast.error("Payment update failed");
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
        <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem' }}>Order Management</h2>
            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>#{order._id.slice(-6).toUpperCase()}</td>
                                <td>
                                    <div>{order.userId?.name}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>{order.userId?.phone}</div>
                                </td>
                                <td style={{ fontSize: '0.8rem' }}>
                                    {order.items.map(i => `${i.name} x ${i.quantity}`).join(', ')}
                                </td>
                                <td>₹{order.totalAmount}</td>
                                <td>
                                    <div style={{ fontSize: '0.8rem' }}>{order.paymentMethod}</div>
                                    <div className="badge badge-warning" style={{ fontSize: '0.6rem', marginBottom: '5px' }}>{order.paymentStatus}</div>
                                    {order.paymentScreenshot && (
                                        <a 
                                            href={`${url}/uploads/payments/${order.paymentScreenshot}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', fontSize: '0.7rem', color: 'var(--primary)', textDecoration: 'underline' }}
                                        >
                                            View Receipt
                                        </a>
                                    )}
                                </td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <select 
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            style={{ padding: '5px', borderRadius: '5px', fontSize: '0.8rem' }}
                                            value={order.status}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Preparing">Preparing</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        {order.paymentMethod === 'Online' && order.paymentStatus !== 'Paid' && (
                                            <button 
                                                onClick={() => updatePaymentStatus(order._id, 'Paid')}
                                                style={{ fontSize: '0.7rem', padding: '3px', borderRadius: '4px', background: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer' }}
                                            >
                                                Verify Payment
                                            </button>
                                        )}
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

export default AdminOrders;
