import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { MessageLeft, MessageRight, TextInput } from "./Comment.js";

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      //position: "relative"
    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
    },
  })
);

export default function CommentSection(props) {
  const hasComment = (props.eventComment != null);
  const classes = useStyles();
  return (
    <>
      <Typography sx={{ pt: 2, pb: 1 }}>Comments:</Typography>
      {hasComment?props.eventComment.map((comment) => {
          return (<MessageLeft key={comment.id} message={comment.text} timestamp={new Date(comment.createdAt).toString()} photoURL={comment.owner.profileUrl} displayName={comment.owner.name} avatarDisp={true} />)
      }):<></>}
      <TextInput eventId={props.eventId}/>
    </>
  );
}
