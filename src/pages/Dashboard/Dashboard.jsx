import React, { useState, useEffect } from "react";
import axiosClient from "../../../axios-client";
import {
  CustomerIcon,
  OrderIcon,
  ProductCategory,
  ProductIcon,
  UserIcon,
} from "../../utils/icons";
import { useStateContext } from "../../contexts/NavigationContext";

export const Dashboard = () => {
  const { user } = useStateContext();
  const userId = user.id;
  const userRole = user.role;

  const [customers, setCustomers] = useState([]);
  const [pendingCustomers, setPendingCustomers] = useState([]);
  const [productList, setProductList] = useState([]);
  const [activeProductListCount, setActiveProductListCount] = useState(0);
  const [inactiveProductListCount, setInactiveProductListCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [activeProductCount, setActiveProductCount] = useState(0);
  const [inactiveProductCount, setInactiveProductCount] = useState(0);
  const [csr, setCsr] = useState([]);
  const [activeCsrCount, setActiveCsrCount] = useState(0);
  const [inactiveCsrCount, setInactiveCsrCount] = useState(0);
  const [vendors, setVendors] = useState([]);
  const [activeVendorCount, setActiveVendorCount] = useState(0);
  const [inactiveVendorCount, setInactiveVendorCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [cancelAcceptedOrders, setCancelAcceptedOrders] = useState([]);
  const [cancelOrders, setCancelOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const [IncompleteOrders, setIncompleteOrders] = useState([]);
  const [newOrders, setNewOrders] = useState([]);

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
  }, []);

  useEffect(() => {
    const fetchPendingCustomers = async () => {
      try {
        const response = await axiosClient.get("/Users/customers/pending");
        setPendingCustomers(response.data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };
    fetchPendingCustomers();
  }, []);

  useEffect(() => {
    const fetchProductList = () => {
      axiosClient
        .get("ProductLists")
        .then((res) => {
          const products = res.data;
          setProductList(products);

          const activeProducts = products.filter(
            (product) => product.isActive === true
          );
          const inactiveProducts = products.filter(
            (product) => product.isActive === false
          );
          setActiveProductListCount(activeProducts.length);
          setInactiveProductListCount(inactiveProducts.length);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchProductList();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response;
        if (userRole === "1" || userRole === "2") {
          response = await axiosClient.get("/Products");
        } else if (userRole === "3") {
          response = await axiosClient.get(`Products/vendorId/${userId}`);
        }
        const products = response.data;
        setProducts(products);
        const activeProducts = products.filter(
          (product) => product.isActive === true
        );
        const inactiveProducts = products.filter(
          (product) => product.isActive === false
        );
        setActiveProductCount(activeProducts.length);
        setInactiveProductCount(inactiveProducts.length);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, [userRole, userId]);

  useEffect(() => {
    const fetchCsr = async () => {
      try {
        const response = await axiosClient.get("/Users/csrs");
        const csr = response.data;
        setCsr(csr);
        const activeCsr = csr.filter((product) => product.isActive === 1);
        const inactiveCsr = csr.filter((product) => product.isActive === 2);
        setActiveCsrCount(activeCsr.length);
        setInactiveCsrCount(inactiveCsr.length);
      } catch (error) {
        console.error("Failed to fetch Vendors", error);
      }
    };
    fetchCsr();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axiosClient.get("/Users/vendors");
        setVendors(response.data);
        const vendor = response.data;
        setVendors(vendor);
        const activeVendor = vendor.filter((vendor) => vendor.isActive === 1);
        const inactiveVendor = vendor.filter((vendor) => vendor.isActive === 2);
        setActiveVendorCount(activeVendor.length);
        setInactiveVendorCount(inactiveVendor.length);
      } catch (error) {
        console.error("Failed to fetch Vendors", error);
      }
    };
    fetchVendors();
  }, []);

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
        const cancelationAcceptedOrders = response.data.filter(
          (order) => order.status === 3
        );
        setCancelAcceptedOrders(cancelationAcceptedOrders);
        const cancelOrders = response.data.filter(
          (order) =>
            order.isCancellationRequested === true &&
            order.isCancellationApproved === 0
        );
        setCancelOrders(cancelOrders);

        const completeOrders = response.data.filter(
          (order) => order.status === 2
        );
        setCompleteOrders(completeOrders);

        const incompleteOrders = response.data.filter(
          (order) => order.status === 1
        );
        setIncompleteOrders(incompleteOrders);

        const newOrders = response.data.filter((order) => order.status === 0);
        setNewOrders(newOrders);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      }
    };
    fetchOrders();
  }, [userId]);

  const totalCustomers = customers.length + pendingCustomers.length;

  const cardData = [
    {
      id: 1,
      icon: CustomerIcon,
      color: "#2a3577",
      title: "Total Customers",
      content: `${totalCustomers}`,
    },
    {
      id: 2,
      icon: CustomerIcon,
      color: "#32b800",
      title: "Approved Customers",
      content: `${customers.length}`,
    },
    {
      id: 3,
      icon: CustomerIcon,
      color: "#ec6800",
      title: "Pending Customers",
      content: `${pendingCustomers.length}`,
    },
  ];

  const productListData = [
    {
      id: 1,
      icon: ProductCategory,
      color: "#2a3577",
      title: "Total Product Lists",
      content: `${productList.length}`,
    },
    {
      id: 2,
      icon: ProductCategory,
      color: "#32b800",
      title: "Active Product Lists",
      content: `${activeProductListCount}`,
    },
    {
      id: 3,
      icon: ProductCategory,
      color: "#ec6800",
      title: "Inactive Product Lists",
      content: `${inactiveProductListCount}`,
    },
  ];

  const productData = [
    {
      id: 1,
      icon: ProductIcon,
      color: "#2a3577",
      title: "Total Products",
      content: `${products.length}`,
    },
    {
      id: 2,
      icon: ProductIcon,
      color: "#32b800",
      title: "Active Products",
      content: `${activeProductCount}`,
    },
    {
      id: 3,
      icon: ProductIcon,
      color: "#ec6800",
      title: "Inactive Products",
      content: `${inactiveProductCount}`,
    },
  ];

  const csrData = [
    {
      id: 1,
      icon: UserIcon,
      color: "#2a3577",
      title: "Total CSR Members",
      content: `${csr.length}`,
    },
    {
      id: 2,
      icon: UserIcon,
      color: "#32b800",
      title: "Active CSR Members",
      content: `${activeCsrCount}`,
    },
    {
      id: 3,
      icon: UserIcon,
      color: "#ec6800",
      title: "Inactive CSR Members",
      content: `${inactiveCsrCount}`,
    },
  ];

  const vendorData = [
    {
      id: 1,
      icon: UserIcon,
      color: "#2a3577",
      title: "Total Vendors",
      content: `${vendors.length}`,
    },
    {
      id: 2,
      icon: UserIcon,
      color: "#32b800",
      title: "Active Vendors",
      content: `${activeVendorCount}`,
    },
    {
      id: 3,
      icon: UserIcon,
      color: "#ec6800",
      title: "Inactive Vendors",
      content: `${inactiveVendorCount}`,
    },
  ];

  const orderData = [
    {
      id: 1,
      icon: OrderIcon,
      color: "#2a3577",
      title: "All Orders",
      content: `${orders.length}`,
    },
    {
      id: 2,
      icon: OrderIcon,
      color: "#ff9d0b",
      title: "New Orders",
      content: `${newOrders.length}`,
    },
    {
      id: 3,
      icon: OrderIcon,
      color: "#076802",
      title: "Complete Orders",
      content: `${completeOrders.length}`,
    },
    {
      id: 3,
      icon: OrderIcon,
      color: "#152ae4",
      title: "Incomplete Orders",
      content: `${IncompleteOrders.length}`,
    },
    {
      id: 3,
      icon: OrderIcon,
      color: "#eb05ca",
      title: "Cancelation requests",
      content: `${cancelOrders.length}`,
    },
    {
      id: 3,
      icon: OrderIcon,
      color: "#e00000",
      title: "Cancel Orders",
      content: `${cancelAcceptedOrders.length}`,
    },
  ];
  return (
    <section>
      {userRole !== "3" && (
        <div className="container">
          <div className="row">
            {cardData.map((card) => (
              <div className="col-12 col-md-4 mb-4" key={card.id}>
                <div className="bg-white rounded-card p-3 shadow">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-1">
                      <div style={{ color: card.color }}>
                        <card.icon width={22} height={22} />
                      </div>
                    </div>
                    <div className="row col-11 align-items-center justify-content-center">
                      <h5 className="col-9 theme-text-color mt-2 view-text1">
                        {card.title}
                      </h5>
                      <div className="col-2 theme-text-color">
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole !== "2" && (
        <div className="container">
          <div className="row">
            {productListData.map((card) => (
              <div className="col-12 col-md-4 mb-4" key={card.id}>
                <div className="bg-white rounded-card p-3 shadow">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-1">
                      <div style={{ color: card.color }}>
                        <card.icon width={22} height={22} />
                      </div>
                    </div>
                    <div className="row col-11 align-items-center justify-content-center">
                      <h5 className="col-9 theme-text-color mt-2 view-text1">
                        {card.title}
                      </h5>
                      <div className="col-2 theme-text-color">
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole !== "2" && (
        <div className="container">
          <div className="row">
            {productData.map((card) => (
              <div className="col-12 col-md-4 mb-4" key={card.id}>
                <div className="bg-white rounded-card p-3 shadow">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-1">
                      <div style={{ color: card.color }}>
                        <card.icon width={22} height={22} />
                      </div>
                    </div>
                    <div className="row col-11 align-items-center justify-content-center">
                      <h5 className="col-9 theme-text-color mt-2 view-text1">
                        {card.title}
                      </h5>
                      <div className="col-2 theme-text-color">
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole !== "3" && (
        <div className="container">
          <div className="row">
            {csrData.map((card) => (
              <div className="col-12 col-md-4 mb-4" key={card.id}>
                <div className="bg-white rounded-card p-3 shadow">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-1">
                      <div style={{ color: card.color }}>
                        <card.icon width={22} height={22} />
                      </div>
                    </div>
                    <div className="row col-11 align-items-center justify-content-center">
                      <h5 className="col-9 theme-text-color mt-2 view-text1">
                        {card.title}
                      </h5>
                      <div className="col-2 theme-text-color">
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole !== "3" && (
        <div className="container">
          <div className="row">
            {vendorData.map((card) => (
              <div className="col-12 col-md-4 mb-4" key={card.id}>
                <div className="bg-white rounded-card p-3 shadow">
                  <div className="row align-items-center justify-content-center">
                    <div className="col-1">
                      <div style={{ color: card.color }}>
                        <card.icon width={22} height={22} />
                      </div>
                    </div>
                    <div className="row col-11 align-items-center justify-content-center">
                      <h5 className="col-9 theme-text-color mt-2 view-text1">
                        {card.title}
                      </h5>
                      <div className="col-2 theme-text-color">
                        {card.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <div className="row">
          {orderData.map((card) => (
            <div className="col-12 col-md-4 mb-4" key={card.id}>
              <div className="bg-white rounded-card p-3 shadow">
                <div className="row align-items-center justify-content-center">
                  <div className="col-1">
                    <div style={{ color: card.color }}>
                      <card.icon width={22} height={22} />
                    </div>
                  </div>
                  <div className="row col-11 align-items-center justify-content-center">
                    <h5 className="col-9 theme-text-color mt-2 view-text1">
                      {card.title}
                    </h5>
                    <div className="col-2 theme-text-color">{card.content}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
