import React, { useState } from 'react';
import './style.css';

export type Message = {
    id: string;
    role: 'user' | 'ai';
    text: string;
    toolCalls?: string;
    searchStatus?: string[];
    listings?: { title: string, price: string }[];
};

// Initial state as requested: "kosong tapi siap dipakai"
const initialMessages: Message[] = [];

// If you want to test with dummy data later, you can replace initialMessages with:
/*
[
    {
        id: '1',
        role: 'user',
        text: 'Halo, Bisakah cari apartemen di daerah keputih, Surabaya?'
    },
    {
        id: '2',
        role: 'ai',
        toolCalls: '2 tool calls and 2 messages',
        searchStatus: [
            'Searching the database Found 10 Apartments',
            'Searching the Web Found 6 Apartments'
        ],
        listings: [
            { title: 'Puncak Kertajaya', price: 'Rp2.500.000 - 4.000.000' },
            { title: 'Educity', price: 'Rp2.500.000 - 5.000.000' },
            { title: 'Dian Regency', price: 'Rp2.600.000' },
            { title: 'IT - 608 Residence', price: 'Rp2.500.000 - 3.700.000' }
        ],
        text: 'Baik saya akan membantu anda dalam mencari apartemen di daerah keputih Surabaya.\nBerikut beberapa pilihan apartemen di daerah Keputih, Surabaya:\nApakah perlu saya detailkan perbandingan setiap apartemen dan tipe kamar yang sesuai dengan preferensi anda atau jarak dari tempat kerja anda?'
    },
    {
        id: '3',
        role: 'user',
        text: 'Ya saat ini saya berkuliah di ITS, buatkan perbandingan jarak dan transportasi publiknya'
    }
]
*/

export const Chat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;
        
        // Push user message
        const newMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText };
        setMessages([...messages, newMsg]);
        setInputText('');
        
        // This is where you would hook up the websocket!
        // Simulate an AI typing response for demo purposes:
        /*
        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: Date.now().toString() + 'ai', 
                role: 'ai', 
                text: 'Menerima pesan via Websocket...' 
            }]);
        }, 1000);
        */
    };

    return (
        <div className="chat-container">
            {/* Header (Matching BrowseMore TopBar visually but responsive) */}
            <div style={{ position: 'sticky', top: 0, zIndex: 100, height: '64px', width: '100%', backgroundColor: '#e4e5f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="otter-logo-circle" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc' }}></div>
                
                <div style={{ position: 'absolute', right: '50px', width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: '"Plus Jakarta Sans-Medium", Helvetica', fontWeight: 500, color: '#000', fontSize: '24px' }}>D</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-messages-area">
                <div className="chat-messages-container">
                    {messages.length === 0 ? (
                        <div className="chat-empty-state">
                            Mulai percakapan dengan AI...
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className={`chat-bubble-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
                                {msg.role === 'ai' && (
                                    <div className="chat-avatar-ai">
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#cbd5e1' }} />
                                    </div>
                                )}
                                
                                <div className="chat-bubble-content">
                                    {/* Tool Calls Notification */}
                                    {msg.toolCalls && (
                                        <div className="chat-tool-notification">
                                            <span>{msg.toolCalls}</span>
                                            <span className="icon-down">▼</span>
                                        </div>
                                    )}

                                    {/* AI Bubble Structure */}
                                    {msg.role === 'ai' ? (
                                        <div className="chat-bubble ai-bubble">
                                            {/* Search Statuses */}
                                            {msg.searchStatus && msg.searchStatus.length > 0 && (
                                                <div className="chat-search-statuses">
                                                    {msg.searchStatus.map((status, idx) => (
                                                        <div key={idx} className="chat-search-status">
                                                            <span className="icon-status">🌍</span> {status}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Listings (Apartments Carousel) */}
                                            {msg.listings && msg.listings.length > 0 && (
                                                <div className="chat-listings">
                                                    {msg.listings.map((list, idx) => (
                                                        <div key={idx} className="chat-listing-card">
                                                            <div className="chat-listing-image" />
                                                            <div className="chat-listing-title">{list.title}</div>
                                                            <div className="chat-listing-price">{list.price}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="chat-text ai-text">
                                                {msg.text}
                                            </div>
                                        </div>
                                    ) : (
                                        /* User Bubble Structure */
                                        <div className="chat-bubble user-bubble">
                                            <div className="chat-text user-text">
                                                {msg.text}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                <div className="chat-input-box">
                    <div className="chat-input-tools">
                        <button className="chat-icon-btn plus-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#344e41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                        </button>
                        <button className="chat-icon-btn settings-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#344e41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="8" cy="8" r="3"></circle>
                                <line x1="11" y1="8" x2="21" y2="8"></line>
                                <circle cx="16" cy="16" r="3"></circle>
                                <line x1="3" y1="16" x2="13" y2="16"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <input 
                        type="text" 
                        className="chat-input-field" 
                        placeholder="Chat Dengan AI..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    
                    <button className="chat-send-btn" onClick={handleSend}>
                        ↑
                    </button>
                </div>
            </div>
        </div>
    );
};
