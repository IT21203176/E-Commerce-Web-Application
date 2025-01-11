import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../../../axios-client";
import Select from "react-select";
import Swal from "sweetalert2";
import { tableHeaderStyles, customSelectStyles } from "../../utils/dataArrays";
import { AddUser, ProductCategory } from "../../utils/icons";
import { ChangeIcon, EditNewIcon } from "../../utils/icons";
import "bootstrap/dist/css/bootstrap.min.css";

export const Customer = () => {
  // State to hold the list of customers and filtered customers for the table
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  // State to handle loading status when fetching or updating data
  const [customerTableLoading, setCustomerTableLoading] = useState(false);

  // Toggle the loading state
  const handleLoading = () => setCustomerTableLoading((pre) => !pre);

  // State to handle status and name filtering for the customers list
  const [statusFilter, setStatusFilter] = useState(null);
  const [nameFilter, setNameFilter] = useState("");

  // Fetching vendors from the backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosClient.get("/Users/customers");
        setCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };
    fetchCustomers();
  }, [customerTableLoading]);

  // Effect to filter customers
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const matchesName = nameFilter
        ? `${customer.first_Name} ${customer.last_Name}`
            .toLowerCase()
            .includes(nameFilter.toLowerCase())
        : true;

      const matchesStatus =
        statusFilter && statusFilter.value !== ""
          ? customer.isActive === statusFilter.value
          : true;

      return matchesName && matchesStatus;
    });

    setFilteredCustomers(filtered);
  }, [statusFilter, customers, nameFilter]);

  // Handler for changing the status filter
  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption);
  };

  // Added handler for name filter
  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value);
  };

  // Function to handle the status change of a customer
  const handleStatusChange = (customer) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status of this Customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .put(`Users/status/${customer.id}`)
          .then((response) => {
            handleLoading();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Customer status updated successfully!`,
            });
          })
          .catch((error) => {
            console.error("Error updating Customer status:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while updating the Customer status.",
            });
          });
      }
    });
  };

  // Creating the table
  const TABLE_VENDOR = [
    {
      name: "Customer Name",
      selector: (row) => (
        <span>
          {row.first_Name} {row.last_Name}
        </span>
      ),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Email",
      selector: (row) => row.email,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Address",
      selector: (row) => row.address,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Status",
      selector: (row) =>
        row.isActive === 2 ? (
          <div className="status-inactive-btn">Inactive</div>
        ) : row.isActive === 1 ? (
          <div className="status-active-btn">Active</div>
        ) : null,
      wrap: false,
      minWidth: "200px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="edit-btn"
            onClick={() => handleStatusChange(row)}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Change Status"
          >
            <ChangeIcon />
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Destroy any previous tooltips to avoid duplication or issues
    const existingTooltips = document.querySelectorAll(".tooltip");
    existingTooltips.forEach((tooltip) => tooltip.remove());

    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    return () => {
      // Clean up on unmount or when content changes
      tooltipList.forEach((tooltip) => tooltip.dispose());
    };
  }, [customers, customerTableLoading]);

  // Define status options
  const statusOptions = [
    { value: "", label: "All" },
    { value: 1, label: "Active" },
    { value: 2, label: "Inactive" },
  ];
  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color">
        <div className="row">
          <div className="col-6">
            <div className="d-flex align-items-center gap-3">
              <div className="col-5">
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  Search by Name
                </span>
                <input
                  name="Name"
                  type="text"
                  className="form-control  col-5"
                  value={nameFilter}
                  onChange={handleNameFilterChange}
                />
              </div>

              <div className="col-6">
                <span style={{ fontSize: "15px", fontWeight: "600" }}>
                  Search by Status
                </span>
                <Select
                  classNamePrefix="select"
                  options={statusOptions}
                  onChange={handleStatusFilterChange}
                  isSearchable={true}
                  name="color"
                  styles={customSelectStyles}
                  className="col-9"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container bg-white rounded-card p-4 mt-3">
        <DataTable
          columns={TABLE_VENDOR}
          responsive
          data={filteredCustomers}
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
