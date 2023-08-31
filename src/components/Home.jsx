import React, { useState, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupUsers] = useState([]);
  const [groupname, setGroupName] = useState("");
  const [groupMessages, setGroupMessages] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("Users")) || [];
    setUsers(storedUsers);
    const localstorageMessages =
      JSON.parse(localStorage.getItem("Messages")) || [];
    setMessages(localstorageMessages);
    const localstoreGroupMessages =
      JSON.parse(localStorage.getItem("Groupmessages")) || [];
    setGroupMessages(localstoreGroupMessages);

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
  const toggleGroupModal = () => {
    setShowGroupModal(!showGroupModal);
  };
  const handleCreateGroup = () => {
    const groupExists = groupMessages.find(
      (group) => group.groupName === groupname
    );

    if (groupExists) {
      alert(
        "A group with the same name already exists. Try with another group name"
      );
      return;
    }
    const newGroup = {
      groupName: groupname,
      admin: loggedInUser.username,
      created: new Date().toLocaleString(),
      users: users.map((user) => user.username),
      grpMessages: [],
    };
    const updatedGroupMessages = [...groupMessages, newGroup];
    setGroupMessages(updatedGroupMessages);
    localStorage.setItem("Groupmessages", JSON.stringify(updatedGroupMessages));
    toggleGroupModal();
    setGroupName("");
  };
  const handleSendMessage = () => {
    if(messageInput.trim() !== ""){
    const loggedInUser = users.find((user) => user.login_status === "login");

    if (selectedUser.users) {
      const newMessage = {
        sender: loggedInUser.username,
        content: messageInput,
        timestamp: new Date().toLocaleString(),
      };
      const updatedGroupMessages = groupMessages.map((group) => {
        if (group.groupName === selectedUser.groupName) {
          return {
            ...group,
            grpMessages: [...group.grpMessages, newMessage],
          };
        }
        return group;
      });

      setGroupMessages(updatedGroupMessages);
      localStorage.setItem(
        "Groupmessages",
        JSON.stringify(updatedGroupMessages)
      );
    } else {
      const newMessage = {
        sender: loggedInUser.username,
        receiver: selectedUser.username,
        content: messageInput,
        timestamp: new Date().toLocaleString(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      localStorage.setItem("Messages", JSON.stringify(updatedMessages));
    }

    setMessageInput("");
  }
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
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
    
  };

  const loggedInUser = users.find((user) => user.login_status === "login");
  const filteredMessages = messages.filter(
    (message) =>
      (message.sender === loggedInUser?.username &&
        message.receiver === selectedUser?.username) ||
      (message.sender === selectedUser?.username &&
        message.receiver === loggedInUser?.username)
  );
  console.log(loggedInUser?.username);
  const filteredGroupMessages = groupMessages.filter(
    (group) =>
      group.groupName === selectedUser?.groupName &&
      group.users.includes(loggedInUser.username)
  );

  return (
    <div className="chat-app">
      <div className="user-list">
        <div className="user-list-header">
          <h2>Contacts</h2>
          <div className="create-group" onClick={() => toggleGroupModal()}>Create a Group</div>
        </div>

        <ul>
          {users
            .filter((user) => user.login_status !== "login")
            .map((user, index) => (
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
            ))}
        </ul>
        <div>Groups</div>
        {groupMessages
          .filter((group) => group.users.includes(loggedInUser.username))
          .map((group, groupIndex) => (
            <div
              key={groupIndex}
              className={
                group.groupName === selectedUser.groupName
                  ? "active-group"
                  : "group"
              }
            >
              <p
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "35px",
                  backgroundColor:
                    selectedUser && group.groupName === selectedUser.groupName
                      ? "#e5ebf3"
                      : "transparent",
                }}
                onClick={() => handleUserClick(group)}
              >
                {group.groupName}
              </p>
            </div>
          ))}
      </div>
      {showGroupModal && (
        <div className="group-modal">
          <input
            type="text"
            value={groupname}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name...."
            required
          />
          <div className="create-group">{selectedGroupUsers}</div>
          <button
            onClick={() => {
              if (groupname.trim() !== "") {
                handleCreateGroup(selectedGroupUsers);
              } else {
                alert("Please provide a valid group name.");
              }
            }}
          >
            Create Group
          </button>
          <button onClick={toggleGroupModal}>Cancel</button>
        </div>
      )}

      <div className="chat-content">
        <div className="chat-header">
          <div>{loggedInUser && loggedInUser.username}</div>
          <div onClick={handleLogout}>Logout</div>
        </div>
        <div className="msg-header">
          <div>
            {selectedUser && (selectedUser.username || selectedUser.groupName)}
          </div>
        </div>

        <div className="message-list">
          <div className="messages-container">
            {selectedUser &&
              filteredMessages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.sender === loggedInUser?.username
                      ? "sent"
                      : "received"
                  }`}
                >
                  <span style={{ fontSize: "15px" }}>
                    {message.sender === loggedInUser?.username
                      ? "You"
                      : message.sender}
                  </span>
                  <p>{message.content}</p>
                  <span>{message.timestamp}</span>
                </div>
              ))}

            <div className="groupmessage-list">
              {filteredGroupMessages.map((group, groupIndex) => (
                <div key={groupIndex} className="group-message">
                  {group.grpMessages.map((message, messageIndex) => (
                    <div
                      key={messageIndex}
                      className={`message ${
                        message.sender === loggedInUser?.username
                          ? "sent"
                          : "received"
                      }`}
                    >
                      <span>{message.sender}</span>
                      <p>{message.content}</p>
                      <span>{message.timestamp}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="message-input">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
