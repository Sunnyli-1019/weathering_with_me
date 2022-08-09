// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { AuthContextProvider } from "./store/auth-context";
import { GeneralContextProvider } from "./store/general-context";
import { PrefContextProvider } from "./store/preference-context";
import App from "./App";

ReactDOM.render(
  <AuthContextProvider>
    <GeneralContextProvider>
      <PrefContextProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PrefContextProvider>
    </GeneralContextProvider>
  </AuthContextProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
