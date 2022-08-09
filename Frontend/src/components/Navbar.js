//this navbar component can switch between admin and normal user verion, example below shows how to activate admin mode:
//<Navbar admin />
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoutButton from "./LogoutButton";
import Button from "@mui/material/Button";
import NameShowCase from "./NameShowCase";
import AuthContext from "../store/auth-context";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Avatar from "@mui/material/Avatar";
import FriendShowCase from "./FriendShowCase";
import FriendList from "./FriendList";
import { SwipeableDrawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import get from "../lib/get";
import AddFriendField from "./AddFriendField";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
import GeneralContext from "../store/general-context.js";
import PrefContext from "../store/preference-context";
import MaterialUISwitch from "./MaterialUISwitch";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import { useMatch, useNavigate } from "react-router-dom";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const drawerIconSize = 28;

export default function Navbar(props) {
  //get context by itself here, make the module more self-contained, reduce coupling
  const authCtx = useContext(AuthContext);
  const generalCtx = useContext(GeneralContext);
  const prefCtx = useContext(PrefContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isPageMenuOpen = Boolean(anchorEl2);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const matchHome = useMatch("/homepage");
  const matchMap = useMatch("/mapview");
  const matchFavorite = useMatch("/favoriteview");
  const matchAdmin = useMatch("/adminview");
  const matchAdminLoc = useMatch("/adminlocview");
  const navigate = useNavigate();
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePageMenuOpen = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handlePageMenuClose = () => {
    setAnchorEl2(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const menuId = "primary-search-account-menu";
  const pageMenuId = "page-menu";
  const renderPageMenu = (
    <SwipeableDrawer
      open={openDrawer}
      onClose={() => {
        setOpenDrawer(false);
      }}
      onOpen={() => {
        setOpenDrawer(true);
      }}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => {
          setOpenDrawer(false);
        }}
      >
        <List>
          {authCtx.role === "admin" && (
            <>
              <ListItem
                button
                onClick={() => {
                  generalCtx.handleEventModified();
                }}
              >
                <ListItemIcon>
                  <CloudDownloadIcon sx={{ height: drawerIconSize, width: drawerIconSize }} color="info" />
                </ListItemIcon>
                <ListItemText primary={"Refresh data"} />
              </ListItem>

              <Divider sx={{ my: 1 }} />
            </>
          )}
          <Typography variant="caption" sx={{ ml: 2, textTransform: "uppercase", py: 1, display: "block" }}>
            Browse Locations
          </Typography>
          <ListItem
            button
            selected={matchHome}
            onClick={() => {
              navigate("/homepage");
            }}
          >
            <ListItemIcon>
              <ViewListIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>Table view</ListItemText>
          </ListItem>
          <ListItem
            button
            selected={matchMap}
            onClick={() => {
              navigate("/mapview");
            }}
          >
            <ListItemIcon>
              <TravelExploreIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>Map view</ListItemText>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem
            button
            selected={matchFavorite}
            onClick={() => {
              navigate("/favoriteview");
            }}
          >
            <ListItemIcon>
              <FavoriteIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
            </ListItemIcon>
            <ListItemText>Favorites</ListItemText>
          </ListItem>
          <Divider sx={{ my: 1 }} />
          {authCtx.role === "admin" && (
            <ListItem
              button
              selected={matchAdmin}
              onClick={() => {
                navigate("/adminview");
              }}
            >
              <ListItemIcon>
                <ManageAccountsIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
              </ListItemIcon>
              <ListItemText>Manage users</ListItemText>
            </ListItem>
          )}
          {authCtx.role === "admin" && (
            <ListItem
              button
              selected={matchAdminLoc}
              onClick={() => {
                navigate("/adminlocview");
              }}
            >
              <ListItemIcon>
                <EditLocationIcon sx={{ height: drawerIconSize, width: drawerIconSize }} />
              </ListItemIcon>
              <ListItemText>Manage locations</ListItemText>
            </ListItem>
          )}
        </List>
      </Box>
    </SwipeableDrawer>
  );
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          props.setShowProfile(true);
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          props.onLogout();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
        onClick={() => {
          prefCtx.switchMode();
        }}
      >
        <MaterialUISwitch sx={{ m: 1 }} checked={prefCtx.theme.palette.mode === "dark"} />
      </MenuItem>
      <MenuItem
        onClick={() => {
          props.setShowProfile(true);
        }}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <NameShowCase variant="text">{authCtx.username}</NameShowCase>
      </MenuItem>
      <MenuItem
        onClick={() => {
          authCtx.logout();
        }}
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <LogoutButton
          variant="text"
          onClick={() => {
            authCtx.logout();
          }}
        />
      </MenuItem>
    </Menu>
  );
  const weatherIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width={"45px"}>
      <path
        fill="#FFFFFF"
        d="M255.7 139.1C244.8 125.5 227.6 116 208 116c-33.14 0-60 26.86-60 59.1c0 25.56 16.06 47.24 38.58 55.88C197.2 219.3 210.5 208.9 225.9 201.1C229.1 178.5 240.6 157.3 255.7 139.1zM120 175.1c0-48.6 39.4-87.1 88-87.1c27.8 0 52.29 13.14 68.42 33.27c21.24-15.67 47.22-25.3 75.58-25.3c.0098 0-.0098 0 0 0L300.4 83.58L286.9 8.637C285.9 3.346 281.3 .0003 276.5 .0003c-2.027 0-4.096 .5928-5.955 1.881l-62.57 43.42L145.4 1.882C143.6 .5925 141.5-.0003 139.5-.0003c-4.818 0-9.399 3.346-10.35 8.636l-13.54 74.95L40.64 97.13c-5.289 .9556-8.637 5.538-8.637 10.36c0 2.026 .5921 4.094 1.881 5.951l43.41 62.57L33.88 238.6C32.59 240.4 32 242.5 32 244.5c0 4.817 3.347 9.398 8.636 10.35l74.95 13.54l13.54 74.95c.9555 5.289 5.537 8.636 10.35 8.636c2.027 0 4.096-.5927 5.954-1.882l19.47-13.51c-3.16-10.34-4.934-21.28-4.934-32.64c0-17.17 4.031-33.57 11.14-48.32C141 241.7 120 211.4 120 175.1zM542.5 225.5c-6.875-37.25-39.25-65.5-78.51-65.5c-12.25 0-23.88 3-34.25 8c-17.5-24.13-45.63-40-77.76-40c-53 0-96.01 43-96.01 96c0 .5 .25 1.125 .25 1.625C219.6 232.1 191.1 265.2 191.1 303.1c0 44.25 35.75 80 80.01 80h256C572.2 383.1 608 348.2 608 303.1C608 264.7 579.7 232.2 542.5 225.5zM552 415.1c-7.753 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C496 501.4 506.9 512 520 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C576 426.6 565.1 415.1 552 415.1zM456 415.1c-7.751 0-15.34 3.752-19.98 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C400 501.4 410.9 512 423.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C480 426.6 469.1 415.1 456 415.1zM360 415.1c-7.753 0-15.34 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C304 501.4 314.9 512 327.1 512c7.75 0 15.36-3.75 19.99-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C384 426.6 373.1 415.1 360 415.1zM264 415.1c-7.756 0-15.35 3.752-19.97 10.69l-32 48c-2.731 4.093-4.037 8.719-4.037 13.29C208 501.4 218.9 512 231.1 512c7.75 0 15.36-3.75 19.98-10.69l32-48c2.731-4.093 4.037-8.719 4.037-13.29C288 426.6 277.1 415.1 264 415.1z"
      />
    </svg>
  );
  useEffect(() => {
    generalCtx.setSearchWord("");
  }, [matchAdmin]);
  return (
    <Box sx={{ flexGrow: 1, marginBottom: "64px" }}>
      <AppBar position="fixed" sx={props.admin ? { background: "black" } : {}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            aria-controls={pageMenuId}
            aria-haspopup="true"
            onClick={() => {
              //the ui in drawer is useless for admin, so we don't allow the drawer to open if it's admin case
              if (!props.admin) setOpenDrawer(true);
            }}
            sx={{}}
          >
            <MenuIcon />
          </IconButton>
          {/* <Avatar
            src={RFriendIcon}
            sx={{ display: { xs: "none", sm: "block" } }}
          /> */}
          {weatherIcon}
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: "none", sm: "block" }, ml: "12px" }}>
            Weather With Me
          </Typography>
          {(matchHome || matchAdmin) && (
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={matchAdmin ? "Search user" : "Search location"}
                inputProps={{ "aria-label": "search" }}
                value={generalCtx.searchWord}
                onInput={(e) => {
                  generalCtx.setSearchWord(e.target.value);
                }}
              />
            </Search>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: { md: "row" },
              alignItems: { md: "center" },
              gap: 2,
            }}
          >
            {/* {!props.admin && (
              <>
                {generalCtx.isMapView && (
                  <Button
                    color="inherit"
                    startIcon={<TravelExploreIcon />}
                    onClick={() => {
                      generalCtx.handleChangeView();
                    }}
                  >
                    Map view
                  </Button>
                )}
                {!generalCtx.isMapView && (
                  <Button
                    color="inherit"
                    startIcon={<CalendarMonthIcon />}
                    onClick={() => {
                      generalCtx.handleChangeView();
                    }}
                  >
                    Calendar view
                  </Button>
                )}
              </>
            )} */}
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={prefCtx.theme.palette.mode === "dark"}
              onClick={prefCtx.switchMode}
            />
            <NameShowCase
              color="inherit"
              variant="text"
              onClick={() => {
                handleMenuClose();
                props.setShowProfile(true);
              }}
            >
              {authCtx.username}
            </NameShowCase>
            <LogoutButton
              color="inherit"
              onClick={() => {
                handleMenuClose();
                authCtx.logout();
              }}
            />

            {/* <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            ></IconButton> */}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderPageMenu}
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
