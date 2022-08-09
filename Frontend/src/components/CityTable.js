import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { grey, pink, secondary } from "@mui/material/colors";
import { visuallyHidden } from "@mui/utils";
import FavoriteIcon from "@mui/icons-material/Favorite";
import GeneralContext from "../store/general-context";
import { useNavigate } from "react-router-dom";
import put from "../lib/put";
import deleteReq from "../lib/delete";

function descendingComparator(a, b, orderBy) {
  if (orderBy != "name" && orderBy != "country") {
    if (b["weather"] != null && a["weather"] != null) {
      if (b["weather"][orderBy] < a["weather"][orderBy]) {
        return -1;
      }
      if (b["weather"][orderBy] > a["weather"][orderBy]) {
        return 1;
      }
    } else {
      return -1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "City",
  },
  {
    id: "country",
    numeric: false,
    disablePadding: false,
    label: "Country",
  },
  {
    id: "temp_c",
    numeric: true,
    disablePadding: false,
    label: "Temperature (°C)",
  },
  {
    id: "wind_kph",
    numeric: true,
    disablePadding: false,
    label: "Wind Speed (kph)",
  },
  {
    id: "wind_dir",
    numeric: false,
    disablePadding: false,
    label: "Wind Direction",
  },
  {
    id: "humidity",
    numeric: true,
    disablePadding: false,
    label: "Humidity (%)",
  },
  {
    id: "precip_mm",
    numeric: true,
    disablePadding: false,
    label: "Precipitation (mm)",
  },
  {
    id: "vis_km",
    numeric: true,
    disablePadding: false,
    label: "Visibility (km)",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all citys',
                        }}
                    /> */}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id == "name" ? "left" : "right"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
          City List
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Favourite">
          <IconButton>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        //   <Tooltip title="Filter list">
        //     <IconButton>
        //       <FilterListIcon />
        //     </IconButton>
        //   </Tooltip>
        <></>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function CityTable(props) {
  const [rows, setRows] = React.useState(props.info);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const generalCtx = React.useContext(GeneralContext);
  const navigate = useNavigate();

  useEffect(() => {
    setRows(props.info);
    //console.log(props.info);
  }, [generalCtx.eventModified, props.info]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    console.log(orderBy);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //     const selectedIndex = selected.indexOf(name);
  //     let newSelected = [];

  //     if (selectedIndex === -1) {
  //         newSelected = newSelected.concat(selected, name);
  //     } else if (selectedIndex === 0) {
  //         newSelected = newSelected.concat(selected.slice(1));
  //     } else if (selectedIndex === selected.length - 1) {
  //         newSelected = newSelected.concat(selected.slice(0, -1));
  //     } else if (selectedIndex > 0) {
  //         newSelected = newSelected.concat(
  //             selected.slice(0, selectedIndex),
  //             selected.slice(selectedIndex + 1),
  //         );
  //     }

  //     setSelected(newSelected);
  // };
  const handleClick = (event, name) => {
    navigate(`/location/${name}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .filter((city) => {
                  return city.name.toLowerCase().includes(generalCtx.searchWord.toLowerCase());
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      //role="checkbox"
                      //aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      //selected={isItemSelected}
                    >
                      <TableCell
                        //padding="checkbox"
                        align="center"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {/* <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                /> */}
                        {/* {props.isFavourite ? (
                          <FavoriteIcon sx={{ color: pink[500] }} />
                        ) : (
                          <FavoriteIcon sx={{ color: grey[500] }} />
                        )} */}
                        <IconButton
                          aria-label="add to favorites"
                          onClick={(e) => likeCityHandler(row.name, row.isFavourite)}
                        >
                          {row.isFavourite ? <FavoriteIcon sx={{ color: pink[500] }} /> : <FavoriteIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.country ? row.country : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.temp_c : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.wind_kph : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.wind_dir : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.humidity : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.precip_mm : "N/A"}</TableCell>
                      <TableCell align="right">{row.weather ? row.weather.vis_km : "N/A"}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
    </Box>
  );
}
