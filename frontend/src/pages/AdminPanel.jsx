import React, { useContext, useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { 
    LayoutDashboard, Utensils, Users, ShoppingBag, 
    Gift, CreditCard, LogOut, ChevronRight, Menu 
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminItems from './AdminItems';
import AdminUsers from './AdminUsers';
import AdminOrders from './AdminOrders';
import AdminSettings from './AdminSettings';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const { user, setToken, setUser } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/admin-login');
        }
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
        navigate("/admin-login");
        toast.success("Logged out from Admin Panel");
    };

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Items', path: '/admin/items', icon: <Utensils size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
        { name: 'Rewards', path: '/admin/rewards', icon: <Gift size={20} /> },
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    ];

    return (
        <div className="admin-layout" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`} style={{
                width: sidebarOpen ? '260px' : '80px',
                background: 'var(--dark)',
                color: 'white',
                transition: 'var(--transition)',
                display: 'flex',
                flexDirection: 'column',
                padding: '1.5rem 1rem',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    {sidebarOpen && <h2 style={{ color: 'var(--primary)', margin: 0 }}>ADMIN</h2>}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', color: 'white' }}>
                        <Menu size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    {menuItems.map(item => (
                        <Link 
                            key={item.path} 
                            to={item.path} 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                padding: '12px 15px',
                                borderRadius: '10px',
                                color: location.pathname.startsWith(item.path) ? 'white' : '#aaa',
                                background: location.pathname.startsWith(item.path) ? 'var(--primary)' : 'transparent',
                                marginBottom: '10px',
                                textDecoration: 'none',
                                fontWeight: '600'
                            }}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <button onClick={handleLogout} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    padding: '12px 15px',
                    borderRadius: '10px',
                    color: '#ff4d4d',
                    background: 'rgba(255, 77, 77, 0.1)',
                    marginTop: 'auto',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    <LogOut size={20} />
                    {sidebarOpen && <span>Logout</span>}
                </button>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', background: '#f0f2f5', padding: '2rem' }}>
                <Routes>
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/items" element={<AdminItems />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/orders" element={<AdminOrders />} />
                    <Route path="/rewards" element={<AdminSettings type="rewards" />} />
                    <Route path="/payments" element={<AdminSettings type="payments" />} />
                    <Route path="/" element={<AdminDashboard />} />
                </Routes>
            </main>

            <style>{`
                .admin-sidebar { box-shadow: 4px 0 10px rgba(0,0,0,0.1); }
                @media (max-width: 768px) {
                    .admin-sidebar { position: fixed; z-index: 1000; height: 100%; }
                    .admin-sidebar.closed { transform: translateX(-100%); }
                }
            `}</style>
        </div>
    );
};

export default AdminPanel;
