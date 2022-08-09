import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

// -----------------------------------------------------------------------------

const Marker = (options) => {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const mapLoadingRender = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

const Map = ({ center, zoom, style, markers, onClick }) => {
  const ref = useRef();
  const [mapObj, setMapObj] = useState();
  const infoWindow = useMemo(() => new window.google.maps.InfoWindow(), []);

  useEffect(() => {
    setMapObj(new window.google.maps.Map(ref.current, { center, zoom }));
  }, []);

  useEffect(() => {
    if (!mapObj) {
      return;
    }

    let mapOnClickListener;
    if (onClick) {
      mapOnClickListener = mapObj.addListener("click", onClick);
    }

    return () => {
      if (onClick) {
        window.google.maps.event.removeListener(mapOnClickListener);
      }
    };
  }, [onClick, mapObj]);

  return (
    <div ref={ref} id="map" style={style}>
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} map={mapObj} title={m.title} clickable={true} infoWindow={infoWindow} />
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------

const CoordinateChooser = ({ chosenCoord, setChosenCoord }) => {
  const center = useMemo(
    () => ({ lat: chosenCoord?.lat || 22.41963752639907, lng: chosenCoord?.lng || 114.20674324035645 }),
    [chosenCoord]
  );
  const zoom = useMemo(() => 15, []);
  const [markers, setMarkers] = useState([]); // google.maps.Marker

  useEffect(() => {
    let waitForGoogle;
    if (chosenCoord?.lat !== null && chosenCoord?.lng !== null) {
      waitForGoogle = setInterval(() => {
        if (window.google) {
          setMarkers([
            { position: new window.google.maps.LatLng(parseFloat(chosenCoord?.lat), parseFloat(chosenCoord?.lng)) },
          ]);

          clearInterval(waitForGoogle);
        }
      }, 500);
    }

    return () => {
      if (waitForGoogle) {
        clearInterval(waitForGoogle);
      }
    };
  }, [chosenCoord]);

  const mapOnClick = useCallback(
    (event) => {
      setMarkers([{ position: event.latLng }]);
      setChosenCoord({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    },
    [setMarkers, setChosenCoord]
  );

  return (
    <Wrapper apiKey={process.env.REACT_APP_MAPS_API_KEY} render={mapLoadingRender}>
      <Map center={center} zoom={zoom} style={{ height: "100%" }} markers={markers} onClick={mapOnClick}></Map>
    </Wrapper>
  );
};

export default CoordinateChooser;
