import React from "react";
import { useRoutes } from "react-router-dom";
import Main from "./pages/main/main";
import NotFoundPage from "./pages/notFound/notFound";
import SingIn from "./pages/singUp/singUp";
import Login from "./pages/login/login";
import Layout from "./pages/layout/layout";
import DashboardPage from "./pages/dashboard/dashboardIndex/DashboardPage";
import CreateTrade from "./pages/createTrade/CreateTrade";
import Calendar from "./pages/calendar/Calendar";
import TradeDetail from "./pages/tradeDetail/TradeDetail";
import WrappedCheckoutForm from "./pages/stripe/Payment";
import CompleteTransactionPage from "./pages/stripe/CompleteTrabsaction";

const App = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "/sing-in",
      element: <SingIn />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "dashboard",
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: "create-trade", element: <CreateTrade /> },
        { path: "calendar", element: <Calendar /> },
        { path: "trade/:tradeId", element: <TradeDetail /> },
        {
          path: "checkout",
          element: <WrappedCheckoutForm />,
        },
        {
          path: "complete",
          element: <CompleteTransactionPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return element;
};

export default App;
