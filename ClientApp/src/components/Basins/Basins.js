import React from "react";
import BasinsRemote from "./flux/BasinsRemote";
import AddBasinModal from "./Actions/AddBasinModal";
import Swal from "sweetalert2";

class Basins extends React.Component {
  tableColumns = ["Basin Name", "Flow Station No", "Latitude", "Longitude", "Field", "Basin Description", "Actions"];

  constructor(props) {
    super(props);
    this.state = {
      loadingBasins: true,
      basins: null,
      showAddBasinModal: false,
      savedBasin: false,
      selectedBasin: null,
      editingBasin: false
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
          this.setState({ 
            loadingBasins: false, 
            basins: data,
            selectedBasin: null
          });
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ loadingBasins: false });
      });
  }

  toggleAddBasinModal = () => {
    this.setState({
      savedBasin: false,
      showAddBasinModal: !this.state.showAddBasinModal
    });
  }

  toggleEditBasinModal = () => {
    this.setState({editingBasin: !this.state.editingBasin});
  }

  onSaveBasin = () => {
    this.setState({savedBasin: true})
  }

  editBasin = (basin) => {
    this.setState({selectedBasin: basin});
    this.toggleEditBasinModal();
  }

  deleteBasin = (basin) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: `Continue deleting selected basin?`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        BasinsRemote.deleteBasin(basin).then(response => {
          Swal.fire({
            title: "Deleted Basin",
            text: `Deleted ${basin.basinName} successfully!`,
            icon: "success"
          }).then(() => this.refreshData());
        }).catch(err => {
          Swal.fire({
            title: "Error Deleting Basin",
            text: err,
            icon: "error"
          });
        });
      }
    });
    
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
              <td>{basin.Description.length > 40 ? basin.Description.substring(0, 40)+"..." : basin.Description}</td>
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
          onSave={this.onSaveBasin}
        />
      }
      {
        this.state.editingBasin && <AddBasinModal
          showModal={this.state.editingBasin}
          onDismiss={this.toggleEditBasinModal}
          onSave={this.onSaveBasin}
          selectedBasin={this.state.selectedBasin}
        />
      }
    </>;
  }
}

export default Basins;
