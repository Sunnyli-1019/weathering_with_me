// Group members:
// Li Hong Man (1155127457), Yu Man Ho (1155127657), Ho Tsz Ngong (1155124840), Cheung Man Dick (1155127272), Mak Wing Chit (1155125179), David Pauschert (1155178207)
import React, { useState } from "react";

const GeneralContext = React.createContext({
  //we will declare and initialize them in the later part, so the code here only for readability and intelSense, no technical effect
  //notice everything you get from localStorage will be string, since we rely on localStorage, here everything will be string to let intelSense remind user these thing will be string when we access them.
  eventIdSelected: null,
  eventModified: false,
  searchWord: "",
  locationsModified: 0,
  handleSelectEvent: (eventId) => {},
  handleEventModified: () => {},
  setSearchWord: () => {},
  handleLocationsModified: () => {},
});

export const GeneralContextProvider = (props) => {
  const [eventIdSelected, setEventIdSelected] = useState(null);
  const [eventModified, setEventModified] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [locationsModified, setLocationsModified] = useState(0);
  const handleSelectEvent = (eventId) => {
    setEventIdSelected(eventId);
  };
  const handleEventModified = () => {
    setEventModified((prev) => {
      return !prev;
    });
  };
  const handleLocationsModified = () => {
    setLocationsModified((prev) => {
      return prev + 1;
    });
  };
  //provide an interface for components to use i.e. generalCtx.xxx
  const contextValue = {
    eventModified: eventModified,
    eventIdSelected: eventIdSelected,
    searchWord: searchWord,
    locationsModified: locationsModified,
    handleSelectEvent: handleSelectEvent,
    handleEventModified: handleEventModified,
    handleLocationsModified: handleLocationsModified,
    setSearchWord: setSearchWord,
  };

  return <GeneralContext.Provider value={contextValue}>{props.children}</GeneralContext.Provider>;
};

export default GeneralContext;
