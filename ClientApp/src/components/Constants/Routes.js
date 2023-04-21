import Basins from "../Basins/Basins";
import Users from "../Users/Users";
import Models from "../Models/Models";
import Optimization from "../Optimization/Optimization";

const Routes = {
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
};

export default Routes;
