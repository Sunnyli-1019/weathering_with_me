//Provide a visually beatiful showcase for email. Selfcontained function that open user's mail client and draft mail to the target user when user click this.
import React from "react";
import EmailIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
function EmailShowCase(props) {
  return (
    <Button
      variant="outlined"
      startIcon={<EmailIcon />}
      sx={{ textTransform: "none" }}
      {...props}
      onClick={(e) => {
        e.stopPropagation(); //not working
        window.location.href = `mailto:${props.children}`;
      }}
    >
      {props.children}
    </Button>
  );
}

export default EmailShowCase;
