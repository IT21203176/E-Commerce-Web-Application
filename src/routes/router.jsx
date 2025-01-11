import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../components/layouts/MainLayout";
import { GuestLayout } from "../components/layouts/GuestLayout";
import { Dashboard } from "../pages/Dashboard/Dashboard";
import { Products } from "../pages/products/Products";
import SignIn from "../pages/users/SignIn";
import ProtectedRoute from "./ProtectedRoute";
import { Vendors } from "../pages/users/Vendors";
import { Csr } from "../pages/users/Csr";
import { ViewProduct } from "../pages/products/ViewProduct";
import { UserProfile } from "../pages/users/UserProfile";
import { Customer } from "../pages/customers/Customer";
import { PendingCustomer } from "../pages/customers/PendingCustomer";
import Notifications from "../pages/notifications/Notifications";
import { Orders } from "../pages/orders/Orders";
import { OrderDetails } from "../pages/orders/OrderDetails";
import { CompleteOrders } from "../pages/orders/CompleteOrders";
import { IncompleteOrders } from "../pages/orders/IncompleteOrders";
import { CancelOrders } from "../pages/orders/CancelOrders";
import { AllOrders } from "../pages/orders/AllOrders";
import { CancalationAcceptedOrders } from "../pages/orders/CancalationAcceptedOrders";
import { Ratings } from "../pages/reviews/Ratings";
import { Comments } from "../pages/reviews/Comments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "/products/view/:id",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <ViewProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/vendors",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Vendors />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/csr",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Csr />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers/approved",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Customer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/customers/pending",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <PendingCustomer />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/new",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/view/:id",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <OrderDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/all",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <AllOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/incomplete",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <IncompleteOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/cancel",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <CancelOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/approved-cancelation",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <CancalationAcceptedOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders/complete",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <CompleteOrders />
          </ProtectedRoute>
        ),
      },
      {
        path: "/review/rating",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Ratings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/review/comment",
        element: (
          <ProtectedRoute roles={["1", "3","2"]}>
            <Comments />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <SignIn />,
      },
    ],
  },
]);

export default router;
