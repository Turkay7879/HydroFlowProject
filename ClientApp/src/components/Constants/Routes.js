import Basins from "../Basins/Basins";
import Users from "../Users/Users";

const Routes = {
  BasinsAdminPanel: {
    route: "/basins",
    component: <Basins />,
  },
  UsersAdminPanel: {
    route: "/users",
    component: <Users />,
  },
};

export default Routes;
