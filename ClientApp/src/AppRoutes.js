import Routes from "./components/Constants/Routes";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: Routes.CalibrationPage.route,
    element: Routes.CalibrationPage.component,
  },
  {
    path: Routes.OptimizationPage.route,
    element: Routes.OptimizationPage.component,
  },
  {
    path: Routes.BasinsAdminPanel.route,
    element: Routes.BasinsAdminPanel.component,
  },
  {
    path: Routes.UsersAdminPanel.route,
    element: Routes.UsersAdminPanel.component,
  },
  {
      path: Routes.ModelsAdminPanel.route,
      element: Routes.ModelsAdminPanel.component,
  },
  {
    path: Routes.LoginPage.route,
    element: Routes.LoginPage.component,
  },
  {
    path: Routes.RegisterPage.route,
    element: Routes.RegisterPage.component,
    },
   {
        path: Routes.Theory.route,
        element: Routes.Theory.component,
    }
];

export default AppRoutes;
