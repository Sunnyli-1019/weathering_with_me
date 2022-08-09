// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React, { useState, useEffect, useContext } from "react";
import { alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import get from "../../lib/get";
import post from "../../lib/post";
import GeneralContext from "../../store/general-context";
import SubmitButton from "../../components/SubmitButton";
import { TextField, Box } from "@mui/material";
import LocationMap from "../../components/LocationMap";
import put from "../../lib/put";
import deleteReq from "../../lib/delete";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { grey, pink, secondary } from "@mui/material/colors";

function LocationView() {
  const { cityName } = useParams();
  const [city, setCity] = useState([]);
  const [commentlist, setCommentlist] = useState([{}]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(undefined);
  const generalCtx = React.useContext(GeneralContext);

  const addComment = () => {
    let data = { text: comment };
    setSubmitting(true);
    post(`${process.env.REACT_APP_BACKEND_BASE_URL}/location/${cityName}/comments`, data)
      .then((result) => {
        setSubmitting(false);
        if (result.status != 200) {
          setSubmitFailed(true);
        } else {
          setSubmitFailed(false);
          generalCtx.handleEventModified();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("Getting city weather info");
    get("https://weathering-with-me-g12.herokuapp.com/location/" + cityName).then((res) => {
      console.log(res);
      setCity(res);
    });
    console.log("Getting comments");
    get("https://weathering-with-me-g12.herokuapp.com/location/" + cityName + "/comments").then((res) => {
      //console.log(res);
      setCommentlist(res);
    });
  }, [generalCtx.eventModified, cityName]);

  return (
    <>
      <br />
      <div>
        <CityInfoTable city={city} />
        <br />
        {city.length !== 0 ? <LocationMap city={city} /> : <></>}
        <br />
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          &nbsp;&nbsp;&nbsp;Comment section:
        </Typography>
        <CommentTable comments={commentlist} />
        <br />
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" component="div">
          &nbsp;&nbsp;&nbsp;Enter comment:
        </Typography>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" gap="5px">
          <TextField
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <SubmitButton onClick={(e) => addComment()} loading={submitting} error={submitFailed}>
            Submit
          </SubmitButton>
        </Box>
      </div>
    </>
  );
}

const EnhancedTableToolbar = (props) => {
  const { city } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(!city.name && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {!city.name ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          Loading
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          LocationView: {city.name}
        </Typography>
      )}
    </Toolbar>
  );
};

function CityInfoTable(props) {
  const generalCtx = React.useContext(GeneralContext);

  function likeCityHandler(city, isFavourite) {
    if (!isFavourite) {
      put("https://weathering-with-me-g12.herokuapp.com/location/" + city + "/favourite").then(() => {
        generalCtx.handleEventModified();
      });
    } else {
      deleteReq("https://weathering-with-me-g12.herokuapp.com/location/" + city + "/favourite").then(() => {
        generalCtx.handleEventModified();
      });
    }
  }

  return (
    <>
      <EnhancedTableToolbar city={props.city} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="City Info">
          <TableHead>
            <TableRow>
              <TableCell> </TableCell>
              <TableCell>City Name</TableCell>
              <TableCell align="right">Country</TableCell>
              <TableCell align="right">Latitude</TableCell>
              <TableCell align="right">Longtitude</TableCell>
              <TableCell align="right">Temperature&nbsp;(°C)</TableCell>
              <TableCell align="right">Wind Speed&nbsp;(kph)</TableCell>
              <TableCell align="right">Wind Direction</TableCell>
              <TableCell align="right">Humidity&nbsp;(%)</TableCell>
              <TableCell align="right">Precipitation&nbsp;(mm)</TableCell>
              <TableCell align="right">Visibility&nbsp;(km)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[props.city].map((row, index) => (
              <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell>
                  <IconButton aria-label="add to favorites" onClick={(e) => likeCityHandler(row.name, row.isFavourite)}>
                    {row.isFavourite ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteIcon />}
                  </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.country ? row.country : "N/A"}</TableCell>
                <TableCell align="right">{row.country ? row.lat : "N/A"}</TableCell>
                <TableCell align="right">{row.country ? row.long : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.temp_c : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.wind_kph : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.wind_dir : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.humidity : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.precip_mm : "N/A"}</TableCell>
                <TableCell align="right">{row.weather ? row.weather.vis_km : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

function CommentTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="Comment table">
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell align="left">Comment</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.comments.map((row, index) => (
            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">
                {row.author}
              </TableCell>
              <TableCell align="left">{row.text}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default LocationView;
