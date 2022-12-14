import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import SubmitIconButton from "./SubmitIconButton";
import SendIcon from "@mui/icons-material/Send";
import GeneralContext from "../store/general-context";
import { Container } from "@mui/material";
import post from "../lib/post.js";
const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: "flex",
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end",
    },
    messageBlue: {
      position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#A8DDFD",
      width: "100%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #A8DDFD",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #97C6E3",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px",
      },
    },
    messageOrange: {
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#f8e896",
      width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #dfd087",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #f8e896",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px",
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #dfd087",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px",
      },
    },

    messageContent: {
      padding: 0,
      margin: 0,
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      fontWeight: "300",
      marginTop: "10px",
      bottom: "-3px",
      right: "5px",
    },

    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    displayName: {
      marginLeft: "20px",
    },
  })
);

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const photoURL = props.photoURL ? props.photoURL : "dummy.js";
  const displayName = props.displayName ? props.displayName : "Name";
  const classes = useStyles();
  return (
    <>
      <div className={classes.messageRow}>
        <Avatar alt={displayName} className={classes.orange} src={photoURL}></Avatar>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageBlue}>
            <p className={classes.messageContent}>{message}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const MessageRight = (props) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p className={classes.messageContent}>{message}</p>
      </div>
    </div>
  );
};

export const TextInput = (props) => {
  const generalCtx = React.useContext(GeneralContext);
  const classes = useStyles();
  const [commentInput, setCommentInput] = React.useState("");

  const handleCommentInputOnChange = (event) => {
    setCommentInput(event.target.value);
  };
  
  function submitComment(){
    if(commentInput != null && commentInput != '') {
      post("https://rfriend.herokuapp.com/api/user/comment", {
        event_id: props.eventId,
        comment: commentInput,
      }).then(() => {
        generalCtx.handleEventModified();
      });
    } 
    setCommentInput('');
  }
  
  return (
    <>
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor="addFriend">Comment</InputLabel>
        <OutlinedInput
          id="addFriend"
          type="text"
          value={commentInput}
          onChange={handleCommentInputOnChange}
          label="Comment" //without label attribute, the label will overlap with the border of input field visually
          endAdornment={
            <InputAdornment position="end">
              <SubmitIconButton error={undefined} loading={false} onClick={submitComment}>
                <SendIcon />
              </SubmitIconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </>
  );
};
