//@ts-check
import React from "react";
import { ListItem, ListItemIcon, ListItemText, Avatar, Box } from "@mui/material";
import { useState, useContext } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SubmitIconButton from "./SubmitIconButton";
import deleteReq from "../lib/delete";
import put from "../lib/put";
import GeneralContext from "../store/general-context.js";
function FriendShowCase(props) {
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(undefined);
  const [accepting, setAccepting] = useState(false);
  const [acceptFailed, setAcceptFailed] = useState(undefined);
  const [rejecting, setRejecting] = useState(false);
  const [rejectFailed, setRejectFailed] = useState(undefined);
  const generalCtx = useContext(GeneralContext);
  const deleteFriend = () => {
    let data = { target_user_id: props.id };
    setDeleting(true);
    deleteReq("https://rfriend.herokuapp.com/api/friend", data).then((result) => {
      setDeleting(false);
      if (result.status != 200) {
        setDeleteFailed(true);
      } else {
        setDeleteFailed(false);
        //props.handleModified();
        generalCtx.handleFriendModified();
      }
    });
  };
  const acceptFriend = () => {
    let data = { target_user_id: parseInt(props.id) };
    setAccepting(true);
    put("https://rfriend.herokuapp.com/api/friend/accept", data)
      .then((result) => {
        setAccepting(false);
        if (result.status != 200) {
          setAcceptFailed(true);
        } else {
          setAcceptFailed(false);
          //props.handleModified();
          generalCtx.handleFriendModified();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const rejectFriend = () => {
    let data = { target_user_id: parseInt(props.id) };
    setRejecting(true);
    deleteReq("https://rfriend.herokuapp.com/api/friend/request", data).then((result) => {
      setRejecting(false);
      if (result.status != 200) {
        setRejectFailed(true);
      } else {
        setRejectFailed(false);
        generalCtx.handleFriendModified();
      }
    });
  };
  return (
    <ListItem
      button
      onClick={(e) => {
        e.stopPropagation();
        props.onClick();
      }}
    >
      <ListItemIcon>
        <Avatar src={props.proPic} />
      </ListItemIcon>
      <ListItemText
        primary={props.name}
        secondary={props.pending ? "pending..." : props.incoming ? "let's be friend!" : null}
      />
      {props.incoming && (
        <>
          {!rejecting && (
            <SubmitIconButton
              loading={accepting}
              error={acceptFailed}
              color="success"
              onClick={(e) => {
                e.stopPropagation();
                acceptFriend();
              }}
            >
              <CheckCircleIcon />
            </SubmitIconButton>
          )}
          {!accepting && (
            <SubmitIconButton
              loading={rejecting}
              error={rejectFailed}
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                rejectFriend();
              }}
            >
              <CancelIcon />
            </SubmitIconButton>
          )}
        </>
      )}
    </ListItem>
  );
}

export default FriendShowCase;
