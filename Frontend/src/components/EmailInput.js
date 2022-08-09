import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import validator from "validator";
function EmailInput(props) {
  const [emailError, setEmailError] = useState(false);
  //provide validity checking for email input at register
  const validateEmail = (e) => {
    let email = e.target.value;
    if (validator.isEmail(email)) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  return (
    <TextField
      error={emailError}
      helperText={emailError ? "Invalid email" : ""}
      type="email"
      label="email"
      className="email-input"
      onChange={(e) => {
        props.setEmail(e.target.value);
        validateEmail(e);
        props.setEmailError(emailError);
      }}
    />
  );
}

export default EmailInput;
