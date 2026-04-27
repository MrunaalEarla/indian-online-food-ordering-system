import React, { useState, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
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
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem 20px' }}>
            <form onSubmit={onLogin} className="card animate-fade" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login</h2>
                <div style={{ marginBottom: '1rem' }}>
                    <label>Phone Number or Email</label>
                    <input name="identifier" onChange={onChangeHandler} value={data.identifier} type="text" placeholder="Phone or email" required style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <div style={{ marginBottom: '2rem' }}>
                    <label>Password</label>
                    <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required style={{ width: '100%', padding: '12px', marginTop: '5px', borderRadius: '8px', border: '1px solid #ddd' }} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Login</button>
                <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Register Here</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
