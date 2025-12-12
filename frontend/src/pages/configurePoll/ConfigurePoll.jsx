import { useState } from "react";
import TopBar from "../../components/ConfigurePoll/TopBar";
import TabNavigation from "../../components/ConfigurePoll/TabNavigation";
import MainContent from "../../components/ConfigurePoll/MainContent";
import BottomBar from "../../components/ConfigurePoll/BottomBar";
import "../../styles/ConfigurePoll.css";

const PollConfigurationPage = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [visitedTabs, setVisitedTabs] = useState(["General"]); // Track visited tabs
  
  // Mark a tab as visited
  const markTabAsVisited = (tabName) => {
    if (!visitedTabs.includes(tabName)) {
      setVisitedTabs([...visitedTabs, tabName]);
    }
  };

  return (
    <div className="config-page-container">
      <TopBar />
      
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        visitedTabs={visitedTabs}
      />
      
      <MainContent 
        activeTab={activeTab}
        markTabAsVisited={markTabAsVisited}
      />
      
      <BottomBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitedTabs={visitedTabs}
        markTabAsVisited={markTabAsVisited}
      />
    </div>
  );
};

export default PollConfigurationPage;