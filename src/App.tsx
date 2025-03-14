import { useRoutes } from "react-router-dom";
import Main from "./pages/main/main";
import NotFoundPage from "./pages/notFound/notFound";
import SingIn from "./pages/singIn/singIn";
import Login from "./pages/login/login";
import Layout from "./pages/dasboard/layout";

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
      path: "/dashboard",
      element: <Layout />,
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return element;
};

export default App;
