import React, { useContext, useState } from 'react';
import { StoreContext } from '../context/StoreContext';
import { translations } from '../translations/data';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, Truck, Upload, IndianRupee } from 'lucide-react';

const Checkout = () => {
    const { getTotalAmount, cartItems, products, token, user, url, language, setCartItems, settings } = useContext(StoreContext);
    const t = translations[language];
    const navigate = useNavigate();
    
    const [address, setAddress] = useState("");
    const [usePoints, setUsePoints] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Online'
    const [isProcessing, setIsProcessing] = useState(false);
    const [screenshot, setScreenshot] = useState(null);

    const isOnlineAvailable = () => {
        if (!settings) return true;
        if (!settings.payments.onlineEnabled) return false;
        if (settings.payments.onlineExpiryDate && new Date(settings.payments.onlineExpiryDate) < new Date()) return false;
        return true;
    };

    const subtotal = getTotalAmount();
    const deliveryFee = 40;
    const discount = usePoints ? Math.min(user?.points || 0, subtotal) : 0;
    const total = subtotal + deliveryFee - discount;

    const onFileChange = (e) => {
        setScreenshot(e.target.files[0]);
    };

    const placeOrder = async (e) => {
        e.preventDefault();
        if (!address) return toast.error("Please provide a delivery address");
        
        if (paymentMethod === 'Online' && !screenshot) {
            return toast.error("Please upload payment screenshot for online payment");
        }

        setIsProcessing(true);
        
        const orderItems = [];
        products.map((item) => {
            if (cartItems[item._id] > 0) {
                let itemInfo = item;
                itemInfo["quantity"] = cartItems[item._id];
                orderItems.push(itemInfo);
            }
        });

        const formData = new FormData();
        formData.append("items", JSON.stringify(orderItems));
        formData.append("totalAmount", total);
        formData.append("address", address);
        formData.append("paymentMethod", paymentMethod);
        formData.append("pointsRedeemed", discount);
        if (screenshot) {
            formData.append("paymentScreenshot", screenshot);
        }

        try {
            const response = await axios.post(`${url}/api/orders`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success("Order Placed Successfully!");
            setCartItems({});
            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setIsProcessing(false);
        }
    };

    const upiId = settings?.payments?.upiId || "yourname@upi";
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=IndianFood&am=${total}&cu=INR`;

    return (
        <div className="container animate-fade" style={{ padding: '2rem 20px' }}>
            <h1>{t.checkout}</h1>
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginTop: '2rem' }}>
                <form onSubmit={placeOrder} style={{ flex: 2, minWidth: '300px' }}>
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3>Delivery & Payment</h3>
                        <div style={{ marginTop: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Delivery Address</label>
                            <textarea 
                                required 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your full address" 
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '100px' }}
                            />
                        </div>

                        {user?.points > 0 && (
                            <div style={{ marginTop: '1.5rem', background: '#f8f9fa', padding: '15px', borderRadius: '10px' }}>
                                <h4 style={{ margin: 0 }}>Reward Points</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                                    <input 
                                        type="checkbox" 
                                        id="usePoints" 
                                        checked={usePoints} 
                                        onChange={(e) => setUsePoints(e.target.checked)} 
                                    />
                                    <label htmlFor="usePoints">Redeem {user.points} Points (Save ₹{Math.min(user.points, subtotal)})</label>
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Select Payment Method</h4>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div 
                                    onClick={() => setPaymentMethod('COD')}
                                    className={`card ${paymentMethod === 'COD' ? 'selected-method' : ''}`} 
                                    style={{ flex: 1, textAlign: 'center', cursor: 'pointer', padding: '15px', border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid #ddd' }}
                                >
                                    <Truck style={{ marginBottom: '5px' }} />
                                    <p>Cash on Delivery</p>
                                </div>
                                <div 
                                    onClick={() => {
                                        if (isOnlineAvailable()) setPaymentMethod('Online');
                                        else toast.error("Online payments temporarily unavailable");
                                    }}
                                    className={`card ${paymentMethod === 'Online' ? 'selected-method' : ''} ${!isOnlineAvailable() ? 'disabled-method' : ''}`} 
                                    style={{ 
                                        flex: 1, 
                                        textAlign: 'center', 
                                        cursor: isOnlineAvailable() ? 'pointer' : 'not-allowed', 
                                        padding: '15px', 
                                        border: paymentMethod === 'Online' ? '2px solid var(--primary)' : '1px solid #ddd',
                                        opacity: isOnlineAvailable() ? 1 : 0.5
                                    }}
                                >
                                    <CreditCard style={{ marginBottom: '5px' }} />
                                    <p>Online Payment</p>
                                    {!isOnlineAvailable() && <p style={{ fontSize: '0.7rem', color: 'red' }}>Currently Unavailable</p>}
                                </div>
                            </div>
                        </div>

                        {paymentMethod === 'Online' && (
                            <div className="animate-fade" style={{ marginTop: '2rem', padding: '20px', border: '2px dashed var(--primary)', borderRadius: '15px', textAlign: 'center', background: '#fff9f6' }}>
                                <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Scan UPI QR Code</h4>
                                <img 
                                    src={settings?.payments?.qrCode ? `${url}${settings.payments.qrCode}` : qrUrl} 
                                    alt="UPI QR Code" 
                                    style={{ width: '200px', height: '200px', objectFit: 'contain', borderRadius: '10px', marginBottom: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', background: 'white' }} 
                                />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                                    <IndianRupee size={16} color="var(--gray)" />
                                    <span style={{ fontWeight: 'bold' }}>{upiId}</span>
                                </div>
                                
                                <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontWeight: 'bold' }}>
                                        <Upload size={18} /> Upload Payment Screenshot
                                    </label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={onFileChange}
                                        style={{ width: '100%', padding: '10px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '8px' }}>
                                        Please scan the QR code above, make the payment of <b>₹{total}</b>, and upload the screenshot here.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div className="card">
                        <h3>Order Summary</h3>
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Items Total</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>Delivery Fee</span>
                                <span>₹{deliveryFee}</span>
                            </div>
                            {usePoints && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: 'var(--success)' }}>
                                    <span>Points Discount</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                            <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <button 
                            onClick={placeOrder}
                            disabled={isProcessing}
                            className="btn btn-primary" 
                            style={{ width: '100%', marginTop: '2rem', padding: '15px' }}
                        >
                            {isProcessing ? 'Processing...' : `Pay ₹${total} & Place Order`}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                .selected-method {
                    background: #fff4f0;
                    border-color: var(--primary) !important;
                }
                .disabled-method {
                    background: #f0f0f0;
                    border-color: #ddd !important;
                }
            `}</style>
        </div>
    );
};

export default Checkout;
