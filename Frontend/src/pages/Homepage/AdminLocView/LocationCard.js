// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import { React, useState } from "react";
import { Box, Grid, TextField, Card, ListItem, ListItemText, ListItemButton, Grow } from "@mui/material";
import SubmitButton from "../../../components/SubmitButton";
import ShortText from "../../../components/ShortText";
import put from "../../../lib/put";
import deleteReq from "../../../lib/delete";
import GeneralContext from "../../../store/general-context";
import { useContext } from "react";
import ClearIcon from "@mui/icons-material/Clear";
function LocationCard(props) {
  const generalCtx = useContext(GeneralContext);
  const [updating, setUpdating] = useState(false);
  const [updateFailed, setUpdateFailed] = useState(undefined);
  const [deleting, setDeleting] = useState(false);
  const [deleteFailed, setDeleteFailed] = useState(undefined);
  const [lat, setLat] = useState(NaN);
  const [lng, setLng] = useState(NaN);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const updateLocation = () => {
    let data = { lat: parseInt(lat), long: parseInt(lng), cityName: cityName, country: country };
    setUpdating(true);
    console.log("updating");
    console.log(`${process.env.REACT_APP_BACKEND_BASE_URL}/location/${props.name}`);
    let x = props.name;
    put(`${process.env.REACT_APP_BACKEND_BASE_URL}/location/${x}`, data)
      .then((result) => {
        setUpdating(false);
        console.log(result);
        if (result.status != 200) {
          setUpdateFailed(true);
        } else {
          setUpdateFailed(false);
          generalCtx.handleLocationsModified();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteLocaiton = () => {
    setDeleting(true);
    deleteReq(`${process.env.REACT_APP_BACKEND_BASE_URL}/location/${props.name}`).then((result) => {
      setDeleting(false);
      if (result.status != 200) {
        setDeleteFailed(true);
      } else {
        setDeleteFailed(false);
        generalCtx.handleLocationsModified();
      }
    });
  };
  return (
    <Grow in={true} timeout={500}>
      <Card sx={{ my: 2 }}>
        <ListItem disablePadding>
          <ListItemButton component="a" href="#simple-list">
            <ListItemText
              primary={
                <Grid container>
                  <Grid item md={4} xs={12}>
                    <Box
                      height="100%"
                      display="flex"
                      alignItems="center"
                      flexDirection={{ xs: "column", md: "row" }}
                      justifyContent={{ xs: "center", md: "start" }}
                      gap="3px"
                    >
                      <ShortText>{`${props.name} `}</ShortText>
                      <ShortText variant="body">{`lat:${props.lat} lng:${props.lng}`}</ShortText>
                    </Box>
                  </Grid>
                  <Grid item md={8} xs={12}>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", md: "row" }}
                      justifyContent={{ xs: "end" }}
                      gap="10px"
                    >
                      <TextField
                        label="new name"
                        onChange={(e) => {
                          setCityName(e.target.value);
                        }}
                      />
                      <TextField
                        label="new lat"
                        onChange={(e) => {
                          setLat(e.target.value);
                        }}
                      />
                      <TextField
                        label="new lng"
                        onChange={(e) => {
                          setLng(e.target.value);
                        }}
                      />
                      <SubmitButton loading={updating} error={updateFailed} onClick={updateLocation}>
                        Update
                      </SubmitButton>
                      <SubmitButton
                        loading={deleting}
                        error={deleteFailed}
                        onClick={deleteLocaiton}
                        color="error"
                        icon={<ClearIcon />}
                      >
                        Delete
                      </SubmitButton>
                    </Box>
                  </Grid>
                </Grid>
              }
            ></ListItemText>
          </ListItemButton>
        </ListItem>
      </Card>
    </Grow>
  );
}

export default LocationCard;
