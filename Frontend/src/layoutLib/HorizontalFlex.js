//A helper component for quickly flex items in vertical direction
// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React from "react";
import { Box } from "@mui/material";
function HorizontalFlex(props) {
  return (
    <Box
      display={{ xs: "flex" }}
      flexDirection={{ xs: "row" }}
      alignItems={{ xs: "center" }}
      justifyContent={{ xs: "center" }}
      {...props}
    >
      {props.children}
    </Box>
  );
}

export default HorizontalFlex;
