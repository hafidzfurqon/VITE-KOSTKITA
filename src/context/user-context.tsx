import React, { createContext, useContext } from "react";

export const userContext = createContext({})
export const useAppContext = () => useContext(userContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const user = [{
      name: "hafidz ganteng",
    }];
    const data = user;
  
    const userContextValue = 
        {
            users_data : data
        }
    
  
    return (
      <userContext.Provider value={userContextValue}>
        {children}
      </userContext.Provider>
    );
  }
  