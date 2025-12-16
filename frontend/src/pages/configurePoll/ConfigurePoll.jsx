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

  const [activeTab, setActiveTab] = useState("General");
  const [visitedTabs, setVisitedTabs] = useState(["General"]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [pollDataState, setPollDataState] = useState({
    title: '',
    description: '',
    options: ['', '']
  });

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

  const formatDateForInput = (isoString) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error, isoString);
      return "";
    }
  };

  useEffect(() => {
    console.log('🔄 ConfigurePoll MOUNT - pollId:', pollId, 'state:', state);

    const initializeData = async () => {
      try {
        setIsLoading(true);

        // EDIT MODE: Load existing poll
        if (pollId) {
          console.log('✏️ EDIT MODE: Loading poll', pollId);
          setIsEditing(true);

          const result = await pollService.getPoll(pollId);

          if (result.success) {
            const existingPoll = result.poll;
            console.log('✅ Poll loaded for editing:', existingPoll);

            // Extract options
            const optionsArray = (existingPoll.poll_options || [])
              .map(opt => typeof opt === 'string' ? opt : opt.option_text || opt.text || '')
              .filter(opt => opt && opt.trim());

            setPollDataState({
              title: existingPoll.title || '',
              description: existingPoll.description || '',
              options: optionsArray.length >= 2 ? optionsArray : ['', '']
            });

            setConfigData({
              anonymity: existingPoll.is_anonymous ? "fully-anonymous" : "show-names",
              visibility: (existingPoll.theme_settings?.access_type === 'PUBLIC' || existingPoll.access_type === 'PUBLIC') ? "public" : "private",
              startDate: formatDateForInput(existingPoll.start_time),
              closeDate: formatDateForInput(existingPoll.end_time),
              enableComments: existingPoll.theme_settings?.enableComments ?? true,
              showResults: existingPoll.theme_settings?.showResults ?? false,
              allowedVoters: existingPoll.invitedEmails || [],
              allowedDomains: existingPoll.allowedDomains || [],
              selectedTheme: existingPoll.theme_settings?.selectedTheme || "corporate",
              primaryColor: existingPoll.theme_settings?.primaryColor || "#137fec",
              secondaryColor: existingPoll.theme_settings?.secondaryColor || "#ffffff",
              logo: existingPoll.theme_settings?.logo || "",
              backgroundImage: existingPoll.theme_settings?.backgroundImage || "",
              fontStyle: existingPoll.theme_settings?.fontStyle || "inter",
              ismultiplechoice: existingPoll.allow_multiple_choices || false,
              selectionLimit: existingPoll.settings?.selectionLimit || 1,
              minSelectionLimit: existingPoll.settings?.minSelectionLimit || 1
            });

            setIsLoading(false);
            return;
          } else {
            throw new Error('Failed to load poll from API');
          }
        }

        // CREATE MODE: Use state data or defaults
        if (state?.pollData) {
          console.log('➕ CREATE MODE: Using state.pollData');
          setIsEditing(false);
          setPollDataState(state.pollData);
          setIsLoading(false);
          return;
        }

        console.log('ℹ️ Fresh poll creation - using defaults');
        setIsEditing(false);
        setIsLoading(false);

      } catch (error) {
        console.error('❌ Error initializing:', error);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Load Failed',
          text: error.message || 'Cannot load poll data',
          confirmButtonColor: '#137fec'
        }).then(() => navigate('/dashboard'));
      }
    };

    initializeData();
  }, [pollId]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F5F7FA'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', color: '#6B7280' }}>Loading poll configuration...</p>
        </div>
      </div>
    );
  }

  const markTabAsVisited = (tabName) => {
    if (!visitedTabs.includes(tabName)) {
      setVisitedTabs([...visitedTabs, tabName]);
    }
  };

  const savePoll = async () => {
    console.log('💾 Saving poll...');

    // Validate poll title
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

    // Validate options
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

    // Validate dates
    if (!configData.startDate || configData.startDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Start Date',
        text: 'Please set a start date in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      setActiveTab('Schedule');
      return;
    }

    if (!configData.closeDate || configData.closeDate.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Missing Close Date',
        text: 'Please set a close date in the Schedule tab.',
        confirmButtonColor: '#137fec'
      });
      setActiveTab('Schedule');
      return;
    }

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

      // UPDATE MODE
      if (isEditing && pollId) {
        console.log('📝 UPDATING POLL');

        const updateData = {
          title: pollDataState.title,
          description: pollDataState.description,
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
            enableComments: configData.enableComments,
            showResults: configData.showResults
          },
          schedule: {
            startDate: configData.startDate,
            closeDate: configData.closeDate
          },
          status: 'ACTIVE' // Publish when saving
        };

        result = await pollService.updatePoll(pollId, updateData);
      }
      // CREATE MODE
      else {
        console.log('➕ CREATING NEW POLL');
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
        text: err.message || 'Something went wrong.',
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
        configData={configData} // ✅ Make sure this is here
        isEditing={isEditing}
        pollId={pollId}
      />
    </div>
  );
};

export default ConfigurePollPage;