import React from "react";
import Button from "@mui/material/Button";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
function NameShowCase(props) {
  return (
    <Button
      variant="outlined"
      startIcon={<PersonOutlineIcon />}
      sx={{ textTransform: "none" }}
      {...props}
    >
      {props.children}
    </Button>
  );
}

export default NameShowCase;
