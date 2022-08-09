import React, { useContext, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import deleteReq from "../lib/delete";
import GeneralContext from "../store/general-context";
//import { withStyles } from 'material-ui/styles';

function EventCardSettingBtn(props) {
  const generalCtx = useContext(GeneralContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnClick = (link) => {
    if (link == "Edit Event") {
      generalCtx.handleSelectEvent(props.eventId);
    }
    if (link == "Delete Event") {
      deleteReq("https://rfriend.herokuapp.com/api/event/", {
        id: props.eventId,
      })
        .then((result) => {
          if (result.status == 200) {
            generalCtx.handleEventModified();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const Wrapper = props.iconType;
  const listItems = props.items.map((link) => {
    return (
      <MenuItem
        onClick={() => {
          handleOnClick(link);
        }}
        key={link}
      >
        {link}
      </MenuItem>
    );
  });
  return (
    <div>
      <IconButton aria-owns={open ? "menu-appbar" : null} aria-haspopup="true" onClick={handleMenu}>
        {<Wrapper />}
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        {listItems}
      </Menu>
    </div>
  );
}
export default EventCardSettingBtn;
