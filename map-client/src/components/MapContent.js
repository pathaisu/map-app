import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet';
import './MapContent.scss';

function MapContent(props) {
  const state = {
    lat: 19.769025,
    lng: 98.949914,
    zoom: 13,
    nodes: [],
  };

  if (props.sensors) state.nodes = props.sensors; 

  const position = [state.lat, state.lng];

  const activeIcon = L.divIcon({
    iconSize: [30, 30],
    className: 'active-custom-icon',
  });

  const inActiveIcon = L.divIcon({
    iconSize: [30, 30],
    className: 'inactive-custom-icon',
  });


  return (
    <div>
      <Map center={position} zoom={state.zoom}>
        <TileLayer
          url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        { 
          state.nodes.map((value, index) => {
            return (
              <Marker
                key={index}
                position={[value.lat, value.lng]}
                icon={ value.active ? activeIcon : inActiveIcon }
              >
              </Marker>
            )
          }) 
        }
      </Map>
    </div>
  );
}

export default MapContent;
