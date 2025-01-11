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
import { ProductListing } from "./ProductListing";
import { ChangeIcon, DeleteIcon, EditNewIcon } from "../../utils/icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { UpdateStock } from "./UpdateStock";
import { AddProduct } from "./AddProduct";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/NavigationContext";
import { EditProduct } from "./EditProduct";

export const Products = () => {

  const { user } = useStateContext();
  const userId = user.id;
  const userRole = user.role;

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [productTableLoading, setProductTableLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const handleLoading = () => setProductTableLoading((pre) => !pre);

  // Fetching products from the backend
 useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (userRole === "1" || userRole === "2") {
          response = await axiosClient.get("/Products");
        } else if (userRole === "3") {
          response = await axiosClient.get(`Products/vendorId/${userId}`);
        }
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [userRole, productTableLoading, userId]);

  //product status change function
  const handleStatusChange = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to change the status of this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .patch(`Products/${product.id}/status`)
          .then((response) => {
            handleLoading();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Product status updated successfully!`,
            });
          })
          .catch((error) => {
            console.error("Error updating vendor status:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while updating the vendor status.",
            });
          });
      }
    });
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`Products/${product.id}`)
          .then((response) => {
            handleLoading();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Product deleted successfully!`,
            });
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              Swal.fire({
                icon: "error",
                title: "Cannot Delete Product",
                text: "Product cannot be deleted as there are pending orders.",
              });
            } else {
              console.error("Error deleting Product:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong while deleting the Product.",
              });
            }
          });
      }
    });
  };  

  //stock reset function
  const handleResetStock = (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to reset this product stock?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reset stock!",
      cancelButtonText: "No, cancel!",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .put(`Products/stocks/reset/${product.id}`)
          .then((response) => {
            handleLoading();
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: `Product Stock reset successfully!`,
            });
          })
          .catch((error) => {
            console.error("Error reset Product Stock:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong while reset the Product Stock.",
            });
          });
      }
    });
  };

  //stock update function
  const handleUpdateStock = (product) => {
    setSelectedProductId(product.id);
  };

  const handleEditProduct = (product) => {
    setSelectedProductId(product.id);
  };
  // Creating the table
  const TABLE_PRODUCTS = [
    {
      name: "Product Name",
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
      name: "Product List",
      selector: (row) => row.productListName,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
        wordBreak: "break-word",
      },
    },
    {
      name: "Price (Rs)",
      selector: (row) => row.price.toFixed(2),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      right: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      center: true,
    },
    {
      name: "Low Stock Level",
      selector: (row) => row.lowStockLvl,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      center: true,
    },
    {
      name: "Stock Status",
      selector: (row) =>
        row.stockStatus === "Out of Stock" ? (
          <div className="status-inactive-btn" style={{ width: "70px" }}>
            No Stock
          </div>
        ) : row.stockStatus === "In Stock" ? (
          <div className="status-active-btn" style={{ width: "70px" }}>
            In Stock
          </div>
        ) : row.stockStatus === "Low Stock" ? (
          <div
            className="status-cancel-requested-btn"
            style={{ width: "70px" }}
          >
            Low Stock
          </div>
        ) : null,
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      center: true,
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
      minWidth: "auto",
      center: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <Link to={`/products/view/${row.id}`}>
            <button
              className="edit-btn me-1"
              title="Edit Product"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <ViewIcon />
            </button>
          </Link>
          <button
            className="edit-btn me-1"
            onClick={() => handleStatusChange(row)}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Change Status"
          >
            <ChangeIcon />
          </button>
          <button
            className="edit-btn me-1"
            onClick={() => handleDelete(row)}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Delete Product"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
      right: true,
    },
    {
      name: "",
      cell: (row) => (
        <div>
          <button
  className="edit-btn me-1"
  onClick={() => handleEditProduct(row)}
  data-bs-toggle="modal"
  data-bs-target="#updateProductModel" 
  title="Edit Product"
>
  <EditNewIcon />
</button>
          <button
            className="edit-btn me-1"
            onClick={() => handleUpdateStock(row)}
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#updateStockModel"
            title="Update Stock"
          >
            <UpdateStockIcon />
          </button>
          <button
            className="edit-btn me-1"
            onClick={() => handleResetStock(row)}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Reset Stock"
          >
            <ResetIcon />
          </button>
        </div>
      ),
      wrap: true,
      compact: true,
      maxWidth: "auto",
      cellStyle: {
        whiteSpace: "normal",
      },
    },
  ];

  return (
    <section>
      <div className="container bg-white rounded-card p-4 theme-text-color">
        <div className="row">
          <div className="col-6">
           
          </div>

          <div className="col-6 d-flex justify-content-end gap-3">
            <div>
              <button
                className="modal-btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalCenter"
              >
                <ProductCategory />
                &nbsp; Product Listing
              </button>
            </div>

            <div>
              <button
                className="modal-btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addProductModal"
              >
                <AddIcon />
                &nbsp;Add Product
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container bg-white rounded-card p-4 mt-3">
        <DataTable
          columns={TABLE_PRODUCTS}
          responsive
          data={products}
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

      <ProductListing id="exampleModalCenter" title="Product Listing" />
      <AddProduct
        id="addProductModal"
        title="Add Product"
        handleLoading={handleLoading}
      />
      <UpdateStock
        id="updateStockModel"
        title="Update Product Stock"
        productId={selectedProductId}
        handleLoading={handleLoading}
      />

<EditProduct
        id="updateProductModel"
        title="Update Product"
        productId={selectedProductId}
        handleLoading={handleLoading}
      />
    </section>
  );
};
