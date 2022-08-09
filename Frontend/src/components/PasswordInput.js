import { React, useState } from "react";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, FormHelperText } from "@mui/material";
function PasswordInput(props) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validatePassword = (e) => {
    let password = e.target.value;
    if (password.length < 4 || password.length > 20) {
      setPasswordError(true);
    } else setPasswordError(false);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  //-------------------------------------------------------------- */
  return (
    <FormControl
      variant="outlined"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <InputLabel htmlFor="outlined-adornment-password" color={passwordError && "error"}>
        {props.label ? props.label : "password"}
      </InputLabel>
      <OutlinedInput
        sx={{ width: "210px", height: "56px" }}
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        value={password}
        error={passwordError}
        onChange={(e) => {
          props.setPassword(e.target.value);
          setPassword(e.target.value);
          validatePassword(e);
          props.setPasswordError(passwordError);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                setShowPassword((prev) => {
                  return !prev;
                });
              }}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label ? props.label : "password"}
      />
      {passwordError && !props.noHelperText && (
        <FormHelperText id="outlined-weight-helper-text" sx={{ color: "#d32f2f" }}>
          Must be 4-20 characters
        </FormHelperText>
      )}
    </FormControl>
  );
}

export default PasswordInput;
