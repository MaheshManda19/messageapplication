import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { NavLink } from "react-router-dom";

function Header() {
  const localData = JSON.parse(localStorage.getItem("Users"));
  const navigate = useNavigate();

  const handleLogout = () => {
    // Find the user's data and set login_status to an empty string
    const updatedLocalData = localData.map((userData) =>
      userData.login_status === "login"
        ? { ...userData, login_status: "" }
        : userData
    );

    // Save the updated data back to localStorage
    localStorage.setItem("Users", JSON.stringify(updatedLocalData));

   
    navigate("/");
  };

  // Find the user's data from localData whose login_status is "login"
  const currentUserData = localData.find(
    (userData) => userData.login_status === "login"
  );

  return (
    <div className="header-list">
      <div className="nav-username">
        <NavLink
          style={{ textDecoration: "none", color: "white" }}
          to={"/UserList"}
        >
          Home
        </NavLink>
       
      </div>
      <div>{currentUserData ? currentUserData.username : ""}</div>

      <NavLink
        onClick={handleLogout}
        style={{ textDecoration: "none", color: "white" }}
        className="log-out"
        to={"/"}
      >
        Logout
      </NavLink>
    </div>
  );
}

export default Header;