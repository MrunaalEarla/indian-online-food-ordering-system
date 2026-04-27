import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        address: "",
        role: "customer"
    });
    const navigate = useNavigate();

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    const onRegister = async (event) => {
        event.preventDefault();
        
        // Client-side validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return alert("Please enter a valid email address");
        }

        try {
            const response = await axios.post(`${url}/api/auth/register`, data);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            alert(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '3rem 20px' }}>
            <form onSubmit={onRegister} className="card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Create Account</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Full Name</label>
                    <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="John Doe" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Phone Number</label>
                    <input name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Your phone number" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Email Address</label>
                    <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="email@example.com" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Password</label>
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Address</label>
                    <textarea name="address" onChange={onChangeHandler} value={data.address} placeholder="Full delivery address" required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label>Role</label>
                    <select name="role" onChange={onChangeHandler} value={data.role} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <option value="customer">Customer</option>
                        <option value="delivery">Delivery Person</option>
                        <option value="admin">Admin (For Testing)</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
                <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Login Here</Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
