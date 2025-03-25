import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [parentId, setParentIdState] = useState(
    localStorage.getItem("parentId") || null
  );
  const [storage, setStorage] = useState(null);

  const setParentId = (id) => {
    setParentIdState(id);
    if (id) {
      localStorage.setItem("parentId", id);
    } else {
      localStorage.removeItem("parentId");
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        setUserData,
        parentId,
        setParentId,
        storage,
        setStorage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
