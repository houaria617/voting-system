import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import { navItems } from "../../constants/sidebarItems";
import pollService from "../../services/pollService";

const BottomBar = ({ 
  activeTab, 
  setActiveTab, 
  visitedTabs, 
  markTabAsVisited, 
  onSave, 
  isSaving, 
  pollData,
  configData, // ← ADD THIS
  isEditing,
  pollId 
}) => {
  const navigate = useNavigate();
  
  const tabs = navItems.map(item => item.label);
  const currentIndex = tabs.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;

  // ✅ Save as Draft Function
  const saveDraftPoll = async () => {
    try {
      console.log('💾 [DRAFT] Saving poll as draft...', { pollData, configData });
      
      // ✅ Safety check
      if (!pollData || !configData) {
        throw new Error('Missing poll data or configuration');
      }
      
      const validOptions = (pollData.options || []).filter(opt => opt && opt.trim() !== '');
      
      // Build draft data with safe defaults
      const draftData = {
        title: pollData.title || 'Untitled Poll',
        description: pollData.description || '',
        options: validOptions.length >= 2 ? validOptions : ['Option 1', 'Option 2'],
        theme: {
          primaryColor: configData?.primaryColor || '#137fec',
          secondaryColor: configData?.secondaryColor || '#ffffff',
          selectedTheme: configData?.selectedTheme || 'corporate',
          logo: configData?.logo || '',
          backgroundImage: configData?.backgroundImage || '',
          fontStyle: configData?.fontStyle || 'inter'
        },
        settings: {
          isAnonymous: configData?.anonymity === 'fully-anonymous',
          visibility: configData?.showResults ? 'ALWAYS' : 'AFTER_VOTE',
          accessType: configData?.visibility === 'public' ? 'PUBLIC' : 'PRIVATE',
          allowMultiple: configData?.ismultiplechoice || false,
          enableComments: configData?.enableComments !== undefined ? configData.enableComments : true,
          showResults: configData?.showResults !== undefined ? configData.showResults : false
        },
        schedule: {
          startDate: configData?.startDate || null,
          closeDate: configData?.closeDate || null
        },
        invitedEmails: configData?.visibility === 'private' ? (configData?.allowedVoters || []) : [],
        allowedDomains: configData?.visibility === 'private' ? (configData?.allowedDomains || []) : [],
        status: 'DRAFT'
      };

      let result;

      // EDIT MODE: Update existing poll as draft
      if (isEditing && pollId) {
        console.log('📝 [DRAFT-EDIT] Updating poll as draft');
        result = await pollService.saveDraft(pollId, pollData, configData);
      } 
      // CREATE MODE: Create new poll as draft
      else {
        console.log('➕ [DRAFT-CREATE] Creating new poll as draft');
        result = await pollService.saveDraft(null, pollData, configData);
      }

      return result;
    } catch (error) {
      console.error('❌ [DRAFT] Error saving draft:', error);
      throw error;
    }
  };

  // Handle Previous
  const handlePrevious = () => {
    if (!isFirstTab) {
      const previousTab = tabs[currentIndex - 1];
      setActiveTab(previousTab);
    }
  };

  // Handle Next
  const handleNext = () => {
    if (isLastTab) {
      handleSaveAndFinish();
    } else {
      const nextTab = tabs[currentIndex + 1];
      markTabAsVisited(nextTab);
      setActiveTab(nextTab);
    }
  };

  // Handle Save & Finish
  const handleSaveAndFinish = async () => {
    try {
      Swal.fire({
        title: isEditing ? 'Updating Poll...' : 'Creating Poll...',
        text: 'Please wait while we save your poll.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await onSave();
    } catch (err) {
      console.error("Error saving poll:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#137fec'
      });
    }
  };

  // ✅ Handle Cancel - Save as Draft
  const handleCancel = async () => {
    Swal.fire({
      title: 'Save as Draft?',
      text: "Your poll will be saved as a draft and you can continue editing later.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#137fec',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, save as draft',
      cancelButtonText: 'Continue editing'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Saving Draft...',
            text: 'Please wait...',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          await saveDraftPoll();

          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'Draft Saved!',
            text: 'Your poll has been saved as a draft.',
            confirmButtonColor: '#137fec'
          }).then(() => {
            navigate('/dashboard');
          });
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to save draft',
            confirmButtonColor: '#137fec'
          });
        }
      }
    });
  };

  // ✅ Handle Delete Poll
  const handleDelete = async () => {
    if (!isEditing || !pollId) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Delete',
        text: 'This is a new poll that hasn\'t been created yet.',
        confirmButtonColor: '#137fec'
      });
      return;
    }

    Swal.fire({
      title: 'Delete Poll?',
      html: "This action <strong>cannot be undone</strong>! Are you absolutely sure?",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          Swal.fire({
            title: 'Deleting Poll...',
            text: 'Please wait...',
            icon: 'info',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const deleteResult = await pollService.deletePoll(pollId);

          if (deleteResult.success) {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your poll has been deleted successfully.',
              confirmButtonColor: '#137fec'
            }).then(() => {
              navigate('/dashboard');
            });
          } else {
            throw new Error(deleteResult.message);
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to delete poll',
            confirmButtonColor: '#137fec'
          });
        }
      }
    });
  };

  return (
    <div className="config-bottom-bar">
      <div className="config-bottom-bar-container">
        {/* Left Side - Navigation */}
        <div className="config-bottom-left">
          {/* ✅ ONLY show Previous button (not "Go to Dashboard") */}
          {!isFirstTab && (
            <button 
              className="config-bottom-btn config-btn-previous" 
              onClick={handlePrevious}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
          )}

          <button 
            className="config-bottom-btn config-btn-next" 
            onClick={handleNext}
            disabled={isSaving}
          >
            {isLastTab ? (
              <>
                <span>{isSaving ? 'Saving...' : 'Save & Finish'}</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Right Side - Actions */}
        <div className="config-bottom-right">
          <button 
            className="config-bottom-btn config-btn-cancel" 
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>

          <button 
            className="config-bottom-btn config-btn-delete" 
            onClick={handleDelete}
            disabled={isSaving || !isEditing}
            style={{
              opacity: !isEditing ? 0.5 : 1,
              cursor: !isEditing ? 'not-allowed' : 'pointer'
            }}
          >
            Delete Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;