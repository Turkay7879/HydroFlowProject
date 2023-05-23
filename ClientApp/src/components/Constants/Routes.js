import Basins from "../Basins/Basins";
import Users from "../Users/Users";
import Models from "../Models/Models";
import Login from "../Users/Login/Login";
import Registration from "../Users/Registration/Registration";
import Calibration from "../Calibration/Calibration";
import Optimization from "../Optimization/Optimization";
import Theory from '../../Theory/Theory.js';

const Routes = {
  CalibrationPage: {
    route: "/calibrate",
    component: <Calibration/>,
  },
  OptimizationPage: {
    route: "/optimize",
    component: <Optimization/>,
  },
  BasinsAdminPanel: {
    route: "/basins",
    component: <Basins />,
  },
  UsersAdminPanel: {
    route: "/users",
    component: <Users />,
  },
  ModelsAdminPanel: {
      route: "/models",
      component: <Models />,
  },
  LoginPage: {
    route: "/login",
    component: <Login/>,
  },
  RegisterPage: {
    route: "/register",
    component: <Registration/>
    },

   Theory: {
        route: "/theory",
        component: <Theory/>
   }
};

export default Routes;
