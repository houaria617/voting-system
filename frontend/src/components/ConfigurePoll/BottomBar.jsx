import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { navItems } from "../../constants/sidebarItems";

const BottomBar = ({ 
  activeTab, 
  setActiveTab, 
  visitedTabs, 
  markTabAsVisited,
  onSave,           // ← ADD THIS
  isSaving,         // ← ADD THIS (optional, for loading state)
  pollData          // ← ADD THIS
}) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stateData = state?.pollData || {};

  const tabs = navItems.map(item => item.label);
  const currentIndex = tabs.indexOf(activeTab);
  const isFirstTab = currentIndex === 0;
  const isLastTab = currentIndex === tabs.length - 1;

  // Handle Previous/Edit Question
  const handlePrevious = () => {
    if (isFirstTab) {
      // Go back to Create Poll page with data
      Swal.fire({
        title: 'Edit Question?',
        text: "You'll be taken back to edit the poll question and options.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#137fec',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, go back',
        cancelButtonText: 'Stay here'
      }).then((result) => {
        if (result.isConfirmed) {
          console.log("Going back to edit question...");
          navigate('/create-poll', { state: { pollData: stateData } });
        }
      });
    } else {
      // Go to previous tab
      const previousTab = tabs[currentIndex - 1];
      setActiveTab(previousTab);
    }
  };

  // Handle Next
  const handleNext = () => {
    if (isLastTab) {
      // Save & Finish
      handleSaveAndFinish();
    } else {
      // Go to next tab
      const nextTab = tabs[currentIndex + 1];
      markTabAsVisited(nextTab);
      setActiveTab(nextTab);
    }
  };

  // Handle Save & Finish - FIXED
  const handleSaveAndFinish = async () => {
    try {
      // Show loading state
      Swal.fire({
        title: 'Creating Poll...',
        text: 'Please wait while we save your poll.',
        icon: 'info',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Call the onSave function from parent (ConfigurePoll)
      await onSave(); // ✅ CORRECT - onSave is now a prop
      
      // Success message will be shown by onSave in parent
    } catch (err) {
      console.error("Error saving poll:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong. Please try again.'
      });
    }
  };

  // Handle Cancel
  const handleCancel = () => {
    Swal.fire({
      title: 'Discard Changes?',
      text: "All unsaved changes will be lost.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, discard',
      cancelButtonText: 'Keep editing'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard');
      }
    });
  };

  // Handle Delete
  const handleDelete = () => {
    Swal.fire({
      title: 'Delete Poll?',
      text: "This action cannot be undone!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting poll...");
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your poll has been deleted.',
          confirmButtonColor: '#137fec'
        }).then(() => {
          navigate('/dashboard');
        });
      }
    });
  };

  return (
    <div className="config-bottom-bar">
      <div className="config-bottom-bar-container">
        {/* Left Side - Navigation */}
        <div className="config-bottom-left">
          <button 
            className="config-bottom-btn config-btn-previous"
            onClick={handlePrevious}
          >
            {isFirstTab ? (
              <>
                <Edit3 size={18} />
                <span>Edit Question</span>
              </>
            ) : (
              <>
                <ChevronLeft size={18} />
                <span>Previous</span>
              </>
            )}
          </button>

          <button 
            className="config-bottom-btn config-btn-next"
            onClick={handleNext}
            disabled={isSaving}  // ← Disable during save
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
            disabled={isSaving}  // ← Disable during save
          >
            Cancel
          </button>

          <button 
            className="config-bottom-btn config-btn-delete"
            onClick={handleDelete}
            disabled={isSaving}  // ← Disable during save
          >
            Delete Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;