// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React, { useState, useEffect, useContext } from "react";
import CityTable from "../../components/CityTable";
import get from "../../lib/get";
import GeneralContext from "../../store/general-context";

function FavoriteView() {
  const [favouriteList, setFavouriteList] = React.useState([]);
  const generalCtx = React.useContext(GeneralContext);

  useEffect(() => {
    get("https://weathering-with-me-g12.herokuapp.com/location").then((r) => {
      setFavouriteList(
        r.filter((city) => {
          return city.isFavourite;
        })
      );
    });
  }, [generalCtx.eventModified]);

  return (
    <>
      <CityTable info={favouriteList} />
    </>
  );
}

export default FavoriteView;
