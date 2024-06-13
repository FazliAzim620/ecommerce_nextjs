import React from "react";

const ImageDisplay = ({ pathurl }) => {
  return (
    <div>
      <img src={pathurl} alt="Image" className="w-12 h-12 object-fill" />
    </div>
  );
};

export default ImageDisplay;
