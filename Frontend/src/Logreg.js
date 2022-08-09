//@ts-check
// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import { Button, ButtonGroup, Slide, TextField, Grid, Stack, FormControl, Alert, Grow, Box } from "@mui/material";
import VerticalFlex from "./layoutLib/VerticalFlex";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import * as React from "react";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import post from "./lib/post";
import PasswordInput from "./components/PasswordInput";
import CfPasswordInput from "./components/CfPasswordInput";
import EmailInput from "./components/EmailInput";
import NameInput from "./components/NameInput";
import SubmitButton from "./components/SubmitButton";
import AuthContext from "./store/auth-context";
import redirectToMailBox from "./lib/redirectToMailBox";
function Logreg() {
  const [logChecked, setLogChecked] = React.useState(false);
  const [regChecked, setRegChecked] = React.useState(false);
  const [forgetChecked, setForgetChecked] = React.useState(false);
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState(null);
  const [fail, setFail] = React.useState(false);
  const [failMessage, setFailMessage] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [emailSuccess, setEmailSuccess] = React.useState(false);
  const authCtx = useContext(AuthContext);
  const handleLog = () => {
    setLogChecked((prev) => !prev);
    setRegChecked(false);
    setForgetChecked(false);
  };
  const handleReg = () => {
    setRegChecked((prev) => !prev);
    setLogChecked(false);
    setForgetChecked(false);
  };
  const handleForget = () => {
    setForgetChecked((prev) => !prev); //used to toggle the value of forgetChecked
    setLogChecked(false);
    setRegChecked(false);
  };
  //provide validity checking for email input at register
  useEffect(() => {
    setEmailError(false);
    setFail(false);
    setFailMessage(null);
  }, [logChecked, regChecked, forgetChecked]); //Reset the error showing flag if the user give up to enter the current information
  const reg = (e) => {
    e.preventDefault();
    setSubmitting(true);
    let data = { username, password, isAdmin: false };
    console.log(data);
    post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/register`, data)
      .then((result) => {
        console.log("Response:", result);
        if (result.status != 200) {
          setFail(true);
          setFailMessage(result.message);
        } else {
          authCtx.login(result.token, data.username, result.role);
        }
      })
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const log = (e) => {
    e.preventDefault();
    setSubmitting(true);
    let data = { username, password };
    console.log(data);
    console.log(process.env.REACT_APP_BACKEND_BASE_URL);
    post(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/login`, data)
      .then((result) => {
        console.log("Response:", result);
        if (result.status != 200) {
          setFail(true);
          setFailMessage(result.message);
        } else {
          console.log("login成功");
          authCtx.login(result.token, data.username, result.role);
        }
      })
      .then(() => {
        setSubmitting(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <Box display="flex" flexDirection={"column"} alignItems={"center"}>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        className="regloggroup"
        sx={{ marginBottom: 2 }}
      >
        <Button className="reglog" onClick={handleLog} sx={{ width: "86px" }}>
          <Stack alignItems="center">
            <LoginIcon />
            Login
          </Stack>
        </Button>
        <Button className="reglog" onClick={handleReg} sx={{ width: "86px" }}>
          <Stack alignItems="center">
            <AppRegistrationIcon />
            Register
          </Stack>
        </Button>
      </ButtonGroup>
      <Slide direction="up" in={logChecked} mountOnEnter unmountOnExit className="info-input-container">
        {/* login form */}
        <form onSubmit={log}>
          <VerticalFlex gap="10px">
            <NameInput setUsername={setUsername} />
            <PasswordInput setPassword={setPassword} />
            <SubmitButton loading={submitting} type="submit">
              Submit
            </SubmitButton>
            {/* Display error message if error when submit */}
            {fail && <Alert severity="error">{failMessage}</Alert>}
          </VerticalFlex>
        </form>
      </Slide>
      <Slide direction="up" in={regChecked} mountOnEnter unmountOnExit className="info-input-container">
        {/* reg form */}
        <form onSubmit={reg}>
          {!emailSuccess && (
            <VerticalFlex gap="10px">
              <NameInput setUsername={setUsername} />
              <PasswordInput setPassword={setPassword} />
              <CfPasswordInput password={password} />
              <SubmitButton type="submit" loading={submitting}>
                Submit
              </SubmitButton>
              {/* Display error message if error when submit */}
              {fail && <Alert severity="error">{failMessage}</Alert>}
            </VerticalFlex>
          )}
          {emailSuccess && (
            <Button
              variant="contained"
              color="warning"
              onClick={() => {
                redirectToMailBox(email);
              }}
            >
              Check your email
            </Button>
          )}
        </form>
      </Slide>
    </Box>
  );
}
export default Logreg;
