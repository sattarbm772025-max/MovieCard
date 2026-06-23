import {
  createContext,
  useState,
} from "react";

export const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {

  const [token, setToken] =
    useState(
      localStorage.getItem("token")
    );

  const [isAdmin, setIsAdmin] =
    useState(
      localStorage.getItem("is_admin") === "true"
    );

  const login = (
    newToken,
    newIsAdmin = false
  ) => {

    localStorage.setItem(
      "token",
      newToken
    );

    localStorage.setItem(
      "is_admin",
      String(Boolean(newIsAdmin))
    );

    setToken(newToken);
    setIsAdmin(Boolean(newIsAdmin));
  };

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user_id"
    );

    localStorage.removeItem(
      "is_admin"
    );

    setToken(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;