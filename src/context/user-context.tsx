import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, createContext } from "react";

import Loading from "src/components/loading/loading";
import { useFetchAuthenticatedUser } from "src/hooks/auth";
export const userContext = createContext({})
export const useAppContext = () => useContext(userContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const token = sessionStorage.getItem("token"); 
  const refresh_token = sessionStorage.getItem("refresh_token"); 
  const isAuthenticated = Boolean(token || refresh_token); 
  const { data = [], isLoading, isPending, } = useFetchAuthenticatedUser(isAuthenticated);
  // const data : any = []
  // const isLoading = false
  // const isPending = false
  const user = isLoading ? null : data;

  if (isAuthenticated && (isLoading || isPending)) {
    return <Loading />;
  }

  const UserContextValue = { user, isAuthenticated };
  console.log(user);
  return (
    <userContext.Provider value={{UserContextValue}}>
      {children}
    </userContext.Provider>
  );
}

  