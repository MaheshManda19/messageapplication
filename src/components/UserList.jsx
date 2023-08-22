import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ loggedInUser }) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const storedData = JSON.parse(localStorage.getItem('Users')) || [];

  useEffect(() => {
    // Filter out the logged-in user from the list
    const filteredUsers = storedData.filter(user => user.username !== loggedInUser.username);
    setRegisteredUsers(filteredUsers);
  }, [loggedInUser]);

  return (
    <div className='user-list-container'>
      <h2>Registered Users</h2>
      <ul>
        {registeredUsers.map((user, index) => (
          <li key={index}>
            <Link to={`/chat/${user.username}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
