import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet';
import './MapContent.scss';

const activeIcon = L.divIcon({
  iconSize: [30, 30],
  className: 'active-custom-icon',
});

const inActiveIcon = L.divIcon({
  iconSize: [30, 30],
  className: 'inactive-custom-icon',
});

const getMapData = (sensors) => {
  // Default lat, lang at Chiang mai
  let lat = 19.769025;
  let lng = 98.949914;

  const gw = sensors[0];

  if (gw) {
    lat = gw.lat;
    lng = gw.lng;
  }

  return {
    lat,
    lng,
    zoom: 13,
    nodes: Object.values(sensors),
  };
} 

const MapContent = (props) => {
  const { sensors, sensorActive } = props;
  const mapData = getMapData(sensors);
  
  return (
    <Map 
      center={[mapData.lat, mapData.lng]}
      zoom={mapData.zoom}
    >
      <TileLayer
        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      { 
        mapData.nodes.map((value, index) => {
          const { lat, lng } = value;
          const active = typeof sensorActive[value.id] === 'undefined' ? true : sensorActive[value.id];
          
          return (
            <Marker
              key={index}
              position={[lat, lng]}
              icon={ active ? activeIcon : inActiveIcon }
            >
            </Marker>
          );
        })
      }
    </Map>
  );
}

export default MapContent;
