import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../../../axios-client";
import { useNavigate } from "react-router-dom";
import { tableHeaderStyles } from "../../utils/dataArrays";
import { ViewIcon } from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";
import "bootstrap/dist/css/bootstrap.min.css";

export const CancelOrders = () => {
  const { user } = useStateContext();
  const userRole = user.role;
  const userId = user.id;

  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderTableLoading, setOrderTableLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [dateFilter, setDateFilter] = useState(""); // State for date filter

  const handleLoading = () => setSelectedOrderId((pre) => !pre);

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
        const filteredOrders = response.data.filter(
          (order) =>
            order.isCancellationRequested === true &&
            order.isCancellationApproved === 0
        );
        setOrders(filteredOrders);
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

  // Filter orders based on the selected date
  const filteredOrders = orders.filter((order) => {
    if (!dateFilter) return true;
    const orderDate = new Date(order.date).toISOString().split("T")[0];
    return orderDate === dateFilter;
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
          <div
            className="status-inactive-btn"
            style={{ width: "80px" }}
          >
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

  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center gap-3">
              <h5 className="mb-4">Cancelation Requested Orders</h5>
              <div className="col-3">
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
