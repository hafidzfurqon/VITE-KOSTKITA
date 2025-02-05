import React, { createContext, useContext } from "react";
import { _users } from "src/_mock";

export const userContext = createContext({})
export const useAppContext = () => useContext(userContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
    // const user = [{
    //   name: "hafidz ganteng",
    // }];
  
    return (
      <userContext.Provider value={_users}>
        {children}
      </userContext.Provider>
    );
  }
  