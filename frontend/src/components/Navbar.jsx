import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Languages } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';
import { translations } from '../translations/data';

const Navbar = () => {
    const { token, setToken, user, setUser, language, setLanguage, cartItems, url } = useContext(StoreContext);
    const navigate = useNavigate();
    const t = translations[language];

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken("");
        setUser(null);
        navigate("/");
    };

    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    return (
        <nav className="navbar" style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'white',
            boxShadow: 'var(--shadow)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                INDIAN<span style={{ color: 'var(--secondary)' }}>FOOD</span>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <button onClick={() => setLanguage(language === 'en' ? 'te' : 'en')} className="btn" style={{ background: '#f0f0f0', padding: '8px' }}>
                    <Languages size={20} /> {language.toUpperCase()}
                </button>
                
                <Link to="/menu" className="nav-link">{t.menu}</Link>
                
                <Link to="/cart" style={{ position: 'relative' }}>
                    <ShoppingCart />
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>

                {token ? (
                    <div className="user-menu" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/dashboard" title="Profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                            {user?.profilePic ? (
                                <img 
                                    src={`${url}${user.profilePic}`} 
                                    alt="Profile" 
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
                                />
                            ) : (
                                <User />
                            )}
                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }} className="nav-user-name">{user?.name?.split(' ')[0] || 'User'}</span>
                        </Link>
                        <button onClick={logout} className="btn" style={{ background: 'none', color: 'var(--secondary)', padding: '0' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">{t.login}</Link>
                )}
            </div>

            <style>{`
                .nav-link { font-weight: 600; color: var(--dark); }
                .nav-link:hover { color: var(--primary); }
                .cart-badge {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--secondary);
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                @media (max-width: 600px) {
                    .nav-link { display: none; }
                    .nav-user-name { display: none; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
