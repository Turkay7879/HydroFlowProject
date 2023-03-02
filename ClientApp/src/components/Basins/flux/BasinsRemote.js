import RemoteRequestURLs from "../../Constants/RemoteRequestURLs";

const BasinsRemote = {
  getAllBasins: async () => {
    let requestUrl = RemoteRequestURLs.BASIN_GET_ALL_BASINS;
    return await fetch(requestUrl);
  },
};

export default BasinsRemote;
