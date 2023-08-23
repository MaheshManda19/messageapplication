import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("Users")) || [];
    setUsers(storedUsers);

    const userWithoutLogin = storedUsers.find(
      (user) => user.login_status !== "login"
    );
    if (userWithoutLogin) {
      setSelectedUser(userWithoutLogin);
    }
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const generateMessageId = (sender) => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `${sender}_${timestamp}_${random}`;
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== "" && selectedUser) {
      sendMessage();
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === "Enter" && messageInput.trim() !== "" && selectedUser) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    const loggedInUser = users.find((user) => user.login_status === "login");
    const chatMessage = {
      messageId: generateMessageId(loggedInUser.username),
      sender: loggedInUser.username,
      content: messageInput,
      timestamp: new Date().toLocaleString(),
    };

    const updatedUsers = users.map((user) => {
      if (
        user.username === loggedInUser.username ||
        user.username === selectedUser.username
      ) {
        return {
          ...user,
          messages: [...user.messages, chatMessage],
        };
      }
      return user;
    });

    setUsers(updatedUsers);

    localStorage.setItem("Users", JSON.stringify(updatedUsers));
    setMessageInput("");

    setSelectedUser(
      updatedUsers.find((user) => user.username === selectedUser.username)
    );
  };

  const handleLogout = () => {
    const updatedLocalData = users.map((userData) =>
      userData.login_status === "login"
        ? { ...userData, login_status: "" }
        : userData
    );

    localStorage.setItem("Users", JSON.stringify(updatedLocalData));

    navigate("/");
  };

  const loggedInUser = users.find((user) => user.login_status === "login");

  return (
    <div className="chat-app">
      <div className="user-list">
        <h2>Contacts</h2>
        <ul>
          {users.map(
            (user, index) =>
              user.login_status !== "login" && (
                <li
                  key={index}
                  className={
                    selectedUser && user.email === selectedUser.email
                      ? "active"
                      : ""
                  }
                  onClick={() => handleUserClick(user)}
                >
                  {user.username}
                </li>
              )
          )}
        </ul>
      </div>
      <div className="chat-area">
        <div className="header-chat">
          <div>
            {loggedInUser &&
              loggedInUser.login_status === "login" &&
              loggedInUser.username}
          </div>
          <div onClick={handleLogout}>Logout</div>
        </div>
        {selectedUser ? (
          <>
            <div className="header">{selectedUser.username}</div>
            <div className="messages">
              {selectedUser.messages.map((message, index) => (
                <div
                  key={message.messageId}
                  className={`message ${
                    message.sender === loggedInUser.username
                      ? "sent"
                      : "received"
                  }`}
                >
                  <span style={{ fontWeight: "500", color: "white" }}>
                    {message.sender === loggedInUser.username
                      ? "You"
                      : message.sender}
                  </span>
                  <p>{message.content}</p>
                  <span>{message.timestamp}</span>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyUp={handleKeyUp} // Change this line
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>No users available or user data is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
