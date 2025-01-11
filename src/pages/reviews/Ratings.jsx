import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import { tableHeaderStyles, customSelectStyles } from "../../utils/dataArrays";
import {
  AddIcon,
  EditIcon,
  ProductCategory,
  ResetIcon,
  UpdateStockIcon,
  ViewIcon,
} from "../../utils/icons";
import { ChangeIcon, DeleteIcon, EditNewIcon } from "../../utils/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";

export const Ratings = () => {
  const { user } = useStateContext();
  const userId = user.id;

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // Fetching ratings on component mount
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axiosClient.get(
          `/RankingComments/vendorRatings/${userId}`
        );
        setRatings(response.data);
        calculateAverageRating(response.data);
      } catch (error) {
        console.error("Failed to fetch rating", error);
      }
    };
    fetchRatings();
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

  const calculateAverageRating = (ratings) => {
    if (ratings.length > 0) {
      const avg =
        ratings.reduce((acc, curr) => acc + curr.ranking, 0) / ratings.length;
      setAverageRating(avg.toFixed(2)); // Set average rating to 2 decimal places
    }
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
      name: "Ranking",
      selector: (row) => (
        <Rating
          readonly
          initialRating={row.ranking}
          emptySymbol={<FaRegStar color="#ffd700" style={{ fontSize: "15px" }}/>}
          fullSymbol={<FaStar color="#ffd700" style={{ fontSize: "15px" }}/>}
          fractions={2}
        />
      ),
      wrap: false,
      minWidth: "150px",
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
                Total Ratings
              </span><br/>
              <span style={{ fontSize: "15px", fontWeight: "500" }}>
              {ratings.length}
              </span>
              
            </div>

            <div className="col-6">
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
                Average Rating
              </span><br/>
              <span style={{ fontSize: "15px", fontWeight: "500" }}>
                  {/* Display average rating as stars and numeric value */}
                  <Rating
                    readonly
                    initialRating={averageRating}
                    emptySymbol={<FaRegStar color="#ffd700" style={{ fontSize: "15px" }} />}
                    fullSymbol={<FaStar color="#ffd700" style={{ fontSize: "15px" }} />}
                    fractions={2}
                  />
                  &nbsp;{averageRating} / 5
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
          data={ratings}
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
  )
}

