

import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const { pollId } = useParams();
  
  // ✅ UI State
  const [activeTab, setActiveTab] = useState("General");
  const [visitedTabs, setVisitedTabs] = useState(["General"]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Poll Question/Options State - PRIORITY 1: state data, PRIORITY 2: API data
  const [pollDataState, setPollDataState] = useState(
    state?.pollData || { title: '', description: '', options: ['', ''] }
  );

  // ✅ Config State - Default values
  const [configData, setConfigData] = useState({
    anonymity: "fully-anonymous",
    visibility: "public",
    startDate: "",
    closeDate: "",
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

  // ✅ CRITICAL: Load data ONCE on mount
  useEffect(() => {
    console.log('🔄 ConfigurePoll MOUNT - pollId:', pollId, 'state:', state);
    
    const initializeData = async () => {
      // ✅ CASE 1: Landing page edit (state data) - HIGHEST PRIORITY
      if (state?.isEditing && state?.pollData) {
        console.log('✅ PRIORITY 1: Landing page state data');
        setIsEditing(true);
        setPollDataState(state.pollData);
        return;
      }

      // ✅ CASE 2: Direct URL edit (pollId from params)
      if (pollId) {
        console.log('📡 PRIORITY 2: API load (pollId)');
        try {
          setIsEditing(true);
          const result = await pollService.getPoll(pollId);
          
          if (result.success) {
            const existingPoll = result.poll;
            console.log('✅ API data loaded:', existingPoll);
            
            // ✅ EXTRACT OPTIONS CORRECTLY (from your tests)
            const optionsArray = (existingPoll.poll_options || [])
              .map(opt => typeof opt === 'string' ? opt : opt.option_text || opt.text || '')
              .filter(opt => opt && opt.trim());
            
            setPollDataState({
              title: existingPoll.title || existingPoll.question || '',
              description: existingPoll.description || '',
              options: optionsArray.length >= 2 ? optionsArray : ['', '']
            });

            // ✅ Load config data
            setConfigData({
              anonymity: existingPoll.settings?.isAnonymous ? "fully-anonymous" : "show-names",
              visibility: existingPoll.settings?.accessType === 'PUBLIC' ? "public" : "private",
              startDate: existingPoll.schedule?.startDate || existingPoll.start_date || "",
              closeDate: existingPoll.schedule?.closeDate || existingPoll.close_date || "",
              enableComments: existingPoll.settings?.enableComments ?? true,
              showResults: existingPoll.settings?.showResults ?? false,
              allowedVoters: existingPoll.invitedEmails || [],
              allowedDomains: existingPoll.allowedDomains || [],
              selectedTheme: existingPoll.theme?.selectedTheme || "corporate",
              primaryColor: existingPoll.theme?.primaryColor || "#137fec",
              secondaryColor: existingPoll.theme?.secondaryColor || "#ffffff",
              logo: existingPoll.theme?.logo || "",
              backgroundImage: existingPoll.theme?.backgroundImage || "",
              fontStyle: existingPoll.theme?.fontStyle || "inter",
              ismultiplechoice: existingPoll.settings?.allowMultiple || false,
              selectionLimit: existingPoll.settings?.selectionLimit || 1,
              minSelectionLimit: existingPoll.settings?.minSelectionLimit || 1
            });
          }
        } catch (error) {
          console.error('❌ API failed:', error);
          Swal.fire({
            icon: 'error', title: 'Load Failed', text: 'Cannot load poll data',
            confirmButtonColor: '#137fec'
          }).then(() => navigate('/dashboard'));
        }
        return;
      }

      // ✅ CASE 3: Fresh create - do nothing (use defaults)
      console.log('ℹ️ Fresh poll creation - using defaults');
    };

    initializeData();
  }, []); // ✅ EMPTY DEPENDENCIES - runs ONCE

  const markTabAsVisited = (tabName) => {
    if (!visitedTabs.includes(tabName)) {
      setVisitedTabs([...visitedTabs, tabName]);
    }
  };

   const savePoll = async () => {
    console.log('💾 Saving poll...');
    console.log('📋 Current pollData:', pollDataState);
    console.log('⚙️ Current configData:', configData);
    console.log('🔧 isEditing:', isEditing);

    // ✅ Validate poll title
    if (!pollDataState.title || pollDataState.title.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Poll Question',
        text: 'Please enter a poll question.',
        confirmButtonColor: '#137fec'
      });
      setActiveTab('General');
      return;
    }

    // ✅ Validate options
    const validOptions = pollDataState.options.filter(opt => opt && opt.trim() !== '');
    if (validOptions.length < 2) {
      Swal.fire({
        icon: 'error',
        title: 'Not Enough Options',
        text: 'Please add at least 2 poll options.',
        confirmButtonColor: '#137fec'
      });
      setActiveTab('General');
      return;
    }

    // ✅ Validate start date
    if (!configData.startDate || configData.startDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Start Date',
        text: 'Please set a start date for your poll in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      if (!visitedTabs.includes('Schedule')) {
        setVisitedTabs([...visitedTabs, 'Schedule']);
      }
      setActiveTab('Schedule');
      return;
    }

    // ✅ Validate close date
    if (!configData.closeDate || configData.closeDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Close Date',
        text: 'Please set a close date for your poll in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      if (!visitedTabs.includes('Schedule')) {
        setVisitedTabs([...visitedTabs, 'Schedule']);
      }
      setActiveTab('Schedule');
      return;
    }

    // ✅ Validate date logic
    const startDate = new Date(configData.startDate);
    const closeDate = new Date(configData.closeDate);

    if (startDate >= closeDate) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date Range',
        text: 'The start date must be before the close date.',
        confirmButtonColor: '#137fec'
      });
      setActiveTab('Schedule');
      return;
    }

    setIsSaving(true);

    try {
      // Show loading
      Swal.fire({
        title: isEditing ? 'Updating Poll...' : 'Creating Poll...',
        text: 'Please wait...',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let result;
      
      // ✅ UPDATE existing poll
      if (isEditing && (pollId || editPollIdFromState)) {
        console.log('🔄 Updating existing poll:', pollId || editPollIdFromState);
        
        result = await pollService.updatePoll(pollId || editPollIdFromState, {
          title: pollDataState.title,
          description: pollDataState.description,
          options: validOptions,
          theme: {
            primaryColor: configData.primaryColor,
            secondaryColor: configData.secondaryColor,
            selectedTheme: configData.selectedTheme,
            logo: configData.logo,
            backgroundImage: configData.backgroundImage,
            fontStyle: configData.fontStyle
          },
          settings: {
            isAnonymous: configData.anonymity === 'fully-anonymous',
            visibility: configData.showResults ? 'ALWAYS' : 'AFTER_VOTE',
            accessType: configData.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
            allowMultiple: configData.ismultiplechoice,
            selectionLimit: configData.selectionLimit,
            minSelectionLimit: configData.minSelectionLimit,
            enableComments: configData.enableComments,
            showResults: configData.showResults
          },
          schedule: {
            startDate: configData.startDate,
            closeDate: configData.closeDate
          },
          invitedEmails: configData.visibility === 'private' ? configData.allowedVoters : [],
          allowedDomains: configData.visibility === 'private' ? configData.allowedDomains : []
        });
      } 
      // ✅ CREATE new poll
      else {
        console.log('➕ Creating new poll');
        result = await pollService.createPoll(pollDataState, configData);
      }

      if (result.success) {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: isEditing ? 'Poll Updated!' : 'Poll Created!',
          text: result.message,
          confirmButtonColor: '#137fec'
        }).then(() => {
          navigate(`/poll/${result.poll.id}`, {
            state: { poll: result.poll }
          });
        });
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      console.error("❌ Error saving poll:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#137fec'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="config-page-container">
      <TopBar pollData={pollDataState} isEditing={isEditing} />
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
        pollData={pollDataState}
        setPollData={setPollDataState}
        isEditing={isEditing}
      />
      <BottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitedTabs={visitedTabs}
        markTabAsVisited={markTabAsVisited}
        onSave={savePoll}
        isSaving={isSaving}
        pollData={pollDataState}
        isEditing={isEditing}
      />
    </div>
  );
};

export default ConfigurePollPage;