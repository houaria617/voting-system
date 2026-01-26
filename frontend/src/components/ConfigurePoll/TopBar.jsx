import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import Swal from "sweetalert2";

const TopBar = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const pollData = state?.pollData || {};

  const handleBackToDashboard = () => {
    Swal.fire({
      title: 'Save as Draft?',
      text: "Your poll will be saved as a draft. You can continue editing it later.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#137fec',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, save as draft',
      cancelButtonText: 'Stay here'
    }).then((result) => {
      if (result.isConfirmed) {
        // TODO: Save poll as draft to Supabase here
        console.log("Saving poll as draft...", pollData);
        
        Swal.fire({
          icon: 'success',
          title: 'Saved as Draft!',
          text: 'You can continue editing from your dashboard.',
          confirmButtonColor: '#137fec',
          timer: 2000
        }).then(() => {
          navigate('/dashboard');
        });
      }
    });
  };

  return (
    <div className="config-top-bar">
      <div className="config-top-bar-left">
        <div className="config-logo-container">
          <BarChart3 size={28} color="#137fec" />
          <span className="config-logo-text">Pollify</span>
        </div>
        <div className="config-breadcrumb">
          <span className="config-breadcrumb-item">Configure Poll</span>
          <span className="config-breadcrumb-separator">:</span>
          <span className="config-breadcrumb-poll-title">
            {pollData.question || "Untitled Poll"}
          </span>
        </div>
      </div>
      
      <button 
        className="config-dashboard-btn"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default TopBar;