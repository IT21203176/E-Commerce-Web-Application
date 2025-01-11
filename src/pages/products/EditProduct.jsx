import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axiosClient from "../../../axios-client";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export const EditProduct = ({ id, title, productId, handleLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    lowStockLvl: 0,
    product_idProductList: '',  
    product_idVendor: '',       
    image: ''           
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch product details on component load
  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/Products/${productId}`);
        setFormData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    getProduct();
  }, [productId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form input
  const validate = (data) => {
    const errors = {};
    if (!data.name) errors.name = "Product Name is required.";
    if (!data.description) errors.description = "Description is required.";
    if (data.price <= 0) errors.price = "Price must be greater than 0.";
    if (data.stock < 0) errors.stock = "Stock cannot be negative.";
    if (data.lowStockLvl < 0)
      errors.lowStockLvl = "Low Stock Level cannot be negative.";
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await axiosClient.put(`/Products/${productId}`, formData);
      setLoading(false);
      Swal.fire("Success!", "Product updated successfully.", "success");
      handleLoading();
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire("Error", "Could not update the product.", "error");
      setLoading(false);
    }
  };

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
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body theme-text-color">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="row mt-2">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label className="modal-label">Product Name</label>
                        <input
                          value={formData.name}
                          name="name"
                          type="text"
                          onChange={handleChange}
                          className={`form-control my-2 modal-label ${
                            errors.name ? "is-invalid" : ""
                          }`}
                        />
                        {errors.name && (
                          <div className="invalid-feedback">{errors.name}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label className="modal-label">Description</label>
                        <input
                          value={formData.description}
                          name="description"
                          type="text"
                          onChange={handleChange}
                          className={`form-control my-2 modal-label ${
                            errors.description ? "is-invalid" : ""
                          }`}
                        />
                        {errors.description && (
                          <div className="invalid-feedback">
                            {errors.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label className="modal-label">Price</label>
                        <input
                          value={formData.price}
                          name="price"
                          type="number"
                          onChange={handleChange}
                          className={`form-control my-2 modal-label ${
                            errors.price ? "is-invalid" : ""
                          }`}
                        />
                        {errors.price && (
                          <div className="invalid-feedback">{errors.price}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label className="modal-label">Stock</label>
                        <input
                          value={formData.stock}
                          name="stock"
                          type="number"
                          onChange={handleChange}
                          className={`form-control my-2 modal-label ${
                            errors.stock ? "is-invalid" : ""
                          }`}
                        />
                        {errors.stock && (
                          <div className="invalid-feedback">{errors.stock}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label className="modal-label">Low Stock Level</label>
                        <input
                          value={formData.lowStockLvl}
                          name="lowStockLvl"
                          type="number"
                          onChange={handleChange}
                          className={`form-control my-2 modal-label ${
                            errors.lowStockLvl ? "is-invalid" : ""
                          }`}
                        />
                        {errors.lowStockLvl && (
                          <div className="invalid-feedback">
                            {errors.lowStockLvl}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger me-2 form-btn-text"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary form-btn-text">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
