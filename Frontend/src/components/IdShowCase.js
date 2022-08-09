import React from "react";
import Button from "@mui/material/Button";
import Grid3x3Icon from "@mui/icons-material/Grid3x3";
function IdShowCase(props) {
  return (
    <Button
      variant="outlined"
      startIcon={<Grid3x3Icon />}
      sx={{ textTransform: "none" }}
      {...props}
    >
      {props.children}
    </Button>
  );
}

export default IdShowCase;
