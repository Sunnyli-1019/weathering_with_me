//This is a submit Button displaying submit icon as default option.
//When it takes props.error, it will show the error icon and success icon depending on the value of props.error.
//As a result, it selfcontained loading fail success indicator for any kind of submit.
import React from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import ResultDisplay from "./ResultDisplay";
import { useEffect } from "react";
function SubmitButton(props) {
  console.log(props);
  return (
    <LoadingButton
      variant="contained"
      endIcon={
        props.error === undefined ? (
          props.icon ? (
            props.icon
          ) : (
            <SendIcon />
          )
        ) : (
          <ResultDisplay error={props.error} />
        )
      }
      type="submit"
      {...props}
    >
      {props.children}
    </LoadingButton>
  );
}

export default SubmitButton;
