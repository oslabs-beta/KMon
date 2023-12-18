// AppContext.js
import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

// Provider component that wraps children components
export const AppProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  // Function to update userInfo state
  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
  };

  // Return provider component with value set to object containing various states and update functions
  return (
    <AppContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
