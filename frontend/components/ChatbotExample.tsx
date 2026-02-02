// ============================================
// Example Usage: Chatbot Component
// ============================================

import React, { useState } from 'react';
import { useChatStorage } from '../hooks/useTemporaryStorage';

const ChatbotExample: React.FC = () => {
    const { messages, addUserMessage, addAIMessage, clearChat } = useChatStorage();
    const [input, setInput] = useState('');

    // Handle sending a message
    const handleSend = async () => {
        if (!input.trim()) return;

        // Add user message to storage
        addUserMessage(input);
        setInput('');

        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
            addAIMessage(`This is a response to: "${input}"`);
        }, 1000);
    };

    return (
        <div>
            {/* Messages List */}
            <div>
                {messages.map((msg) => (
                    <div key={msg.id} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                        <span className={msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}>
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>

            {/* Input */}
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
            <button onClick={clearChat}>Clear Chat</button>
        </div>
    );
};

export default ChatbotExample;
