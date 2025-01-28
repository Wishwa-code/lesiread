import React from "react";
import "./dashboard.css";
import Forms from "../Forms/Forms";

const Component1 = () => {
  return (
    <div
      style={{
        
        flexDirection: "column",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div >
        <h1 className="comp-heading">Home</h1>
        <Forms />
      </div>
    </div>
  );
};

export default Component1;
