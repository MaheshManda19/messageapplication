import React, { useEffect, useState } from 'react';
import Header from '../common/Header';
import './Home.css';
import Chat from './chat';
import UserList from './UserList';

const Home = () => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // Track selected user
  const storedData = JSON.parse(localStorage.getItem('Users')) || [];
  const [loggedInUser, setLoggedInUser] = useState(null); // Store logged-in user's information

  useEffect(() => {
    
    // Find the logged-in user from storedData using the login_status property
    const loggedInUserData = storedData.find(user => user.login_status === "login");
    console.log("loginmsalfngkjlarsnfg",loggedInUserData.username)
    
    if (loggedInUserData) {
      setLoggedInUser(loggedInUserData);
    }
  }, []);

  useEffect(() => {
    setRegisteredUsers(storedData);
  }, []);

  // Handler to set the selected user
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  return (
    <>
      <Header />

      <div className='container'>
        <div className='RegisteredUsers'>
          <ul>
            
            <UserList/>
          </ul>
        </div>
        <div className='chat-box'>
          {selectedUser ? <Chat user={selectedUser} loggedInUser={loggedInUser} /> : <p>Select a user to start chatting</p>}
        </div>
      </div>
    </>
  );
};

export default Home;
