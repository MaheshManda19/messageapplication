import { createContext, useContext } from "react";
import { useState } from "react";

// Create an AuthContext using createContext
const AuthContext = createContext(null);

// Create an AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  // Initialize state to track the authenticated user
  const [user, setUser] = useState(null);

  // Define a function to log in a user
  const login = (user) => {
    setUser(user); // Set the authenticated user
  };

  // Define a function to log out a user
  const logout = () => {
    setUser(null); // Clear the authenticated user
  };

  // Provide the authentication state and functions to child components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily access authentication context
export const useAuth = () => {
  return useContext(AuthContext); // Use useContext to access AuthContext
};