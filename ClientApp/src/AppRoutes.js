import Basins from "./components/Basins/Basins";
import { Home } from "./components/Home";

const AppRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "/basins",
    element: <Basins />,
  },
];

export default AppRoutes;
