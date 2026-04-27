import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { translations } from '../translations/data';
import { Plus, Minus, ShoppingBag, Search, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';

const Menu = () => {
    const { products, addToCart, removeFromCart, cartItems, language } = useContext(StoreContext);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const t = translations[language];

    const categories = ['All', 'Biryani', 'Fried Rice', 'Manchurian', 'Cool Drinks', 'Ice Creams'];

    if (products.length === 0) return <Loading />;

    const filteredProducts = products.filter(p => {
        const matchesCategory = filter === 'All' || p.category === filter;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleAddToCart = (id) => {
        addToCart(id);
        toast.success("Added to cart!");
    };

    return (
        <div className="container animate-fade" style={{ padding: '2rem 20px' }}>
            <h1>{t.menu}</h1>

            {/* Search and Filters */}
            <div style={{ marginTop: '2rem' }}>
                <div className="search-container">
                    <Search size={20} color="var(--gray)" />
                    <input 
                        type="text" 
                        placeholder="Search for your favorite food..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter-bar" style={{
                    display: 'flex',
                    gap: '10px',
                    overflowX: 'auto',
                    paddingBottom: '1rem',
                    marginBottom: '2rem',
                    scrollbarWidth: 'none'
                }}>
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setFilter(cat)}
                            className={`btn ${filter === cat ? 'btn-primary' : ''}`}
                            style={{ whiteSpace: 'nowrap', background: filter === cat ? '' : '#eee' }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '25px'
            }}>
                {filteredProducts.map(product => (
                    <div key={product._id} className={`card product-card ${!product.isAvailable ? 'out-of-stock' : ''}`}>
                        {!product.isAvailable && <span className="stock-tag">Out of Stock</span>}
                        <img src={product.image} alt={product.name} style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '15px',
                            marginBottom: '15px'
                        }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem' }}>{product.name}</h3>
                            <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>₹{product.price}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', margin: '5px 0' }}>
                            <Star size={14} fill="var(--accent)" color="var(--accent)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{product.rating || 4.5}</span>
                            <span style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>• {product.category}</span>
                        </div>
                        
                        {!cartItems[product._id] ? (
                            <button 
                                onClick={() => handleAddToCart(product._id)} 
                                className="btn btn-primary" 
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={!product.isAvailable}
                            >
                                <ShoppingBag size={18} /> {t.addToCart}
                            </button>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f8f8', borderRadius: '12px', padding: '5px', marginTop: '1rem' }}>
                                <button onClick={() => removeFromCart(product._id)} className="btn" style={{ background: 'var(--secondary)', color: 'white', padding: '8px' }}>
                                    <Minus size={16} />
                                </button>
                                <span style={{ fontWeight: 'bold' }}>{cartItems[product._id]}</span>
                                <button onClick={() => handleAddToCart(product._id)} className="btn" style={{ background: 'var(--success)', color: 'white', padding: '8px' }}>
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {filteredProducts.length === 0 && <p style={{ textAlign: 'center', color: 'var(--gray)', marginTop: '2rem' }}>No items found matching your search.</p>}
        </div>
    );
};

export default Menu;
