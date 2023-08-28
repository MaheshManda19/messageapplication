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
  const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
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

  const toggleUserSelection = (user) => {
    setSelectedGroupUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(user.username)) {
        return prevSelectedUsers;
      } else {
        return [...prevSelectedUsers, user.username];
      }
    });
  };

  const handleCreateGroup = () => {
    const newGroup = {
      name: groupname,
      members: selectedGroupUsers,
      messages: [],
    };
    const updatedGroupMessages = [...groupMessages, newGroup];
    setGroupMessages(updatedGroupMessages);
    localStorage.setItem("Groupmessages", JSON.stringify(updatedGroupMessages));
    toggleGroupModal();
  };

  const handleSendMessage = () => {
    const loggedInUser = users.find((user) => user.login_status === "login");

    if (selectedUser.members) {
      const groupChat = {
        sender: loggedInUser.username,
        receiver: selectedUser.members,
        messages: [
          {
            content: messageInput,
            timestamp: new Date().toLocaleString(),
          },
        ],
      };
      const updatedGroupMessages = [...groupMessages, groupChat];
      setGroupMessages(updatedGroupMessages);
      localStorage.setItem(
        "Groupmessages",
        JSON.stringify(updatedGroupMessages)
      );
    } else {
      const chatMessage = {
        sender: loggedInUser.username,
        receiver: selectedUser.username,
        content: messageInput,
        timestamp: new Date().toLocaleString(),
      };
      const updatedMessages = [...messages, chatMessage];
      setMessages(updatedMessages);
      localStorage.setItem("Messages", JSON.stringify(updatedMessages));
    }

    setMessageInput("");
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

  const filteredMessages = messages.filter(
    (message) =>
      (message.sender === loggedInUser?.username &&
        message.receiver === selectedUser?.username) ||
      (message.sender === selectedUser?.username &&
        message.receiver === loggedInUser?.username)
  );

  const filteredGroupMessages = groupMessages.filter((group) => {
    if (
      selectedUser &&
      selectedUser.members &&
      group.receiver &&
      group.receiver.every((member) => selectedUser.members.includes(member))
    ) {
      return true;
    }
    return false;
  });

  return (
    <div className="chat-app">
      {/* User list */}
      <div className="user-list">
        <div className="user-list-header">
          <h2>Contacts</h2>
          <div onClick={() => toggleGroupModal()}>Create a Group</div>
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
          .filter(
            (group) =>
              group.name && group.members.includes(loggedInUser.username)
          )
          .map((group, groupIndex) => (
            <div key={groupIndex}>
              <p onClick={() => handleUserClick(group)}>{group.name}</p>
            </div>
          ))}
      </div>

      {/* Group creation modal */}
      {showGroupModal && (
        <div className="group-modal">
          <h2>Select Users for Group Chat</h2>
          <ul>
            {users.map((user) => (
              <li
                key={user.email}
                onClick={() => toggleUserSelection(user)}
                className={
                  selectedGroupUsers.includes(user.username) ? "selected" : ""
                }
              >
                {user.username}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={groupname}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name...."
          />
          <button onClick={() => handleCreateGroup(selectedGroupUsers)}>
            Create Group
          </button>
          <button onClick={toggleGroupModal}>Cancel</button>
        </div>
      )}

      {/* Chat content */}
      <div className="chat-content">
        <div className="chat-header">
          <div>{loggedInUser && loggedInUser.username}</div>
          <div onClick={handleLogout}>Logout</div>
        </div>
        <div className="msg-header">
          <div>
            {selectedUser && (selectedUser.username || selectedUser.name)}
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
                    {message.sender === loggedInUser?.username ? (
                      <p>You</p>
                    ) : (
                      <p>{message.sender}</p>
                    )}
                  </span>
                  <p>{message.content}</p>
                  <span>{message.timestamp}</span>
                </div>
              ))}
            {selectedGroupUsers &&
              filteredGroupMessages.map((group, index) => (
                <div
                  key={index}
                  className={`message ${
                    group.sender === loggedInUser?.username
                      ? "sent"
                      : "received"
                  }`}
                >
                  {group.messages.map((message, msgIndex) => (
                    <div key={msgIndex}>
                      <span style={{ fontSize: "15px", color: "darkgray" }}>
                        {group.sender === loggedInUser?.username ? (
                          <p>You</p>
                        ) : (
                          <p>{group.sender}</p>
                        )}
                      </span>
                      <p>{message.content}</p>
                      <span>{message.timestamp}</span>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="message-input">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
