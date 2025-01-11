import {
  CustomerIcon,
  DashboardIcon,
  EstateIcon,
  OrderIcon,
  ProductIcon,
  ReviewIcon,
  SupplierIcon,
  UserIcon,
} from "./icons";

export const newNavigationItems = [
  {
    title: "Dashboard",
    link: "/",
    icon: DashboardIcon,
    children: 0,
  },
  {
    title: "Products",
    link: "/products",
    icon: EstateIcon,
    children: 0,
  },
  {
    title: "Suppliers",
    link: "/suppliers",
    icon: SupplierIcon,
    children: 0,
  },
];

export const adminSidebarItems = [
  { title: "Dashboard", link: "/", icon: DashboardIcon },
  { title: "Customers", link: "/customers/approved", icon: CustomerIcon },
  { title: "Products", link: "/products", icon: ProductIcon },
  { title: "Users", link: "/users/vendors", icon: UserIcon },
  { title: "Orders", link: "/orders/new", icon: OrderIcon },
];

export const vendorSidebarItems = [
  { title: "Dashboard", link: "/", icon: DashboardIcon },
  { title: "Products", link: "/products", icon: ProductIcon },
  { title: "Orders", link: "/orders/new", icon: OrderIcon },
  { title: "Reviews", link: "/review/comment", icon: ReviewIcon },
];

export const csrSidebarItems = [
  { title: "Dashboard", link: "/", icon: DashboardIcon },
  { title: "Customers", link: "/customers/approved", icon: CustomerIcon },
  { title: "Users", link: "/users/vendors", icon: UserIcon },
  { title: "Orders", link: "/orders/new", icon: OrderIcon },
];

export const subPathLinks = {
  Vendor: "/users/vendors",
  CSR: "/users/csr",
  "Approved Customers": "/customers/approved",
  "Pending Customers": "/customers/pending",
  "New Orders": "/orders/new",
  "All Orders": "/orders/all",
  "Incomplete Orders": "/orders/incomplete",
  "Complete Orders": "/orders/complete",
  "Cancelation Requests": "/orders/cancel",
  "Cancelation Accepted": "/orders/approved-cancelation",
  Ratings: "/review/rating",
  Comments: "/review/comment",
};

export const tableHeaderStyles = {
  headCells: {
    style: {
      font: "Poppins",
      fontWeight: "600",
      color: "#64728C",
      fontSize: "14px",
    },
  },
  cells: {
    style: {
      font: "Poppins",
      fontWeight: "normal",
      color: "#64728C",
      fontSize: "12px",
    },
  },
};

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    fontSize: "14px",
    fontWeight: "600",
    color: state.isFocused ? "#80b1ff" : "#9ac1ff",
    borderColor: state.isFocused ? "#9ac1ff" : provided.borderColor,
    boxShadow: state.isFocused ? "0 0 0 3px #9ac1ff" : provided.boxShadow,
    "&:hover": {
      borderColor: state.isFocused ? "#64728C" : provided.borderColor,
    },
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "#64728C" : "#64728C",
    backgroundColor: state.isSelected ? "#e7e7e7" : "white",
    ":hover": {
      backgroundColor: state.isSelected ? "#ccc" : "#f3f3f3",
    },
    fontSize: "14px",
    fontWeight: "600",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#64728C",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#bdbdbd",
  }),
};
