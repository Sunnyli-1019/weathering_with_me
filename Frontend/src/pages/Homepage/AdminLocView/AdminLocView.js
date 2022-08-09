// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React from "react";
import {
  Box,
  Grid,
  Card,
  Container,
  TextField,
  Button,
  ListItem,
  ListItemText,
  ListItemButton,
  LinearProgress,
} from "@mui/material";
import ShortText from "../../../components/ShortText";
import { useEffect, useState, useContext } from "react";
import get from "../../../lib/get";
import SubmitButton from "../../../components/SubmitButton";
import HorizontalFlex from "../../../layoutLib/HorizontalFlex";
import LocationCard from "./LocationCard";
import GeneralContext from "../../../store/general-context";
import CreateLocation from "./CreateLocation.js";
function AdminLocView() {
  const [locations, setLocations] = useState([{}]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const generalCtx = useContext(GeneralContext);
  useEffect(() => {
    setLocationsLoading(true);
    get(`${process.env.REACT_APP_BACKEND_BASE_URL}/location`).then((result) => {
      setLocationsLoading(false);
      if (result.status != 200) {
      } else {
        setLocations(result);
      }
    });
  }, []);
  useEffect(() => {
    get(`${process.env.REACT_APP_BACKEND_BASE_URL}/location`).then((result) => {
      if (result.status != 200) {
      } else {
        setLocations(result);
      }
    });
  }, [generalCtx.locationsModified]);
  return (
    <>
      <CreateLocation />
      {locationsLoading && <LinearProgress />}
      {!locationsLoading && (
        <Container>
          {locations.map((location) => {
            return <LocationCard name={location.name} lat={location.lat} lng={location.long} />;
          })}
        </Container>
      )}
    </>
  );
}

export default AdminLocView;
