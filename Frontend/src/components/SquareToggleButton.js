//The reason why I make this component is mui togglebutton is sometime retangle instead of square, which is ugly
import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
function SquareToggleButton(props) {
  return (
    <ToggleButton sx={{ height: "54px", width: "54px" }} {...props}>
      {props.children}
    </ToggleButton>
  );
}
export default SquareToggleButton;
