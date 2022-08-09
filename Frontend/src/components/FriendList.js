//@ts-check
import React from "react";
import FriendShowCase from "./FriendShowCase";
import post from "../lib/post";
import deleteReq from "../lib/delete";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import VerticalFlex from "../layoutLib/VerticalFlex";
import Profile from "./Profile";
import AuthContext from "../store/auth-context";
import { useContext } from "react";
import GeneralContext from "../store/general-context.js";
function FriendList() {
  const authCtx = useContext(AuthContext);
  const generalCtx = useContext(GeneralContext);
  const [friendLoading, setFriendLoading] = React.useState(false);
  const [friendFailed, setFriendFailed] = React.useState(false);
  const [incomingFriends, setIncomingFriends] = React.useState([{ name: "", id: "" }]);
  const [friends, setFriends] = React.useState([{ name: "", id: "" }]);
  const [pendingFriends, setPendingFriends] = React.useState([{ name: "", id: "" }]);
  const [modified, setModified] = React.useState(0);
  const [showProfile, setShowProfile] = React.useState(false);
  const [selectedFriendId, setSelectedFriendId] = React.useState("");
  const [pendingSelected, setPendingSelected] = React.useState(false);
  useEffect(() => {
    setFriendLoading(true);
    let data = { target_user_id: parseInt(authCtx.id) };
    console.log(data);
    post("https://rfriend.herokuapp.com/api/friend", data)
      .then((result) => {
        console.log(result);
        setFriendLoading(false);
        if (result.status != 200) {
          setFriendFailed(true);
        } else {
          setIncomingFriends(result.waiting_accept);
          setFriends(result.friends);
          setPendingFriends(result.pending_users);
          // console.log(result.pending_users);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [generalCtx.friendModified]);
  let IncomingFriendShowCases = incomingFriends.map((friend) => {
    return (
      <FriendShowCase
        name={friend.name}
        key={friend.id}
        id={friend.id}
        proPic={friend.profile_url}
        onClick={() => {
          setSelectedFriendId(friend.id);
          setShowProfile(true);
          setPendingSelected(false);
        }}
        incoming
        admin
      />
    );
  });
  let FriendShowCases = friends.map((friend) => {
    return (
      <FriendShowCase
        name={friend.name}
        key={friend.id}
        id={friend.id}
        proPic={friend.profile_url}
        onClick={() => {
          setSelectedFriendId(friend.id);
          setShowProfile(true);
          setPendingSelected(false);
        }}
      />
    );
  });
  let PendingFriendShowCases = pendingFriends.map((pending_user) => {
    return (
      <FriendShowCase
        name={pending_user.name}
        key={pending_user.id}
        id={pending_user.id}
        proPic={pending_user.profile_url}
        onClick={() => {
          setSelectedFriendId(pending_user.id);
          setShowProfile(true);
          setPendingSelected(true);
        }}
        pending
      />
    );
  });
  if (friendLoading)
    return (
      <VerticalFlex>
        <CircularProgress />
      </VerticalFlex>
    );
  if (friendFailed) return <VerticalFlex>Failed to get friends.</VerticalFlex>;
  return (
    <>
      {IncomingFriendShowCases}
      {FriendShowCases}
      {PendingFriendShowCases}
      <Profile
        id={selectedFriendId}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        admin={pendingSelected}
      />
    </>
  );
}

export default FriendList;
