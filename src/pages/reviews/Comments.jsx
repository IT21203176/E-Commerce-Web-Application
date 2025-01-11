import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../../../axios-client";
import { tableHeaderStyles } from "../../utils/dataArrays";

import "bootstrap/dist/css/bootstrap.min.css";
import { useStateContext } from "../../contexts/NavigationContext";

export const Comments = () => {
  const { user } = useStateContext();
  const userId = user.id;

  const [comments, setComments] = useState([]);

  // Fetching comments on component mount
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axiosClient.get(
          `/RankingComments/vendorComments/${userId}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    };
    fetchComments();
  }, [userId]);


  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + " " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Creating the table
  const TABLE_COMMENTS = [
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Comment",
      selector: (row) => row.comment,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Date",
      selector: (row) =>formatDate(row.createdAt),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      right: true,
    },
  ];

  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color">
        <div className="row">
          <div className="col-6">
            <div className="d-flex align-items-center">
              <div className="col-6">
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  Total Comments
                </span>
                <br />
                <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  {" "}
                  {comments.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container bg-white rounded-card p-4 mt-3">
        <DataTable
          columns={TABLE_COMMENTS}
          responsive
          data={comments}
          customStyles={tableHeaderStyles}
          className="mt-4"
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          paginationComponentOptions={{
            rowsPerPageText: "Entries per page:",
            rangeSeparatorText: "of",
          }}
          noDataComponent={<div className="text-center">No data available</div>}
        />
      </div>
    </section>
  );
};
