import React from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, Input } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AuthContext from "../store/auth-context";
import GeneralContext from "../store/general-context.js";
import { useContext, useState } from "react";
import put from "../lib/put";
import get from "../lib/get";
import ResultDisplay from "./ResultDisplay";
import LoadingIcon from "./LoadingIcon";
import SubmitIconButton from "./SubmitIconButton";
function AddFriendField() {
  const [adding, setAdding] = useState(false);
  const [addFailed, setAddFailed] = useState(undefined);
  const [friendId, setFriendId] = useState(NaN);
  const authCtx = useContext(AuthContext);
  const generalCtx = useContext(GeneralContext);
  const addFriend = () => {
    let data = { target_user_id: friendId };
    setAdding(true);
    setAddFailed(undefined);
    console.log(data);
    put("https://rfriend.herokuapp.com/api/friend/request", data)
      .then((result) => {
        setAdding(false);
        console.log(result);
        if (result.status != 201) {
          setAddFailed(true);
        } else {
          setAddFailed(false);
          generalCtx.handleFriendModified();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <FormControl sx={{ my: 1, width: "25ch" }} variant="outlined">
        <InputLabel htmlFor="addFriend">Add friend by id</InputLabel>
        <OutlinedInput
          id="addFriend"
          type="number"
          label="Add friend by id" //without label attribute, the label will overlap with the border of input field visually
          endAdornment={
            <InputAdornment position="end">
              <SubmitIconButton error={addFailed} loading={adding} edge="end" onClick={addFriend}>
                <GroupAddIcon />
              </SubmitIconButton>
            </InputAdornment>
          }
          value={friendId} //since we don't allow negative value for friend id, so we are using react bidirectional binding here
          onChange={(e) => {
            console.log(e);
            if (e.target.value > 0) setFriendId(e.target.value);
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </FormControl>
    </>
  );
}

export default AddFriendField;
