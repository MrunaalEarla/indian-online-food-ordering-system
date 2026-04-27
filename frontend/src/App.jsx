import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import { Toaster } from 'react-hot-toast';

const App = () => {
    return (
        <div className="app">
            <Toaster position="top-right" />
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin/*" element={<AdminPanel />} />
            </Routes>
            <footer style={{ 
                padding: '3rem 20px', 
                background: 'var(--dark)', 
                color: 'white', 
                textAlign: 'center',
                marginTop: '4rem'
            }}>
                <p>&copy; 2026 Indian Food Delivery. Built for speed and simplicity.</p>
                <div style={{ marginTop: '1rem' }}>
                    <Link to="/admin-login" style={{ fontSize: '0.8rem', color: '#666', textDecoration: 'none' }}>Admin Login</Link>
                </div>
            </footer>
        </div>
    );
};

export default App;
