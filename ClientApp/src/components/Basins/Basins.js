import React from "react";
import BasinsRemote from "./flux/BasinsRemote";

class Basins extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingBasins: true,
      basins: null,
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    BasinsRemote.getAllBasins()
      .then((response) => {
        response.json().then(data => {
          this.setState({ loadingBasins: false, basins: data });
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loadingBasins: false });
      });
  }

  editBasin(basin) {
    console.log(`Edit Basin ${basin.Id}`)
  }

  deleteBasin(basin) {
    console.log(`Delete Basin ${basin.Id}`)
  }

  getBody() {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            <th>Basin Name</th>
            <th>Flow Station No</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Field</th>
            <th>Basin Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {this.state.basins.map(basin =>
            <tr key={basin.Id}>
              <td>{basin.BasinName}</td>
              <td>{basin.FlowStationNo}</td>
              <td>{basin.FlowObservationStationLat}</td>
              <td>{basin.FlowObservationStationLong}</td>
              <td>{basin.Field}</td>
              <td>{basin.Description}</td>
              <td>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                  <button 
                    type="button" 
                    class="btn btn-primary"
                    onClick={(e) => { this.editBasin(basin) }}>Edit</button>
                  <button 
                    type="button" 
                    class="btn btn-danger"
                    onClick={(e) => { this.deleteBasin(basin) }}>Delete</button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }

  render() {
    return <>
      {
        this.state.loadingBasins ? <p class="fs-1">Loading Basins...</p> :
        !this.state.basins ? <p class="fs-1">Error Loading Basins!</p> :
        this.getBody()
      }
    </>;
  }
}

export default Basins;
