import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, Lock, Phone } from 'lucide-react';

const AdminLogin = () => {
    const { setToken, setUser, url } = useContext(StoreContext);
    const [data, setData] = useState({ identifier: "", password: "" });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/login`, data);
            if (response.data.user.role !== 'admin') {
                return toast.error("Access Denied: You are not an Admin");
            }
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            toast.success("Welcome to Admin Control Panel");
            navigate('/admin/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)'
        }}>
            <form onSubmit={onLogin} className="card animate-fade" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary)', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
                        <ShieldCheck color="white" size={32} />
                    </div>
                    <h2 style={{ margin: 0 }}>Admin Login</h2>
                    <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Enter your credentials to access the panel</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                        <Phone size={16} /> Phone or Email
                    </label>
                    <input name="identifier" onChange={onChangeHandler} value={data.identifier} type="text" placeholder="Admin phone or email" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                        <Lock size={16} /> Password
                    </label>
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Admin password" required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px' }}>
                    Authorize Access
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;
