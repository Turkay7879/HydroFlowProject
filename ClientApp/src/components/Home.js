import WorldMap from "../WorldMap";
import BasinsRemote from "./Basins/flux/BasinsRemote";
import {Component} from "react";
import BasinDetailsModal from "./Basins/Actions/BasinDetailsModal";

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            markers: [],
            basins: [],
            models: [],
            showBasinDetails: false
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
                        data.forEach(function(basin) {
                           array.push( {
                               markerOffset: 15,
                               name: basin.basinName,
                               basinId: basin.id,
                               coordinates: [basin.flowObservationStationLong, basin.flowObservationStationLat]
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
        BasinsRemote.findModelsOfBasin(basinId).then(response => {
            response.json().then(modelList => {
                console.log("models found for this basin", modelList);
                this.setState({
                    basin: this.state.basins.find(b => b.id === basinId),
                    models: modelList
                }, () => this.toggleShowBasinDetailModal())
            });
        });
    }

    toggleShowBasinDetailModal = () => {
        this.setState({ showBasinDetails: !this.state.showBasinDetails });
    }

    render() {
        return (
          <>
              { this.state.markers.length > 0 ? WorldMap(this.state.markers, this.displayModelsInBasins) : <></> }
              { this.state.showBasinDetails && <BasinDetailsModal
                showModal={this.state.showBasinDetails}
                onDismiss={this.toggleShowBasinDetailModal}
                basin={this.state.basin}
                models={this.state.models}
              /> }
          </>
        );
    }
}

