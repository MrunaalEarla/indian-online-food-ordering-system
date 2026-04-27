import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { translations } from '../translations/data';
import { ArrowRight, Utensils, Coffee, IceCream, Pizza, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const { language } = useContext(StoreContext);
    const t = translations[language];

    const categories = [
        { name: 'Biryani', icon: <Utensils /> },
        { name: 'Fried Rice', icon: <Zap /> },
        { name: 'Manchurian', icon: <Pizza /> },
        { name: 'Cool Drinks', icon: <Coffee /> },
        { name: 'Ice Creams', icon: <IceCream /> },
    ];

    return (
        <div className="home-page animate-fade">
            {/* Hero Section */}
            <section className="hero" style={{
                background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1589187151003-0dd3c82ba8bc?auto=format&fit=crop&q=80&w=1200")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Delicious Indian Food</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Ordered in seconds, delivered with love.</p>
                <Link to="/menu" className="btn btn-primary" style={{ padding: '15px 30px' }}>
                    {t.menu} <ArrowRight />
                </Link>
            </section>

            {/* Categories */}
            <section className="container" style={{ padding: '4rem 20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{t.categories}</h2>
                <div className="category-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '20px'
                }}>
                    {categories.map((cat, idx) => (
                        <Link to={`/menu?category=${cat.name}`} key={idx} className="card" style={{
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}>
                            <div style={{ color: 'var(--primary)', marginBottom: '10px' }}>{cat.icon}</div>
                            <h3>{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            <style>{`
                .category-grid .card:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-5px);
                }
                .category-grid .card:hover div { color: white; }
            `}</style>
        </div>
    );
};

export default Home;
