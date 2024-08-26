import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChatsByUser, getMessagesByChatId, sendMessage, getCurrentUser } from './authService';
import './App.css';

const Chat = () => {
    const { chatId } = useParams();
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(chatId || null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const userChats = await getChatsByUser();
                setChats(userChats);
                if (!selectedChat && userChats.length > 0) {
                    setSelectedChat(userChats[0]._id);
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            }
        };
        fetchChats();
    }, [selectedChat]);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const chatMessages = await getMessagesByChatId(selectedChat);
                    setMessages(chatMessages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };
            fetchMessages();
        }
    }, [selectedChat]);

    const handleSendMessage = async () => {
        try {
            const message = await sendMessage(selectedChat, newMessage);
            setMessages([...messages, message]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const getChatName = (chat) => {
        // Find the participant who is not the current user
        const otherParticipant = chat.participants.find(participant => participant._id !== currentUser._id);
        return otherParticipant.name;
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h3>Your Chats</h3>
                <ul>
                    {chats.map((chat) => (
                        <li
                            key={chat._id}
                            onClick={() => setSelectedChat(chat._id)}
                            className={selectedChat === chat._id ? 'active' : ''}
                        >
                            {getChatName(chat)}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="chat-window">
                <div className="chat-messages">
                    {messages.map((message) => (
                        <div 
                            key={message._id} 
                            className={`message-box ${message.senderId._id === currentUser._id ? 'right' : 'left'}`}
                        >
                            <span className="sender-name">{message.senderId.name}: </span>
                            <span className="message-content">{message.content}</span>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
