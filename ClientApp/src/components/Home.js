
import BasinsRemote from "./Basins/flux/BasinsRemote";
import {Component} from "react";
import AddBasinModal from "./Basins/Actions/AddBasinModal";
import BasinDetailsModal from "./Basins/Actions/BasinDetailsModal";
import WorldMapLeaflet from "../Maps/WorldMapLeaflet/WorldMapLeaflet";

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            basins: [],
            models: [],
            showBasinDetails: false,
            addBasin: false
        };
    }

    componentDidMount() {
        this.getBasinData()
    }

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

    toggleShowBasinDetailModal = () => {
        this.setState({ showBasinDetails: !this.state.showBasinDetails });
    }

    toggleAddBasinModal = () => {
        this.setState({ addBasin: !this.state.addBasin });
    }

    handleDownload = () => {
        const fileUrl = process.env.PUBLIC_URL + "/Template_ABCD.xlsx";
        window.open(fileUrl, "_blank");
    }

    render() {
        return (
            <>
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
                <h1 style={{ textAlign: "center" }}> HydroFlow </h1>
                {this.state.markers.length > 0 ? WorldMapLeaflet(this.state.markers, this.displayModelsInBasins) : <></>}
                {this.state.showBasinDetails && <BasinDetailsModal
                    showModal={this.state.showBasinDetails}
                    onDismiss={this.toggleShowBasinDetailModal}
                    basin={this.state.basin}
                    models={this.state.models}
                    totalCount={this.state.totalCount}
                />
                }
                {
                    this.state.addBasin && <AddBasinModal
                        showModal={this.state.addBasin}
                        onDismiss={(result) => {
                            if (result && typeof(result) === 'boolean' && result === true) {
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


