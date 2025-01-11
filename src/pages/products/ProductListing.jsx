import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import { useStateContext } from "../../contexts/NavigationContext";
import { tableHeaderStyles } from "../../utils/dataArrays";
import { ChangeIcon, DeleteIcon, EditNewIcon } from "../../utils/icons";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const ProductListing = ({ id, title }) => {
  const { user } = useStateContext();
  const userId = user.id;
  const userRole = user.role;

  console.log("userId: ", user);
  const [productList, setProductList] = useState([]);
  const [productListTableLoading, setProductListTableLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [editProductList, setEditProductList] = useState({
    id: "0",
    Name: "",
    Description: "",
  });

  const [addProductList, setAddProductList] = useState({
    Name: "",
    Description: "",
  });

  const handleLoading = () => setProductListTableLoading((pre) => !pre);

  //reset form data
  const resetEditForm = () => {
    setEditProductList({
      id: "0",
      Name: "",
      Description: "",
    });
    setAddProductList({
      Name: "",
      Description: "",
    });
    setErrors({});
  };

  //Fetching current product list
  useEffect(() => {
    const fetchProductList = () => {
      axiosClient
        .get(`ProductLists`)
        .then((res) => {
          setProductList(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchProductList();
  }, [productListTableLoading]);

  const handleEditProductList = (productList) => {
    setEditProductList({
      id: productList.id,
      Name: productList.name,
      Description: productList.description,
    });
  };

  //edit product list function
  const handleEdit = () => {
    const validationErrors = validate(editProductList);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    axiosClient
      .put(`ProductLists/${editProductList.id}`, editProductList)
      .then((response) => {
        handleLoading();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product list updated successfully!",
        });
        resetEditForm();
      })
      .catch((error) => {
        console.error("Error updating product list:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while updating the product list.",
        });
      });
  };

  const handleCancelEditProductList = () => {
    setEditProductList({
      id: "0",
      Name: "",
      Description: "",
    });
  };

  // Validation function for form data
  const validate = (valData) => {
    const errors = {};
    if (!valData.Name) {
      errors.Name = "* Name is required.";
    }

    if (!valData.Description) {
      errors.Description = "* Description is required.";
    }
    return errors;
  };

  //product list
  const handleSave = () => {
    const validationErrors = validate(addProductList);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    axiosClient
      .post("ProductLists", addProductList)
      .then((response) => {
        handleLoading();
        resetEditForm();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product list added successfully!",
        });
      })
      .catch((error) => {
        console.error("Error saving Zone:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while adding the product list.",
        });
      });
  };

  //product list status change function
  const handleStatusChange = (productList) => {
    axiosClient
      .patch(`ProductLists/${productList.id}/state`)
      .then((response) => {
        handleLoading();
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Product status updated Successfully !!`,
        });
      })
      .catch((error) => {
        console.error("Error updating product status:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while updating the product status.",
        });
      });
  };

  //product delete function
  const handleDelete = (productList) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`ProductLists/${productList.id}`)
          .then((response) => {
            handleLoading();
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "Product List deleted successfully.",
            });
          })
          .catch((error) => {
            console.error("Error deleting product list:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while deleting the product list.",
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          icon: "info",
          title: "Cancelled",
          text: "Your product list is safe.",
        });
      }
    });
  };

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
  }, [productList, productListTableLoading]);

  const TABLE_PRODUCT_LIST = [
    {
      name: "Name",
      selector: (row) => row.name,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Description",
      selector: (row) => row.description,
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
        row.isActive === false ? (
          <div className="status-inactive-btn">Inactive</div>
        ) : row.isActive === true ? (
          <div className="status-active-btn">Active</div>
        ) : null,
      wrap: false,
      minWidth: "50px",
      center: true,
    },
    ...(userRole !== "3"
      ? [
          {
            name: "Action",
            cell: (row) => (
              <div>
                <button
                  className="edit-btn me-4"
                  onClick={() => handleEditProductList(row)}
                  title="Edit List"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                >
                  <EditNewIcon />
                </button>
                <button
                  className="edit-btn me-4"
                  onClick={() => handleStatusChange(row)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Change Status"
                >
                  <ChangeIcon />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handleDelete(row)}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Delete List"
                >
                  <DeleteIcon />
                </button>
              </div>
            ),
            minWidth: "50px",
          },
        ]
      : []),
  ];

  return (
    <div
      className="modal fade p-2"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Title`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header theme-text-color">
            <h5 className="modal-title" id={`${id}Title`}>
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body theme-text-color">
            <div className=""></div>
            {userRole !== "3" && (
              <>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <div className="modal-label">Name</div>
                      {editProductList.id !== "0" ? (
                        <input
                          name="Name"
                          type="text"
                          className="form-control my-2 modal-label"
                          value={editProductList.Name}
                          onChange={(e) =>
                            setEditProductList({
                              ...editProductList,
                              Name: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <input
                          value={addProductList.Name}
                          name="Name"
                          type="text"
                          className="form-control my-2 modal-label"
                          onChange={(e) =>
                            setAddProductList({
                              ...addProductList,
                              Name: e.target.value,
                            })
                          }
                        />
                      )}
                      {errors.Name && (
                        <div className="error-text">{errors.Name}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <div className="modal-label">Description</div>
                      {editProductList.id !== "0" ? (
                        <input
                          name="Description"
                          type="text"
                          className="form-control my-2 modal-label"
                          value={editProductList.Description}
                          onChange={(e) =>
                            setEditProductList({
                              ...editProductList,
                              Description: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <input
                          value={addProductList.Description}
                          name="Description"
                          type="text"
                          className="form-control my-2 modal-label"
                          onChange={(e) =>
                            setAddProductList({
                              ...addProductList,
                              Description: e.target.value,
                            })
                          }
                        />
                      )}
                      {errors.Description && (
                        <div className="error-text">{errors.Description}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  {editProductList.id !== "0" ? (
                    <div className="d-flex justify-content-end">
                      <button
                        onClick={() => handleCancelEditProductList()}
                        className="btn btn-danger me-2 form-btn-text"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEdit()}
                        className="btn btn-primary form-btn-text"
                      >
                        Update
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="submit"
                        onClick={() => handleSave()}
                        className="btn btn-primary form-btn-text"
                      >
                        Add List
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <DataTable
                columns={TABLE_PRODUCT_LIST}
                responsive
                data={productList}
                customStyles={tableHeaderStyles}
                className="mt-4 "
                pagination
                paginationPerPage={4}
                paginationRowsPerPageOptions={[4]}
                paginationComponentOptions={{
                  rowsPerPageText: "Entries per page:",
                  rangeSeparatorText: "of",
                }}
                noDataComponent={
                  <div className="text-center">No data available</div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
