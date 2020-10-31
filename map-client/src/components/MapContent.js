import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet';
import './MapContent.scss';

function MapContent(props) {
  const state = {
    // Default lat, lang at Chiang mai
    lat: 19.769025,
    lng: 98.949914,
    zoom: 13,
    nodes: [],
  };

  if (props.sensors) {
    const { sensors } = props;
    const gw = sensors.filter(sensor => sensor.id === 0);

    state.nodes = sensors; 

    if (gw.length > 0) {
      state.lat = gw[0].lat;
      state.lng = gw[0].lng;
    }
  }

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
      <Map center={[state.lat, state.lng]} zoom={state.zoom}>
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
