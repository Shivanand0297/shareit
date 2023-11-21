import { getCurrentAccount } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types";
import { ReactNode, createContext, useContext,useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isAuthenticated: false,
  isLoading: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); 

  useEffect(() => {
    if(
      localStorage.getItem("cookieFallback") === "[]" || 
      localStorage.getItem("cookieFallback") === null
    ) {
      // navigate("/sign-in")
    }
    
    checkAuthUser()
  }, [navigate])


  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      const currentAccount = await getCurrentAccount();
      if(currentAccount) {
        const { $id, name, username, email, imageUrl, bio } = currentAccount;

        setUser({ id: $id, name, username, email, imageUrl, bio })
        setIsAuthenticated(true)
        return true;
      }

      return false;

    } catch (error) {
      console.log(error);
      return false
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser
  }
  
  return( 
    <AuthContext.Provider value={value} >
      {children}
    </AuthContext.Provider>
  )
};

export default AuthContextProvider;
export const useAuthContext = () => useContext(AuthContext)