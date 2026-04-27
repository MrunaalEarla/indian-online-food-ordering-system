import React, { useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { translations } from '../translations/data';
import { Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { products, cartItems, removeFromCart, addToCart, getTotalAmount, language } = useContext(StoreContext);
    const t = translations[language];
    const navigate = useNavigate();

    const cartData = products.filter(p => cartItems[p._id] > 0);

    if (cartData.length === 0) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '5rem 20px' }}>
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/menu')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Go to Menu</button>
            </div>
        );
    }

    return (
        <div className="container animate-fade" style={{ padding: '2rem 20px' }}>
            <h1>{t.cart}</h1>
            <div className="cart-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', marginTop: '2rem' }}>
                <div className="cart-items">
                    {cartData.map(item => (
                        <div key={item._id} className="card" style={{ display: 'flex', gap: '20px', marginBottom: '15px', alignItems: 'center' }}>
                            <img src={item.image} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p>₹{item.price} x {cartItems[item._id]}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => removeFromCart(item._id)} className="btn" style={{ padding: '5px', background: '#eee' }}><Trash2 size={16}/></button>
                                <span>{cartItems[item._id]}</span>
                                <button onClick={() => addToCart(item._id)} className="btn" style={{ padding: '5px', background: '#eee' }}>+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary card" style={{ height: 'fit-content' }}>
                    <h2>Summary</h2>
                    <hr style={{ margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Subtotal</span>
                        <span>₹{getTotalAmount()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span>Delivery Fee</span>
                        <span>₹40</span>
                    </div>
                    <hr style={{ margin: '1rem 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>{t.total}</span>
                        <span>₹{getTotalAmount() + 40}</span>
                    </div>
                    <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                        {t.checkout} <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .cart-content { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Cart;
