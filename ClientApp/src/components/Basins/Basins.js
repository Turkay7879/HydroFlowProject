import React from "react";
import BasinsRemote from "./flux/BasinsRemote";
import AddBasinModal from "./Actions/AddBasinModal";

class Basins extends React.Component {
  tableColumns = ["Basin Name", "Flow Station No", "Latitude", "Longitude", "Field", "Basin Description", "Actions"];

  constructor(props) {
    super(props);
    this.state = {
      loadingBasins: true,
      basins: null,
      showAddBasinModal: false,
      savedBasin: false
    };
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate() {
    if (this.state.savedBasin) {
      this.refreshData();
      this.setState({savedBasin: false});
    }
  }

  refreshData = async () => {
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

  toggleAddBasinModal = () => {
    this.setState({
      savedBasin: this.state.showAddBasinModal,
      showAddBasinModal: !this.state.showAddBasinModal
    });
  }

  editBasin = (basin) => {
    console.log(`Edit Basin ${basin.Id}`)
  }

  deleteBasin = (basin) => {
    console.log(`Delete Basin ${basin.Id}`)
  }

  getBody() {
    return (
      <table className="table table-striped" aria-labelledby="tableLabel">
        <thead>
          <tr>
            { this.tableColumns.map(col => <th key={col}>{col}</th>) }
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
                  <button type="button" className="btn btn-primary"
                    onClick={(e) => { this.editBasin(basin) }}>Edit</button>
                  <button type="button" className="btn btn-danger"
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
      <div style={{ display: "flex", justifyContent: "end" }}>
         <button type="button" className="btn btn-primary"
            onClick={() => { this.toggleAddBasinModal() }}>
              Add Basin
          </button>
      </div>
      {
        this.state.loadingBasins ? <p className="fs-1">Loading Basins...</p> :
        !this.state.basins ? <p className="fs-1">No Basin Found</p> :
        this.getBody()
      }
      {
        this.state.showAddBasinModal && <AddBasinModal
          showModal={this.state.showAddBasinModal}
          onDismiss={this.toggleAddBasinModal}
          onSave={() => {this.setState({savedBasin: true})}}
        />
      }
    </>;
  }
}

export default Basins;
