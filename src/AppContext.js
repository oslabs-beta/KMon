// AppContext.js
import React, { createContext, useContext, useState } from "react";

// Create a context to manage the application state
const AppContext = createContext();

// Provider component that wraps children components and provides access to user information
export const AppProvider = ({ children }) => {
  // State to hold user information
  const [userInfo, setUserInfo] = useState(null);
  const [selectedGraphs, setSelectedGraphs] = useState([]);
  const [items, setItems] = useState([
    { id: 1, graphId: 2, width: 550, height: 250},
    { id: 2, graphId: 3, width: 550, height: 250},
    { id: 3, graphId: 4, width: 550, height: 250},
  ]);


  // Function to update the user information in the state
  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  // Return the provider component with a value set to an object containing user information and update functions
  return (
    <AppContext.Provider
      value={{ userInfo, updateUserInfo, selectedGraphs, setSelectedGraphs, items, setItems }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};
