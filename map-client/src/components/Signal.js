import React from 'react';
import './Signal.scss';

const Signal = (props) => {
  const level = Math.floor(props.level);
  const displayLevel = [];

  for (let i = 0; i < 5; i++) {
    displayLevel.push(i < level);
  }

  return (
    <div className="signal">
      { 
        displayLevel.map((value, index) => {
          return (
            value 
              ? <div 
                  key={index}
                  className="signalItem" 
                  style={{ height: `${index * 2}px`, backgroundColor: '#30b455' }}
                ></div> 
              : <div 
                  key={index} 
                  className="signalItem"
                  style={{ height: `${index * 2}px`, backgroundColor: '#C8C8C8' }}
                ></div>
          );
        })
      }
    </div>
  );
}

export default Signal;
