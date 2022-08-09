import React from "react";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
function CloseButton(props) {
  return (
    <Button variant="contained" endIcon={<CloseIcon />} color="secondary" {...props}>
      {props.children}
    </Button>
  );
}

export default CloseButton;
