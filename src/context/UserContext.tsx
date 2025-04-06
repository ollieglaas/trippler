// UserContext.tsx
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface UserContextType {
  storedUser: string | null;
  setStoredUser: Dispatch<SetStateAction<string | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedUser, setStoredUser] = useState<string | null>(
    localStorage.getItem("travel_planner_user")
  );

  return (
    <UserContext.Provider value={{ storedUser, setStoredUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
