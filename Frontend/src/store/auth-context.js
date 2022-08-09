// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React, { useState } from "react";

const AuthContext = React.createContext({
  //we will declare and initialize them in the later part, so the code here only for readability and intelSense, no technical effect
  //notice everything you get from localStorage will be string, since we rely on localStorage, here everything will be string to let intelSense remind user these thing will be string when we access them.
  name: "",
  token: "",
  role: "",
  isLoggedIn: false,
  login: (token, username, role) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const storedToken = localStorage.getItem("token");
  const storedUserName = localStorage.getItem("username");
  const storedRole = localStorage.getItem("role");
  const [token, setToken] = useState(storedToken);
  const [username, setUsername] = useState(storedUserName);
  const [role, setRole] = useState(storedRole);
  const userIsLoggedIn = !!token; //The first ! is just for converting to boolean

  const loginHandler = (token, username, role) => {
    //store to localStorage so that user doesn't need to login next time
    //localStorage.setIten("token") must be earlier than setToken(), since the initial fetch of the home page will use get(), and get() depends on localStorage.set.
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setToken(token); //will trigger userIsLoggedIn to true and then trigger react router to redirect
    setUsername(username);
    setRole(role);
  };

  const logoutHandler = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  };

  //provide an interface for components to use i.e. authCtx.xxx
  const contextValue = {
    token: token,
    username: username,
    role: role,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
