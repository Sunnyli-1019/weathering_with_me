import React from "react";
import { Button } from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

function LogoutButton(props) {
  return (
    <Button variant="outlined" startIcon={<ExitToAppIcon />} {...props}>
      Logout
    </Button>
  );
}

export default LogoutButton;
