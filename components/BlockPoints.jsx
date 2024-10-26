import React from 'react';
import Style from './ChainId/ChainId.module.css';
const BlockPoints = ({ onMouseLeave }) => {
  return (
    <div onMouseLeave={onMouseLeave} className="points-block-menu">
      <h1>My points</h1>
    </div>
  );
};

export default BlockPoints;
