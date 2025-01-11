import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../../axios-client";
import DataTable from "react-data-table-component";
import { tableHeaderStyles } from "../../utils/dataArrays";
import {
  ChangeIcon,
  DeliveredIcon,
  DeliveredStatus,
  NoAccessIcon,
  PendingStatus,
  ProcessingStatus,
} from "../../utils/icons";
import Swal from "sweetalert2";
import { useStateContext } from "../../contexts/NavigationContext";

export const OrderDetails = () => {
  // Extract order ID from URL parameters
  const { id } = useParams();
  // / Get user context (includes user data)
  const { user } = useStateContext();
  const userId = user.id;
  const userRole = user.role;

  // Component state for order data and loading statuses
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);

  // Fetch the order details when the component mounts
  useEffect(() => {
    const fetchOrderById = async () => {
      try {
        const response = await axiosClient.get(`/Orders/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderById();
  }, [id]);

  // Show loading message while fetching order data
  if (loading) {
    return <p>Loading...</p>;
  }

  // Show message if no order is found
  if (!order) {
    return <p>No order found!</p>;
  }

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // Handle marking an item as delivered
  const handleIsDeliveredChange = (orderItem) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to mark this product as delivered?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, mark as delivered!",
      cancelButtonText: "No, cancel",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        setTableLoading(true);
        axiosClient
          .patch(
            `Orders/${id}/vendor/${orderItem.vendorId}/product/${orderItem.productId}/deliver`
          )
          .then((response) => {
            axiosClient.get(`/Orders/${id}`).then((res) => {
              setOrder(res.data);
              setTableLoading(false);
              Swal.fire({
                icon: "success",
                title: "Success!",
                text: `Order product marked as delivered!`,
              });
            });
          })
          .catch((error) => {
            console.error("Error updating product status:", error);
            setTableLoading(false);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while updating the product status.",
            });
          });
      }
    });
  };

  // Handle approving a cancellation request
  const handleApproveRequest = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this order cancellation request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve it!",
      cancelButtonText: "No, cancel",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .patch(`/Orders/${id}/approve-cancellation`)
          .then((response) => {
            setOrder((prev) => ({
              ...prev,
              isCancellationApproved: 1,
            }));
            Swal.fire({
              icon: "success",
              title: "Approved!",
              text: "The cancellation request has been approved.",
            });
          })
          .catch((error) => {
            console.error("Error approving the cancellation request:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while approving the request.",
            });
          });
      }
    });
  };

  // Handle rejecting a cancellation request
  const handleRejectRequest = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reject this order cancellation request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
      cancelButtonText: "No, cancel",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .patch(`/Orders/${id}/reject-cancellation`)
          .then((response) => {
            setOrder((prev) => ({
              ...prev,
              isCancellationApproved: 2,
            }));
            Swal.fire({
              icon: "success",
              title: "Approved!",
              text: "The cancellation request has been rejected.",
            });
          })
          .catch((error) => {
            console.error("Error rejecting the cancellation request:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while rejecting the request.",
            });
          });
      }
    });
  };

  // Define columns for the DataTable
  const TABLE_ORDER_ITEM = [
    {
      name: "Product",
      selector: (row) => row.productName,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Unit Price (Rs)",
      selector: (row) => row.unitPrice.toFixed(2),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Total (Rs)",
      selector: (row) => row.total.toFixed(2),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      right: true,
    },
    {
      name: "Is Delivered?",
      selector: (row) =>
        row.isDelivered === false ? (
          <div className="status-pending-btn">No</div>
        ) : row.isDelivered === true ? (
          <div className="status-active-btn">Yes</div>
        ) : null,
      wrap: false,
      minWidth: "auto",
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          {userId === row.vendorId || userRole === '1' ? (
            order.isCancellationRequested &&
            order.isCancellationApproved == 0 ? (
              <div className="text-danger">Awaiting Approval</div>
            ) : order.isCancellationRequested &&
              order.isCancellationApproved == 1 ? (
              <button className="edit-btn me-4" disabled>
                <div className="text-danger">Cancel</div>
              </button>
            ) : row.isDelivered ? (
              <button className="edit-btn me-4" disabled>
                <DeliveredIcon />
              </button>
            ) : (
              <button
                className="edit-btn me-4"
                onClick={() => handleIsDeliveredChange(row)}
                title="Mark as Delivered"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <ChangeIcon />
              </button>
            )
          ) : (
            <button className="edit-btn me-4" disabled>
              <NoAccessIcon />
            </button>
          )}
        </div>
      ),
      minWidth: "50px",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.vendorId === userId,
      style: {
        color: "#ff9d0b",
        fontWeight: 700,
      },
    },
  ];

  const status = order.status;
  const getButtonStyles = (currentStatus) => ({
    backgroundColor: status >= currentStatus ? "#ff7a28" : "#efefef",
    border: "none",
    borderRadius: "100%",
    padding: "15px",
  });

  const getIconColor = (currentStatus) =>
    status >= currentStatus ? "white" : "#767575";

  const getDashLineStyles = (lineIndex) => ({
    borderTop: "1px dashed",
    borderColor: status > lineIndex ? "#ff7a28" : "#000",
    width: "100%",
    margin: "27px 10px 10px -15px",
  });

  const getTextColor = (currentStatus) =>
    status >= currentStatus ? "#ff7a28" : "#767575";
  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color mb-3">
        <h4 className="mb-5">Order : {order.orderCode}</h4>
        <div className="row form-btn-text">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className="col-6" style={{ width: "200px" }}>
                Date
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {formatDate(order.date)}{" "}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div style={{ width: "200px" }}>Customer</div>
              <div style={{ width: "auto" }}>
                {order.customerFirstName} {order.customerLastName}{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="row form-btn-text mt-2">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Recipient Name
              </div>
              <div className="text-nowrap" style={{ width: "auto" }}>
                {order.recipient_Name}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className="col-6 text-nowrap" style={{ width: "200px" }}>
                Recipient Email
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {order.recipient_Email}
              </div>
            </div>
          </div>
        </div>

        <div className="row form-btn-text mt-2">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Recipient Contact No
              </div>
              <div className="text-nowrap" style={{ width: "auto" }}>
                {order.recipient_Contact}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className="col-6 text-nowrap" style={{ width: "200px" }}>
                Recipient Address
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {order.recipient_Address}
              </div>
            </div>
          </div>
        </div>

        <div className="row form-btn-text mt-5">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Order Item count
              </div>
              <div className="text-nowrap" style={{ width: "auto" }}>
                {order.orderItemCount}{" "}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className="col-6 text-nowrap" style={{ width: "200px" }}>
                Status
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {order.status === 0 ? (
                  <div className="status-pending-btn">Pending</div>
                ) : order.status === 1 ? (
                  <div
                    className="status-processing-btn"
                    style={{ width: "80px" }}
                  >
                    Processing
                  </div>
                ) : order.status === 2 ? (
                  <div className="status-active-btn">Complete</div>
                ) : order.status === 4 ? (
                  <div className="status-cancel-requested-btn">
                    Cancel Requested
                  </div>
                ) : order.status === 3 ? (
                  <div className="status-inactive-btn">Cancel</div>
                ) : null}{" "}
              </div>
            </div>
          </div>
        </div>
        <div className="row form-btn-text mt-2">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Is Cancel Request?
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {order.isCancellationRequested ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className="col-6 text-nowrap" style={{ width: "200px" }}>
                Is Cancel Approved?
              </div>
              <div className="col-6 text-nowrap" style={{ width: "auto" }}>
                {order.isCancellationApproved ? "Yes" : "No"}
              </div>
            </div>
          </div>
        </div>

        <div className="row form-btn-text mt-2">
          <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Cancelation Note
              </div>
              <div className="text-nowrap" style={{ width: "auto" }}>
                {order.cancellationNote}{" "}
              </div>
            </div>
          </div>
          <div className="col-6 d-flex justify-content-left gap-5">
            {order.isCancellationRequested &&
              order.isCancellationApproved !== 1 &&
              order.isCancellationApproved !== 2 && userRole ==='1' && (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary form-btn-text"
                    onClick={handleApproveRequest}
                    disabled={order.isCancellationApproved}
                  >
                    Confirm Request
                  </button>
                  <button
                    type="submit"
                    onClick={handleRejectRequest}
                    className="btn btn-danger form-btn-text"
                  >
                    Reject Request
                  </button>
                </>
              )}
          </div>
        </div>
        {/* order tracking */}
        {status !== 3 && status !== 4 && (
          <div className="d-flex justify-content-center mt-5 mb-5">
            <div className="col-1">
              <button style={getButtonStyles(0)} disabled>
                <PendingStatus width={25} height={25} color={getIconColor(0)} />
              </button>
              <span
                style={{
                  color: getTextColor(0),
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                Pending
              </span>
            </div>

            <div className="col-1">
              <div style={getDashLineStyles(0)} />
            </div>

            <div className="col-1">
              <button style={getButtonStyles(1)} disabled>
                <ProcessingStatus
                  width={25}
                  height={25}
                  color={getIconColor(1)}
                />
              </button>
              <span
                style={{
                  color: getTextColor(1),
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                Processing
              </span>
            </div>

            <div className="col-1">
              <div style={getDashLineStyles(1)} />
            </div>

            <div className="col-1">
              <button style={getButtonStyles(2)} disabled>
                <DeliveredStatus
                  width={25}
                  height={25}
                  color={getIconColor(2)}
                />
              </button>
              <span
                style={{
                  color: getTextColor(2),
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                Delivered
              </span>
            </div>
          </div>
        )}
        <div className="container mt-3">
          <DataTable
            columns={TABLE_ORDER_ITEM}
            responsive
            data={order.orderItems}
            customStyles={tableHeaderStyles}
            className="mt-4"
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15]}
            paginationComponentOptions={{
              rowsPerPageText: "Entries per page:",
              rangeSeparatorText: "of",
            }}
            progressPending={tableLoading}
            noDataComponent={
              <div className="text-center">No data available</div>
            }
            conditionalRowStyles={conditionalRowStyles}
          />
        </div>

        <div className="container mt-3">
        <div className="col-6 d-flex justify-content-left">
            <div className="row">
              <div className=" text-nowrap" style={{ width: "200px" }}>
                Total Price :
              </div>
              <div className="text-nowrap" style={{ width: "auto" }}>
               Rs . {order.totalPrice.toFixed(2)}{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
