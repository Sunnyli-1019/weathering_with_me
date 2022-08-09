//<GeneralSwitch label="Admin" setChecked={setAdminChecked} defaultChecked? />
import React from "react";
import { FormControlLabel, Switch } from "@mui/material";
function GeneralSwitch(props) {
  return (
    <FormControlLabel
      control={
        <Switch
          onChange={(e) => {
            console.log(e.target.checked);
            props.setChecked(e.target.checked);
          }}
        />
      }
      label={"Label"}
      {...props}
    />
  );
}

export default GeneralSwitch;
