import React from 'react';
import './Battery.scss';

function Battery(props) {
  return (
    <div className="battery">
      <div className="battery-level" style={{ height: `${props.power}%` }}></div>
    </div>
  );
}

export default Battery;
