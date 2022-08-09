//Similar to SubmitButton, this is a submit IconButton displaying submit icon as default option.
//When it takes props.error, it will show the error icon and success icon depending on the value of props.error.
//As a result, it selfcontained loading fail success indicator for any kind of submit.
import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import ResultDisplay from "./ResultDisplay";
import LoadingIcon from "./LoadingIcon";
import { useEffect } from "react";
function SubmitIconButton(props) {
  return (
    <IconButton
      type="submit"
      color="primary"
      disabled={props.loading}
      {...props}
    >
      {props.error === undefined && props.loading === false ? (
        props.children ? (
          props.children
        ) : (
          <SendIcon />
        )
      ) : (
        <>
          {props.loading === true && (
            <LoadingIcon color={props.color ? props.color : "primary"} />
          )}
          {props.error !== undefined && <ResultDisplay error={props.error} />}
        </>
      )}
    </IconButton>
  );
}

export default SubmitIconButton;
