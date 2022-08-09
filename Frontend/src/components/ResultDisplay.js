//This component can be used to express for loading, successful, and fail status
//it depends on props.error and props.loading
//example usage: {loading && <Progress error={error} />}
import React from "react";
import { Zoom } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ErrorIcon from "@mui/icons-material/Error";
import DoneIcon from "@mui/icons-material/Done";
function ResultDisplay(props) {
  return (
    <>
      {props.error === false && (
        <Zoom in={!props.error} timeout={500} color="inherit" {...props}>
          <DoneIcon />
        </Zoom>
      )}
      {props.error === true && (
        <Zoom in={props.error} timeout={500} color="inherit" {...props}>
          <ErrorIcon />
        </Zoom>
      )}
    </>
  );
}

export default ResultDisplay;
