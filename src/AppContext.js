// AppContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context to manage the application state
const AppContext = createContext();

// Provider component that wraps children components and provides access to user information
export const AppProvider = ({ children }) => {
  // State to hold user information
  // userInfo is an object containing the keys userID, firstName, lastName, userEmail
  const [userInfo, setUserInfo] = useState(null);

  // Function to update the user information in the state
  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  // Return the provider component with a value set to an object containing user information and update functions
  return (
    <AppContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};