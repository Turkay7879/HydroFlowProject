// Import various components that will be used as pages in the app
import Basins from "../Basins/Basins";
import Users from "../Users/Users";
import Models from "../Models/Models";
import Login from "../Users/Login/Login";
import Registration from "../Users/Registration/Registration";
import Calibration from "../Calibration/Calibration";
import Optimization from "../Optimization/Optimization";
import Theory from '../../Theory/Theory.js';

// Define an object called Routes with various page routes and their corresponding components
const Routes = {
  // Calibration page route and component
  CalibrationPage: {
    route: "/calibrate",
    component: <Calibration/>,
  },
  // Optimization page route and component
  OptimizationPage: {
    route: "/optimize",
    component: <Optimization/>,
  },
  // Basins admin panel page route and component
  BasinsAdminPanel: {
    route: "/basins",
    component: <Basins />,
  },
  // Users admin panel page route and component
  UsersAdminPanel: {
    route: "/users",
    component: <Users />,
  },
  // Models admin panel page route and component
  ModelsAdminPanel: {
      route: "/models",
      component: <Models />,
  },
  // Login page route and component
  LoginPage: {
    route: "/login",
    component: <Login/>,
  },
  // Registration page route and component
  RegisterPage: {
    route: "/register",
    component: <Registration/>
    },
  // Theory page route and component
   Theory: {
        route: "/theory",
        component: <Theory/>
   }
};

// Export the Routes object as the default module export
export default Routes;