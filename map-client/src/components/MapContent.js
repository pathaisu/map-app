import React, { useState, useEffect } from 'react';
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
  const mapData = {
    // Default lat, lang at Chiang mai
    lat: 19.769025,
    lng: 98.949914,
    zoom: 13,
    nodes: [],
  }

  if (sensors) {
    const gw = sensors.filter(sensor => sensor.id === 0);
    if (gw.length > 0) {
      const { lat, lng } = gw[0];

      mapData.lat = lat;
      mapData.lng = lng
    }

    mapData.nodes = sensors;
  }

  return mapData;
} 

const MapContent = (props) => {
  const { sensors } = props;
  const [mapData] = useState(getMapData(sensors));
  
  return (
    <Map center={[mapData.lat, mapData.lng]} zoom={mapData.zoom}>
      <TileLayer
        url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      { 
        mapData.nodes.map((value, index) => {
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
  );
}

export default MapContent;
