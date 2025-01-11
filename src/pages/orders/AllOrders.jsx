import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../../../axios-client";
import { useNavigate } from "react-router-dom";
import { customSelectStyles, tableHeaderStyles } from "../../utils/dataArrays";
import { ViewIcon } from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";

export const AllOrders = () => {
  // Access the user context to get user details
  const { user } = useStateContext();
  const userId = user.id;
  const userRole = user.role;

  const navigate = useNavigate();

  // State to store orders data
  const [orders, setOrders] = useState([]);
  const [orderTableLoading, setOrderTableLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState({ value: "", label: "All" });

  const handleLoading = () => setSelectedOrderId((prev) => !prev);

  // Fetching orders from the backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        if (userRole === "1" || userRole === "2") {
          response = await axiosClient.get("/Orders");
        } else if (userRole === "3") {
          response = await axiosClient.get(`/Orders/vendor/${userId}`);
        }
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, [orderTableLoading, userId]);

  // Handle view button click
  const handleViewClick = (order) => {
    navigate(`/orders/view/${order.id}`);
  };

  // Function to handle date filtering
  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  // Function to handle status filtering
  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  // Filter orders based on the selected date and status
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date).toISOString().split("T")[0];

    const matchesDate = !dateFilter || orderDate === dateFilter;

    const matchesStatus =
      statusFilter === null ||
      statusFilter.value === "" ||
      order.status === statusFilter.value;

    return matchesDate && matchesStatus;
  });

  const TABLE_PRODUCT_LIST = [
    {
      name: "Date",
      selector: (row) => {
        const date = new Date(row.date);
        return `${date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })} ${date.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}`;
      },
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Customer",
      selector: (row) => `${row.customerFirstName} ${row.customerLastName}`,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Item Count",
      selector: (row) => row.orderItemCount,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      center: true,
    },
    {
      name: "Total (Rs)",
      selector: (row) => parseFloat(row.totalPrice).toFixed(2),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
      right: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status === 0 ? (
          <div className="status-pending-btn" style={{ width: "80px" }}>
            Pending
          </div>
        ) : row.status === 1 ? (
          <div className="status-processing-btn" style={{ width: "80px" }}>
            Processing
          </div>
        ) : row.status === 2 ? (
          <div className="status-active-btn" style={{ width: "80px" }}>
            Complete
          </div>
        ) : row.status === 4 ? (
          <div
            className="status-cancel-requested-btn"
            style={{ width: "80px" }}
          >
            Cancel Requested
          </div>
        ) : row.status === 3 ? (
          <div className="status-inactive-btn" style={{ width: "80px" }}>
            Cancel
          </div>
        ) : null,
      wrap: false,
      minWidth: "200px",
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="edit-btn me-4"
            onClick={() => handleViewClick(row)}
            title="View Order"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
          >
            <ViewIcon />
          </button>
        </div>
      ),
      minWidth: "50px",
    },
  ];

  const statusOptions = [
    { value: "", label: "All" },
    { value: 0, label: "Pending" },
    { value: 1, label: "Processing" },
    { value: 2, label: "Complete" },
  ];

  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center gap-3">
              <h5 className="mb-4">All Orders</h5>
              <div className="col-5 d-flex justify-content-left gap-3">
                <div className="col-7">
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>
                    Search by Status
                  </span>
                  <Select
                    classNamePrefix="select"
                    options={statusOptions}
                    onChange={handleStatusFilterChange}
                    isSearchable={true}
                    name="statusFilter"
                    styles={customSelectStyles}
                    className="col-9"
                    value={statusFilter}
                  />
                </div>
                <div className="col-5" style={{ marginLeft: "-20px" }}>
                  <span style={{ fontSize: "15px", fontWeight: "600" }}>
                    Search by Date
                  </span>
                  <input
                    name="dateFilter"
                    type="date"
                    className="form-control"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container bg-white rounded-card p-4 mt-3">
        <DataTable
          columns={TABLE_PRODUCT_LIST}
          responsive
          data={filteredOrders}
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
