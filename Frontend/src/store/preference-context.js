//mode is for recording user's preference on light mode or dark mode
// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React, { useState } from "react";
import { createTheme } from "@mui/material/styles";
const PrefContext = React.createContext({
  //no actual effect, since you can see we will declare them in the later part, so the code here only for readability and intelSense
  theme: {},
});

export const PrefContextProvider = (props) => {
  const storedMode = localStorage.getItem("mode");
  let mode = "";
  if (storedMode === undefined || "light") {
    mode = "light";
  }
  const [theme, setTheme] = useState(createTheme({ palette: { mode: mode } }));
  const switchModeHandler = () => {
    console.log(theme);
    if (theme.palette.mode === "light") {
      setTheme(createTheme({ palette: { mode: "dark" } }));
    } else {
      setTheme(createTheme({ palette: { mode: "light" } }));
    }

    //store to localStorage so that user doesn't need to login next time
    localStorage.setItem("mode", theme.palette.mode);
  };
  //provide an interface for components to use i.e. prefCtx.xxx
  const contextValue = {
    switchMode: switchModeHandler,
    theme: theme,
  };

  return <PrefContext.Provider value={contextValue}>{props.children}</PrefContext.Provider>;
};

export default PrefContext;
