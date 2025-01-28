import React, { useState } from "react";
import "./dashboard.css";
import Component1 from "./Component1";
import Component2 from "./Component2";
import Component3 from "./Component3";
import Component4 from "./Component4";
import Component5 from "./Component5";
import Landing from "./Landing";
import { useNavigate } from "react-router-dom";

const Content = ({ selectedTab }) => {
  const navigate = useNavigate();

  switch (selectedTab) {
    case 0:
      return <Landing />;
    case 1:
      return <Component1 />;
    case 2:
      return <Component2 />;
    case 3:
      return <Component3 />;
    case 4:
      return <Component4 />;
    case 5:
      return <Component5 />;
    default:
      return null;
  }
};

const Tabs = ({ tabs, selectedTab, onTabChange }) => {
  const icons = ["fa-chart-bar", "fa-search", "fa-map", "fa-sign-out-alt"];

  return (
    <div className="tabs">
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`tab ${selectedTab === index ? "active" : ""}`}
          onClick={() => onTabChange(index)}
        >
          <i className={`fas ${icons[index]}`}></i>&nbsp;{" "}
          {/* Add a space here */}
          {tab}
        </div>
      ))}
    </div>
  );
};

const Dashboard = () => {
  const tabs = ["Landing","PDF Tool", "Summarize|Translate", "Goals", "Progress", "Premium"];
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <div className="dashboard">
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div className="content-container">
        <Content selectedTab={selectedTab} />
      </div>
    </div>
  );
};

export default Dashboard;
