import React from "react";
import "./WorldMapLeaflet.css";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import {Icon} from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
function WorldMapLeaflet(markersList, onHoverClick) {

    //marker icon image and size values are kept
    const customIcon = new Icon({
        iconUrl:"https://cdn-icons-png.flaticon.com/512/684/684908.png?w=740&t=st=1683761869~exp=1683762469~hmac=9eb836f1b4178d16f3c2e60ac27dc7f660de1b0ebaebfc6f7b9d8ed48f38f4ed",
        iconSize: [38,38]
    });

    return (
        //map starting point and zoom amount
        <MapContainer center={[38.9573415,35.240741]} zoom={5}>
            {/* component that holds the part of the map to be displayed */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* this component clusters markers according to the zoom state of the map */}
            <MarkerClusterGroup>
                {markersList.map((marker) => (
                    <Marker position={marker.geocode} icon={customIcon} eventHandlers={{ click: () => onHoverClick(marker.basinId)}}>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </MapContainer>
    );

}

export default WorldMapLeaflet;