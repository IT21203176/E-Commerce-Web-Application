import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserIcon } from "@heroicons/react/24/solid";
import { SideBar } from "./SideBar";
import { useStateContext } from "../../contexts/NavigationContext";
import { subPathLinks } from "../../utils/dataArrays";
import { ArrowBack, NotificationIcon } from "../../utils/icons";
import userIcon from "../../assets/images/user.png";

export const MainLayout = () => {
  const [signOutVisible, setSignOutVisible] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const dropdownRef = useRef(null);
  const sideBardownRef = useRef(null);
  const sideBarButtondownRef = useRef(null);
  const { token, setUser, setToken, user } = useStateContext();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const toggleSidebarExpand = () => {
    setSidebarExpanded((cur) => !cur);
  };

  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSignOutVisible(false);
      }
      if (
        sideBardownRef.current &&
        !sideBardownRef.current.contains(event.target)
      ) {
        if (
          sideBarButtondownRef.current &&
          sideBarButtondownRef.current.contains(event.target)
        ) {
          setSidebar(true);
        } else {
          setSidebar(false);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  let mainPath = "";
  let subPaths = [];
  const pathParts = location.pathname.split("/");
  const id = pathParts[3];

  switch (location.pathname) {
    case "/":
      mainPath = "Dashboard";
      subPaths = ["Back"];
      break;
    case "/products":
      mainPath = "Products";
      subPaths = ["Back"];
      break;
    case `/products/view/${id}`:
      mainPath = "Products";
      subPaths = ["Back"];
      break;
    case "/users/vendors":
      mainPath = "Users";
      subPaths = ["Back", "Vendor", "CSR"];
      break;
    case "/users/csr":
      mainPath = "Users";
      subPaths = ["Back", "Vendor", "CSR"];
      break;
    case "/profile":
      mainPath = "Account";
      subPaths = ["Back"];
      break;
    case "/customers/approved":
      mainPath = "Customers";
      subPaths = ["Back", "Approved Customers", "Pending Customers"];
      break;
    case "/customers/pending":
      mainPath = "Customers";
      subPaths = ["Back", "Approved Customers", "Pending Customers"];
      break;
    case "/notifications":
      mainPath = "Notifications";
      subPaths = ["Back"];
      break;
    case "/orders/new":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case `/orders/view/${id}`:
      mainPath = "Orders";
      subPaths = ["Back"];
      break;
    case "/orders/all":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Complete Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case "/orders/approved-cancelation":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Complete Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case "/orders/incomplete":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Complete Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case "/orders/cancel":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Complete Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case "/orders/complete":
      mainPath = "Orders";
      subPaths = [
        "Back",
        "New Orders",
        "All Orders",
        "Complete Orders",
        "Incomplete Orders",
        "Cancelation Requests",
        "Cancelation Accepted",
      ];
      break;
    case "/review/comment":
      mainPath = "Reviews";
      subPaths = ["Back", "Ratings", "Comments"];
      break;
    case "/review/rating":
      mainPath = "Reviews";
      subPaths = ["Back", "Ratings", "Comments"];
      break;
    default:
      break;
  }

  return (
    <section className="d-flex">
      {/* Sidebar */}
      <div>
        <SideBar
          handleSidebar={() => setSidebar(!sidebar)}
          sidebar={sidebar}
          handleLogout={handleLogout}
          sidebarExpanded={sidebarExpanded}
          toggleSidebarExpand={toggleSidebarExpand}
        />
      </div>

      {/* Main Content Area */}
      <section
        style={{ marginLeft: "140px" }}
        className={`main-content transition-all duration-300 flex-grow-1`}
      >
        <div className="header">
          <div className="d-flex justify-content-between">
            <div className="main-path">{mainPath}</div>
            <div className=" me-3">
              <div className="d-flex">
                <div className="my-3 me-5">
                  <Link to="/notifications">
                    <NotificationIcon />
                  </Link>
                </div>
                <Link to="/profile">
                  <img
                    src={userIcon}
                    alt="Logo"
                    style={{ width: "50px", height: "50px", cursor: "pointer" }}
                    className="my-2 me-3"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-header d-flex align-items-center">
          {subPaths.map((path, index) =>
            path === "Back" ? (
              <div key={index} className="me-3">
                <a href="#" onClick={() => window.history.back()}>
                  <button className="sub-header-back">
                    <ArrowBack className="me-2" />
                  </button>
                </a>
              </div>
            ) : (
              <Link key={index} to={subPathLinks[path]}>
                <button
                  className={`sub-header-path ${
                    location.pathname.includes(subPathLinks[path])
                      ? "sub-header-path-active"
                      : ""
                  }`}
                >
                  {path}
                </button>
              </Link>
            )
          )}
        </div>

        <div
          style={{
            marginLeft: "75px",
            marginRight: "20px",
            marginTop: "20px",
          }}
        >
          <Outlet />
        </div>
      </section>
    </section>
  );
};
