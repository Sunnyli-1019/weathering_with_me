// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React from "react";
import UserCard from "./UserCard";
import { Container, Typography, Divider } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import get from "../../../lib/get";
import CreateUser from "./CreateUser";
import { Filter } from "@mui/icons-material";
import GeneralContext from "../../../store/general-context";
import { LinearProgress } from "@mui/material";
function AdminView() {
  const [users, setUsers] = useState([{}]);
  const [usersModified, setUsersModified] = useState(0);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const generalCtx = useContext(GeneralContext);
  useEffect(() => {
    setIsLoadingUsers(true);
    get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user`).then((result) => {
      console.log(result);
      setIsLoadingUsers(false);
      if (result.status != 200) {
      } else {
        setUsers(result);
      }
    });
  }, []);
  useEffect(() => {
    get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user`).then((result) => {
      console.log(result);
      if (result.status != 200) {
      } else {
        setUsers(result);
      }
    });
  }, [usersModified]);
  let filteredUsers = users.filter((user) => {
    if (generalCtx.searchWord === "") return true;
    else {
      return user.username.includes(generalCtx.searchWord);
    }
  });
  return (
    <>
      <CreateUser setUsersModified={setUsersModified} />
      <Divider />
      {!isLoadingUsers && (
        <Container>
          {filteredUsers.map((user) => {
            return <UserCard username={user.username} setUsersModified={setUsersModified} isAdmin={user.isAdmin} />;
          })}
        </Container>
      )}
      {isLoadingUsers && <LinearProgress />}
    </>
  );
}

export default AdminView;
