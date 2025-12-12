import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import { navItems } from "../../constants/sidebarItems";

const BottomBar = ({ activeTab, setActiveTab, visitedTabs, markTabAsVisited }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const pollData = state?.pollData || {};

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
          // TODO: Save current config as draft before going back
          console.log("Saving draft before going back...");
          navigate('/create-poll', { state: { pollData } });
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
      // TODO: Auto-save to Supabase as draft here
      console.log("Auto-saving draft...", pollData);
      
      const nextTab = tabs[currentIndex + 1];
      markTabAsVisited(nextTab);
      setActiveTab(nextTab);
    }
  };

  const handlePreview = () => {

    console.log("Sending to preview:", pollData);

    // Navigate to the preview route and pass the data
    navigate("/poll/:pollId", { state: { pollData: pollData } });
  };
  // Handle Save & Finish
  const handleSaveAndFinish = () => {
    handlePreview();
    console.log("Saving configuration:", pollData);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Configuration saved successfully!',
        confirmButtonColor: '#137fec'
      });

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
        // TODO: Delete poll from Supabase
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
          >
            {isLastTab ? (
              <>
                <span>Save & Finish</span>
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
          >
            Cancel
          </button>

          <button 
            className="config-bottom-btn config-btn-delete"
            onClick={handleDelete}
          >
            Delete Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;