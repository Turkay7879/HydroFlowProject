import BasinsRemote from "./Basins/flux/BasinsRemote";
import { Component } from "react";
import AddBasinModal from "./Basins/Actions/AddBasinModal";
import BasinDetailsModal from "./Basins/Actions/BasinDetailsModal";
import WorldMapLeaflet from "../Maps/WorldMapLeaflet/WorldMapLeaflet";

// Define a class called Home that extends the Component class from the React library
export class Home extends Component {
    static displayName = Home.name;

    // Define a constructor that initializes the state of the Home component
    constructor(props) {
        super(props);
        this.state = {
            markers: [],                    // Array of marker objects used to display basins on a map
            basins: [],                     // Array of basin objects retrieved from the server
            models: [],                     // Array of model objects associated with a selected basin
            showBasinDetails: false,        // Boolean indicating whether the BasinDetailsModal should be displayed
            addBasin: false                 // Boolean indicating whether the AddBasinModal should be displayed
        };
    }

    // Define a function that is called when the component is mounted
    componentDidMount() {
        this.getBasinData()
    }

    // Define a function that retrieves basin data from the server and updates the state of the component
    getBasinData = () => {
        BasinsRemote.getAllBasins()
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        let array = [];
                        data.forEach(function (basin) {
                            array.push({
                                basinId: basin.id,
                                geocode: [basin.flowObservationStationLat, basin.flowObservationStationLong]
                            })
                        });
                        this.setState({
                            markers: array,
                            basins: data
                        });
                    });
                }
            });
    }

    // Define a function that retrieves model data for a selected basin from the server and updates the state of the component
    displayModelsInBasins = (basinId) => {
        let session = JSON.parse(window.localStorage.getItem("hydroFlowSession"));
        let userId = 0;
        let sessionId = '';

        if (session != null && session !== undefined) {
            userId = session.sessionUserId;
            sessionId = session.sessionId;
        }

        let payload = {
            SessionId: sessionId,
            UserId: userId,
            BasinId: basinId
        };
        BasinsRemote.findModelsOfBasin(payload).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    this.setState({
                        basin: this.state.basins.find(b => b.id === basinId),
                        models: data.modelList,
                        totalCount: data.totalCount
                    }, () => this.toggleShowBasinDetailModal())
                });
            } else if (response.status === 404) {
                this.setState({
                    basin: this.state.basins.find(b => b.id === basinId),
                    models: [],
                    totalCount: 0
                }, () => this.toggleShowBasinDetailModal())
            }
        });
    }

    // Define a function that toggles the visibility of the BasinDetailsModal
    toggleShowBasinDetailModal = () => {
        this.setState({ showBasinDetails: !this.state.showBasinDetails });
    }

    // Define a function that toggles the visibility of the AddBasinModal
    toggleAddBasinModal = () => {
        this.setState({ addBasin: !this.state.addBasin });
    }

    // Define a function that handles the download of a template file
    handleDownload = () => {
        const fileUrl = process.env.PUBLIC_URL + "/Template_ABCD.xlsx";
        window.open(fileUrl, "_blank");
    }

    // Define a function that renders the Home component
    render() {
        return (
            <>
                {/* Render a section with buttons to add a basin or download a template file */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <div>
                        <span style={{ marginRight: '1rem' }}> Don't see the basin you are looking for? </span>
                        <button type="button" className="btn btn-primary" disabled={window.localStorage.getItem("hydroFlowSession") === null}
                            onClick={this.toggleAddBasinModal}>Add Basin</button>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.handleDownload}
                        >
                            Download Template (xlsx file)
                        </button>
                    </div>
                </div>
                {/* Render a heading */}
                <h1 style={{ textAlign: "center" }}> HydroFlow </h1>
                {/* Render a map with markers forthe basins */}
                {this.state.markers.length > 0 ? WorldMapLeaflet(this.state.markers, this.displayModelsInBasins) : <></>}
                {/* Render the BasinDetailsModal if showBasinDetails is true */}
                {this.state.showBasinDetails && <BasinDetailsModal
                    showModal={this.state.showBasinDetails}
                    onDismiss={this.toggleShowBasinDetailModal}
                    basin={this.state.basin}
                    models={this.state.models}
                    totalCount={this.state.totalCount}
                />
                }
                {/* Render the AddBasinModal if addBasin is true */}
                {
                    this.state.addBasin && <AddBasinModal
                        showModal={this.state.addBasin}
                        onDismiss={(result) => {
                            if (result && typeof (result) === 'boolean' && result === true) {
                                this.toggleAddBasinModal();
                                window.location.reload();
                            } else {
                                this.toggleAddBasinModal();
                            }
                        }}
                    />
                }
            </>
        );
    }
}