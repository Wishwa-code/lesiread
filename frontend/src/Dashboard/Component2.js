import React from "react";
import "./dashboard.css";
import Text from "../Text/Text";
const Component2 = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        height:'400px'
      }}
    >
        <h2 className="comp-heading" >Summarize and Translate</h2>
        <h7>Enter Text Below</h7>
        <Text />
    </div>
  );
};

export default Component2;
