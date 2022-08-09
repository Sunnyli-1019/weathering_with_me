import React from "react";
import { Typography } from "@mui/material";
function ShortText(props) {
  return (
    <Typography variant="h6" noWrap component="span" sx={{ display: "block" }} {...props}>
      {props.children}
    </Typography>
  );
}

export default ShortText;
