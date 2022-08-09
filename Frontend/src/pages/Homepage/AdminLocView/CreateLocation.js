// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import { React, useState, useContext } from "react";
import SubmitButton from "../../../components/SubmitButton";
import HorizontalFlex from "../../../layoutLib/HorizontalFlex";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { TextField } from "@mui/material";
import post from "../../../lib/post";
import GeneralContext from "../../../store/general-context";
function CreateLocation(props) {
  const [failed, setFailed] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(NaN);
  const [lng, setLng] = useState(NaN);
  const generalCtx = useContext(GeneralContext);
  const create = () => {
    let data = { lat: parseInt(lat), long: parseInt(lng), cityName: locationName, country: country };
    setLoading(true);
    post(`${process.env.REACT_APP_BACKEND_BASE_URL}/location`, data).then((result) => {
      setLoading(false);
      if (result.status != 200) {
        setFailed(true);
      } else {
        setFailed(false);
        generalCtx.handleLocationsModified();
      }
    });
  };
  return (
    <HorizontalFlex
      flexDirection={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "start" }}
      sx={{ padding: "10px", gap: "15px" }}
    >
      <TextField
        label="city"
        onChange={(e) => {
          setLocationName(e.target.value);
        }}
      />
      <TextField
        label="country"
        onChange={(e) => {
          setCountry(e.target.value);
        }}
      />
      <TextField
        label="latitude"
        onChange={(e) => {
          setLat(e.target.value);
        }}
      />
      <TextField
        label="longtitude"
        onChange={(e) => {
          setLng(e.target.value);
        }}
      />
      <SubmitButton
        variant="contained"
        error={failed}
        color="success"
        onClick={create}
        icon={<AddLocationAltIcon />}
        loading={loading}
      >
        Create Location
      </SubmitButton>
    </HorizontalFlex>
  );
}

export default CreateLocation;
