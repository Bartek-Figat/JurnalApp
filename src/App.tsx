import { useRoutes } from "react-router-dom";
import Main from "./pages/main/main";
import NotFoundPage from "./pages/notFound/notFound";
import SingIn from "./pages/singUp/singUp";
import Login from "./pages/login/login";
import Layout from "./pages/layout/layout";
import DashboardPage from "./pages/dashboard/dashboardIndex/DashboardPage";
import CreateTrade from "./pages/createTrade/CreateTrade";

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
