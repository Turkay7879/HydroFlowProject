import Basins from "../Basins/Basins";
import Users from "../Users/Users";
import Models from "../Models/Models";
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
};

export default Routes;
