
import { useState } from "react";


import Sidebar from "../../components2/Sidebar/Sidebar";
import MainContent from "../../components2/MainContent/MainContent";
import "./ConfigurePoll.css";

const PollConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="layout-container">
      <div className="main-wrapper">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default PollConfigurationPage;