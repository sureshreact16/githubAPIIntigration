import React, { useState, useCallback } from "react";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";
import DynamicModal from "./DynamicModal";

import moment from "moment";
import { Link } from "react-router-dom";

import { getRelativeTime } from "./dateUtils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DynamicTable = ({ headers, tableData }) => {
  const [open, setOpen] = useState(false);

  const [modalContent, setModalContent] = useState([]);
  const modalTitle = "Pull Request Info";

  const handleClickOpen = useCallback(
    (currObj) => async () => {
      if (typeof currObj.pull_request_url !== "string") {
        throw new Error("Invalid pull request URL");
      }

      const modifiedUrl = currObj.pull_request_url.replace(
        /(\/pulls)/,
        "/issues"
      );

      try {
        const response = await fetch(modifiedUrl);
        const data = await response.json();

        const customizedData = {
          "Pull Request": data.number,
          "Opened By": data.user.login,
          "Open Date": moment.utc(data.created_at).format("M/D/YYYY h:mm:ss a"),
          "Duration till date": getRelativeTime(data.created_at),
          Reviewers: currObj.user.login,
        };
        setModalContent([customizedData]);
      } catch (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setOpen(true);
    },
    []
  );

  const handleClose = () => {
    setOpen(false);
  };

  const formatCell = (row, index) => {
    switch (index) {
      case 0:
        return (
          <Link to={row.html_url} target="_blank">
            Go to discussion
          </Link>
        );
      case 1:
        return moment.utc(row.created_at).format("M/D/YYYY h:mm:ss a");
      case 2:
        return row.body;
      case 3:
        return row.user.login;
      case 4:
        return getRelativeTime(row.created_at);
      case 5:
        return (
          <>
            <Button variant="outlined" onClick={handleClickOpen(row)}>
              Pull request details
            </Button>
            <DynamicModal
              open={open}
              handleClose={handleClose}
              title={modalTitle}
              content={modalContent}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <StyledTableCell key={header} align="left">
                {header}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row, rowIndex) => (
            <StyledTableRow key={rowIndex}>
              {headers.map((_, cellIndex) => (
                <StyledTableCell key={cellIndex} align="left">
                  {formatCell(row, cellIndex)}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(DynamicTable);
