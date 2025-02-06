import React, { useContext, createContext } from "react";

import Loading from "src/components/loading/loading";
import { useFetchAuthenticatedUser } from "src/hooks/auth";
export const userContext = createContext({})
export const useAppContext = () => useContext(userContext);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // const { data = [], isLoading, isPending } = useFetchAuthenticatedUser();
  const data : any = [];
  const isLoading = false
  const isPending = false
  const user = isLoading ? null : data;
  if (isLoading || isPending) {
    return <Loading />;
  }
  const UserContextValue = {
    user,
  };
  
    return (
      <userContext.Provider value={{UserContextValue}}>
        {children}
      </userContext.Provider>
    );
  }
  