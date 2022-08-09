//@ts-check
// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React from "react";
import HorizontalFlex from "../../../layoutLib/HorizontalFlex";
import SubmitButton from "../../../components/SubmitButton";
import { Typography } from "@mui/material";
import NameInput from "../../../components/NameInput";
import PasswordInput from "../../../components/PasswordInput";
import { useState } from "react";
import post from "../../../lib/post";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GeneralSwitch from "../../../components/GeneralSwitch";
function CreateUser(props) {
  const [failed, setFailed] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminChecked, setAdminChecked] = useState(false);
  const create = () => {
    let data = { username, password, isAdmin: adminChecked ? "true" : "false" };
    setLoading(true);
    post(`${process.env.REACT_APP_BACKEND_BASE_URL}/user`, data).then((result) => {
      setLoading(false);
      if (result.status != 200) {
        setFailed(true);
      } else {
        setFailed(false);
        props.setUsersModified((prev) => {
          return prev + 1;
        });
      }
    });
  };
  return (
    <HorizontalFlex
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start" }}
      sx={{ padding: "10px", gap: "15px" }}
    >
      <NameInput setUsername={setUsername} />
      <PasswordInput setPassword={setPassword} />
      <GeneralSwitch label="Admin permission" setChecked={setAdminChecked} />
      <SubmitButton
        variant="contained"
        error={failed}
        color="success"
        onClick={create}
        icon={<PersonAddIcon />}
        loading={loading}
      >
        CreateUser
      </SubmitButton>
    </HorizontalFlex>
  );
}

export default CreateUser;
