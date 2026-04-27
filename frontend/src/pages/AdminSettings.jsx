import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Gift, CreditCard, ToggleLeft, ToggleRight, Calendar, IndianRupee } from 'lucide-react';

const AdminSettings = ({ type }) => {
    const { token, url, settings, setSettings } = useContext(StoreContext);
    const [localSettings, setLocalSettings] = useState(null);

    useEffect(() => {
        if (settings) {
            setLocalSettings(JSON.parse(JSON.stringify(settings)));
        } else {
            const fetchSettings = async () => {
                try {
                    const response = await axios.get(`${url}/api/public/settings`);
                    setLocalSettings(response.data);
                    setSettings(response.data);
                } catch (error) {
                    toast.error("Failed to fetch settings details");
                }
            };
            fetchSettings();
        }
    }, [settings, type]);

    const [isSaving, setIsSaving] = useState(false);
    const [qrImage, setQrImage] = useState(null);

    const handleSave = async () => {
        setIsSaving(true);
        const formData = new FormData();
        formData.append('rewards', JSON.stringify(localSettings.rewards));
        formData.append('payments', JSON.stringify(localSettings.payments));
        if (qrImage) formData.append('qrCode', qrImage);

        try {
            const response = await axios.post(`${url}/api/admin/settings`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`
                }
            });
            setSettings(response.data);
            setLocalSettings(response.data);
            toast.success("Settings updated successfully");
        } catch (error) {
            console.error("Settings Update Error:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to update settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (!localSettings) return <div>Loading settings...</div>;

    return (
        <div className="animate-fade">
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {type === 'rewards' ? <Gift /> : <CreditCard />}
                {type === 'rewards' ? 'Reward System Control' : 'Payment Control System'}
            </h2>

            <div className="card" style={{ maxWidth: '600px' }}>
                {type === 'rewards' ? (
                    <div className="settings-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>Enable Rewards</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Toggle the entire reward system on/off</p>
                            </div>
                            <button 
                                onClick={() => setLocalSettings({...localSettings, rewards: {...localSettings.rewards, enabled: !localSettings.rewards.enabled}})}
                                style={{ background: 'none', color: localSettings.rewards.enabled ? 'var(--success)' : 'var(--gray)' }}
                            >
                                {localSettings.rewards.enabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Reward Percentage (%)</label>
                            <input 
                                type="number" 
                                value={localSettings.rewards.pointsPerOrder}
                                onChange={(e) => setLocalSettings({...localSettings, rewards: {...localSettings.rewards, pointsPerOrder: e.target.value}})}
                                placeholder="e.g. 10 for 10%"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '5px' }}>Points will be calculated as this percentage of the total order value.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Points Expiry (Days)</label>
                            <input 
                                type="number" 
                                value={localSettings.rewards.pointsExpiryDays}
                                onChange={(e) => setLocalSettings({...localSettings, rewards: {...localSettings.rewards, pointsExpiryDays: e.target.value}})}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="settings-group">
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h4 style={{ margin: 0 }}>Enable Online Payments</h4>
                                <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>Switch between Online + COD or COD only</p>
                            </div>
                            <button 
                                onClick={() => setLocalSettings({...localSettings, payments: {...localSettings.payments, onlineEnabled: !localSettings.payments.onlineEnabled}})}
                                style={{ background: 'none', color: localSettings.payments.onlineEnabled ? 'var(--success)' : 'var(--gray)' }}
                            >
                                {localSettings.payments.onlineEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                            </button>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                                <IndianRupee size={16} /> UPI ID for QR Code
                            </label>
                            <input 
                                type="text" 
                                value={localSettings.payments.upiId || ''}
                                onChange={(e) => setLocalSettings({...localSettings, payments: {...localSettings.payments, upiId: e.target.value}})}
                                placeholder="e.g. 1234567890@upi"
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Payment QR Code (Custom Image)</label>
                            {localSettings.payments.qrCode && (
                                <div style={{ marginBottom: '10px' }}>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Current QR Code:</p>
                                    <img src={`${url}${localSettings.payments.qrCode}`} alt="Payment QR" style={{ width: '150px', borderRadius: '10px', border: '1px solid #eee' }} />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => setQrImage(e.target.files[0])}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '5px' }}>Upload a custom QR code image (like PhonePe/GPay). If empty, the system will auto-generate one using the UPI ID.</p>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '600' }}>
                                <Calendar size={16} /> Online Payment Expiry Date
                            </label>
                            <input 
                                type="date" 
                                value={localSettings.payments.onlineExpiryDate?.split('T')[0] || ''}
                                onChange={(e) => setLocalSettings({...localSettings, payments: {...localSettings.payments, onlineExpiryDate: e.target.value}})}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: '5px' }}>After this date, online payments will be automatically disabled.</p>
                        </div>
                    </div>
                )}

                <button onClick={handleSave} disabled={isSaving} className="btn btn-primary" style={{ width: '100%', gap: '10px' }}>
                    <Save size={18} /> {isSaving ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
