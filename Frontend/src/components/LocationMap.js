//@ts-check
import React, { useRef, useState, useEffect } from "react";
import { Container, Box } from "@mui/material";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { MarkEmailReadTwoTone } from "@mui/icons-material";
import get from "../lib/get";
import { useNavigate } from "react-router-dom";

function Map(props) {
  const ref = useRef();
  const [map, setMap] = useState();
  useEffect(() => {
    setMap(new window.google.maps.Map(ref.current, {}));
  }, []);
  if (map) {
    map.setCenter(props.center);
    map.setZoom(props.zoom);
  }
  //像下面這個useEffect這樣用變量來carry，一下<Marker/>會有問題，儘管我不知道為什麽
  // let markers;
  // useEffect(() => {
  //   console.log("before mapping");
  //   console.log(props.markersInfo);
  //   markers = props.markersInfo.map((latlng) => {
  //     return <Marker position={latlng} map={map} />;
  //   });
  //   console.log("mapped");
  //   console.log(markers);
  // }, [props.markersInfo]);
  return (
    <div ref={ref} style={{ height: "100%" }} id="map">
      {/* {props.markers} */}
      {props.markersInfo.map((latlngName) => {
        return (
          <Marker
            position={{ lat: latlngName.lat, lng: latlngName.lng }}
            map={map}
            locationName={latlngName.locationName}
          />
        );
      })}
    </div>
  );
}
function Marker(props) {
  const navigate = useNavigate();
  const [marker, setMarker] = useState();
  useEffect(() => {
    setMarker(new window.google.maps.Marker({}));
  }, []);
  useEffect(() => {
    let markerOnClickListener;
    // markerOnClickListener = marker?.addListener("click", () => {
    //   navigate(`/location/${props.locationName}`);
    // });
    return () => {
      if (marker && markerOnClickListener) {
        window.google.maps.event.removeListener(markerOnClickListener);
      }
    };
  }, [marker]);
  if (marker) {
    marker.setMap(props.map);
    marker.setPosition(props.position);
  }
}
const rootContainerStyle = (theme) => ({
  paddingTop: "16px",
  height: "calc(100vh - 80px)",
  display: "flex",
  gap: "16px",
  flexDirection: "row",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
});

const mapContainerStyle = (theme) => ({
  flexGrow: 1,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    height: "30%",
  },
});

function LocationMap(props) {
  const mapLoadingRender = (status) => {
    return <h1>{status}</h1>;
  };
  const [markersInfo, setMarkersInfo] = useState([{}]);
  useEffect(() => {
    get("https://weathering-with-me-g12.herokuapp.com/location/" + props.city.name)
      .then((result) => {
        console.log(result);
        setMarkersInfo(
          [result].map((location) => {
            return { lat: location.lat, lng: location.long, locationName: location.name };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.city]);
  return (
    <Container sx={rootContainerStyle}>
      <Box sx={mapContainerStyle}>
        <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={mapLoadingRender} style={{ height: "100%" }}>
          <Map
            center={{ lat: 22.507017, lng: 114.127882 }}
            zoom={2}
            // markersInfo={[{ position: { lat: 22.507017, lng: 114.127882 } ]}
            markersInfo={markersInfo}
          />
        </Wrapper>
      </Box>
    </Container>
  );
}

export default LocationMap;
