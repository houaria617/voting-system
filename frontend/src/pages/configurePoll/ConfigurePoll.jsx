import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TopBar from "../../components/ConfigurePoll/TopBar";
import TabNavigation from "../../components/ConfigurePoll/TabNavigation";
import MainContent from "../../components/ConfigurePoll/MainContent";
import BottomBar from "../../components/ConfigurePoll/BottomBar";
import pollService from "../../services/pollService";
import Swal from "sweetalert2";
import "../../styles/ConfigurePoll.css";

const ConfigurePollPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("General");
  const [visitedTabs, setVisitedTabs] = useState(["General"]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Store configuration data
  const [configData, setConfigData] = useState({
    anonymity: "fully-anonymous",
    visibility: "public",
    startDate: "", // Empty by default
    closeDate: "", // Empty by default
    enableComments: true,
    showResults: false,
    allowedVoters: [],
    allowedDomains: [],
    selectedTheme: "corporate",
    primaryColor: "#137fec",
    secondaryColor: "#ffffff",
    logo: "",
    backgroundImage: "",
    fontStyle: "inter",
    ismultiplechoice: false,
    selectionLimit: 1,
    minSelectionLimit: 1
  });

  const pollData = state?.pollData || {};

  const markTabAsVisited = (tabName) => {
    if (!visitedTabs.includes(tabName)) {
      setVisitedTabs([...visitedTabs, tabName]);
    }
  };

  // Function to save poll (called from BottomBar)
  const savePoll = async () => {
    // ✅ Validate dates before saving
    if (!configData.startDate || configData.startDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Start Date',
        text: 'Please set a start date for your poll in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      
      // Navigate to Schedule tab and mark as visited
      if (!visitedTabs.includes('Schedule')) {
        setVisitedTabs([...visitedTabs, 'Schedule']);
      }
      setActiveTab('Schedule');
      return;
    }

    if (!configData.closeDate || configData.closeDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Close Date',
        text: 'Please set a close date for your poll in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      
      // Navigate to Schedule tab and mark as visited
      if (!visitedTabs.includes('Schedule')) {
        setVisitedTabs([...visitedTabs, 'Schedule']);
      }
      setActiveTab('Schedule');
      return;
    }

    // Validate start date is before close date
    const startDate = new Date(configData.startDate);
    const closeDate = new Date(configData.closeDate);

    if (startDate >= closeDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: 'The start date must be before the close date. Please check the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      
      // Navigate to Schedule tab
      if (!visitedTabs.includes('Schedule')) {
        setVisitedTabs([...visitedTabs, 'Schedule']);
      }
      setActiveTab('Schedule');
      return;
    }

    setIsSaving(true);

    try {
      // Show loading
      Swal.fire({
        title: 'Creating Poll...',
        text: 'Please wait while we save your poll.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Call business logic service
      const result = await pollService.createPoll(pollData, configData);

      if (result.success) {
        // Success
        Swal.fire({
          icon: 'success',
          title: 'Poll Created!',
          text: result.message,
          confirmButtonColor: '#137fec'
        }).then(() => {
          // Navigate to poll page
          navigate(`/poll/${result.poll.id}`);
        });
      } else {
        // Error from service
        Swal.fire({
          icon: 'error',
          title: 'Error Creating Poll',
          text: result.message
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Unexpected Error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="config-page-container">
      <TopBar pollData={pollData} />
      
      {/* ✅ IMPORTANT: Pass configData to TabNavigation */}
      <TabNavigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        visitedTabs={visitedTabs}
        configData={configData}
      />
      
      <MainContent 
        activeTab={activeTab}
        markTabAsVisited={markTabAsVisited}
        configData={configData}
        setConfigData={setConfigData}
        pollData={pollData}
      />
      
      <BottomBar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitedTabs={visitedTabs}
        markTabAsVisited={markTabAsVisited}
        onSave={savePoll}
        isSaving={isSaving}
        pollData={pollData}
      />
    </div>
  );
};

export default ConfigurePollPage;