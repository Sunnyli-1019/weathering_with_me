import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import EventCard from "./EventCard.js";
import { IconButton } from "@mui/material";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import get from "../lib/get";
import GeneralContext from "../store/general-context";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  //width: 400,
  //bgcolor: "background.paper",
  //border: "2px solid #000",
  //boxShadow: 24,
  p: 4,
};

export default function EventCardModal(props, { children, ...restProps }) {
  const generalCtx = React.useContext(GeneralContext);
  const [open, setOpen] = React.useState(false);
  const [eventInfo, setEventInfo] = React.useState([{}]);
  const [isEventReady, setIsEventReady] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    get("https://rfriend.herokuapp.com/api/user/browse").then((r) => {
      setEventInfo(
        r.event.filter((event) => {
          if (event.id == props.appointmentData.id) {
            return true;
          } else {
            return false;
          }
        })
      );
    });
  }, [generalCtx.eventModified]);
  useEffect(() => {
    if (eventInfo != null) {
      setIsEventReady(true);
    }
  }, [eventInfo]);
  return (
    <>
      <div>
        <IconButton onClick={handleOpen}>
          <ContentPasteSearchIcon />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style }}>
            {isEventReady ? (
              <EventCard
                eventId={eventInfo[0].id}
                eventName={eventInfo[0].name}
                hostId={eventInfo[0].ownerId}
                eventTime={eventInfo[0].startsAt}
                isJoined={eventInfo[0].isEventJoined}
                isLiked={eventInfo[0].isEventLiked}
                photoUrl={eventInfo[0].photoUrl}
                host={eventInfo[0].owner}
                eventLocation={eventInfo[0].location}
                eventCategory={eventInfo[0].category}
                participants={eventInfo[0].participants}
                maxParticipants={eventInfo[0].maxParticipants}
                eventRemark={eventInfo[0].remarks}
                eventComment={eventInfo[0].comments}
              />
            ) : (
              <h1>Wait</h1>
            )}
            {/* {isEventReady?<h1>{eventInfo[0].id}</h1>:<></>} */}
          </Box>
        </Modal>
      </div>
    </>
  );
}
