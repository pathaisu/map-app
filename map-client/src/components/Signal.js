import React from 'react';
import './Signal.scss';

const Signal = (props) => {
  const compareLevel = Math.floor(props.level);
  const displayLevel = [];

  Array.from({ length: 5 }, (_, i) => {
    displayLevel.push(i < compareLevel);
  });

  return (
    <div className="signal">
      { 
        displayLevel.map((value, index) => {
          return (
            <div 
              key={index}
              className="signalItem" 
              style={{ 
                height: `${index * 2}px`, 
                backgroundColor: value ? '#30b455' : '#C8C8C8' 
              }}
            ></div>
          );
        })
      }
    </div>
  );
}

export default Signal;
