import React from "react";
import "./Spinner.css";

// Define a Spinner component that takes in three props: animationDuration, size, and color
const Spinner = ({ animationDuration, size, color }) => {
  // Render a div with the class "half-circle-spinner"
  return (
    <div
      className="half-circle-spinner"
      style={{
        height: `${size}px`,
        width: `${size}px`,
        alignItems: `center`,
      }}
    >
      {/* Render two nested divs with the classes "circle" and "circle-1" */}
      <div
        className="circle circle-1"
        style={{
          borderWidth: `${size / 10}px`,
          animationDuration: `${animationDuration}ms`,
          borderTopColor: color,
        }}
      />
      {/* Render two nested divs with the classes "circle" and "circle-2" */}
      <div
        className="circle circle-2"
        style={{
          borderWidth: `${size / 10}px`,
          animationDuration: `${animationDuration}ms`,
          borderBottomColor: color,
        }}
      />
    </div>
  );
};

// Set default values for the Spinner component's props
Spinner.defaultProps = {
  animationDuration: 1000,
  size: 50,
  color: "#fff",
};

// Export the Spinner component as the default export of this module
export default Spinner;
