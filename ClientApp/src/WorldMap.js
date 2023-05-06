import React from "react";
import "./WorldMap.css";
import {Tooltip} from "@mui/material";
import{
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    ZoomableGroup
} from "react-simple-maps";

const geoUrl =
    "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json"

function WorldMap(markers, onHoverClick){
    return (
        <div
            className = "WorldMap"
            style = {{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
        }}
        >
            <h1>HydroFlow</h1>
            <div style ={{ width: "1000px", borderStyle: "double"}}>
                <ComposableMap data-tip="">
                  <ZoomableGroup zoom={1}>
                      <Geographies geography={geoUrl}>
                          {({ geographies }) =>
                              geographies.map((geo) => (
                                  <Tooltip title={geo.properties.name} placement={"top"} arrow>
                                      <Geography key={geo.rsmKey} geography={geo}
                                         style={{
                                             default: {
                                                 fill: "#EED",
                                             },
                                             hover: {
                                                 fill: "#F53",
                                                 outline: "none"
                                             },
                                         }}
                                      />
                                  </Tooltip>
                              ))
                          }
                      </Geographies>
                      {
                          markers.map(({markerOffset, name, basinId, coordinates}) => (
                              <Marker key={name} coordinates={coordinates} onClick={() => onHoverClick(basinId)}>
                                  <g
                                      fill="none"
                                      stroke="#FF5533"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      transform="translate(-12, -24)"
                                  >
                                      <circle cx="12" cy="10" r="3" />
                                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                                  </g>
                                  <text textAnchor="middle" y={markerOffset} style={{fontFamily: "system-ui", fill: "#505A6D"}}>
                                      {name}
                                  </text>
                              </Marker>

                          ))
                      }
                  </ZoomableGroup>
                </ComposableMap>
            </div>
        </div>
    );
}

export default WorldMap;
