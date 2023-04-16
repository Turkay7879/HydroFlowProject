import Basins from "../Basins/Basins";
import Users from "../Users/Users";
import Models from "../Models/Models";
import Login from "../Users/Login/Login";
import Registration from "../Users/Registration/Registration";

const Routes = {
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
  }
};

export default Routes;
