import { useLocation } from "react-router-dom";
import {
  adminSidebarItems,
  vendorSidebarItems,
  csrSidebarItems,
} from "../../utils/dataArrays";
import { useStateContext } from "../../contexts/NavigationContext";
import logo from "../../assets/images/1.png";
import { LogOutIcon } from "../../utils/icons";

export const SideBar = ({
  handleSidebar,
  handleLogout,
}) => {
  const location = useLocation(); // Get current location
  const { token, setUser, setToken, user } = useStateContext();
  const sidebarItems =
    user?.role === "1"
      ? adminSidebarItems
      : user?.role === "3"
      ? vendorSidebarItems
      : csrSidebarItems;

  const isUsersSectionActive = location.pathname.startsWith("/users");
  const isProductSectionActive = location.pathname.startsWith("/products");
  const isCustomerSectionActive = location.pathname.startsWith("/customers");
  const isOrderSectionActive = location.pathname.startsWith("/orders");
  const isReviewSectionActive = location.pathname.startsWith("/review");

  return (
    <div>
      <div className="sidebar">
        <div>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "200px", marginTop: "-30px" }}
          />
        </div>

        {sidebarItems.slice(0, 8).map((item, itemIndex) => {
          const isActive =
            location.pathname === item.link ||
            (item.link === "/users/vendors" && isUsersSectionActive) ||
            (item.link.startsWith("/products") && isProductSectionActive) ||
            (item.link.startsWith("/customers") && isCustomerSectionActive) ||
            (item.link.startsWith("/review") && isReviewSectionActive) ||
            (item.link.startsWith("/orders") && isOrderSectionActive);

          const NavIcon = item.icon;
          return (
            <a
              href={item.link}
              key={itemIndex}
              className={isActive ? "active" : ""}
              onClick={handleSidebar}
            >
              <NavIcon
                color={isActive ? "white" : "#64728C"}
                width={20}
                height={20}
              />
              <span style={{ marginLeft: "15px" }}>{item.title}</span>
            </a>
          );
        })}

        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            backgroundColor: "#ecefff",
            color: "#2a3577",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            width: "150px",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          <LogOutIcon />
          &nbsp;&nbsp;&nbsp;&nbsp; Logout
        </button>
      </div>
    </div>
  );
};
