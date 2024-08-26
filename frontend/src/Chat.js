import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChatsByUser, getMessagesByChatId, sendMessage } from './authService';
import './App.css';

const Chat = () => {
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(chatId || null);

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
              {chat.participants.map((p) => p.name).join(', ')}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message._id} className="message">
              <span>{message.senderId.name}: </span>
              {message.content}
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
