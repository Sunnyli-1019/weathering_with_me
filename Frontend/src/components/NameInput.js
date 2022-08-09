import { React, useState } from "react";
import TextField from "@mui/material/TextField";
function NameInput(props) {
  const [nameError, setNameError] = useState(false);
  //provide validity checking for email input at register
  const validateName = (e) => {
    let name = e.target.value;
    if (name.length >= 4 && name.length <= 20) {
      setNameError(false);
    } else {
      setNameError(true);
    }
  };
  return (
    <TextField
      error={nameError}
      helperText={nameError ? "Must be 4-20 characters" : ""}
      label={props.label ? props.label : "username"}
      className="info-input"
      onChange={(e) => {
        props.setUsername(e.target.value);
        validateName(e);
        props.setNameError(nameError);
      }}
    />
  );
}

export default NameInput;
