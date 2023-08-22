import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Chat = ({ loggedInUser }) => {
  const { username } = useParams();
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const storedData = JSON.parse(localStorage.getItem('Users')) || [];

  useEffect(() => {
    const currentUser = storedData.find(user => user.username === username);
    if (currentUser) {
      setMessages(currentUser.messages || []);
    }
  }, [username]);

  const handleMessageSend = () => {
    if (inputMessage.trim() !== '') {
      const newMessage = {
        sender: loggedInUser, // Use the username property of the loggedInUser object
        message: inputMessage,
      };

      const updatedUsers = storedData.map(user => {
        if (user.username === username) {
          return { ...user, messages: [...(user.messages || []), newMessage] };
        }
        return user;
      });

      localStorage.setItem('Users', JSON.stringify(updatedUsers));

      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  return (
    <div className='chat-container'>
      <h2>Chat with {username}</h2>
      <div className='chat-messages'>
        {messages.map((message, index) => (
          <div key={index} className='message'>
            <p>{message.sender}</p>
            <p>{message.message}</p>
          </div>
        ))}
      </div>
      <div className='chat-input'>
        <input
          type='text'
          placeholder='Type your message...'
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
