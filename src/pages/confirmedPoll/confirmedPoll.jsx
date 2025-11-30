import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import "../../styles/confirmedPoll.css";

export default function VoteRecorded() {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/DashboardPage"); // go to your dashboard route
  };

  return (
    <div className="vr-container">
      <div className="vr-card">
        <CheckCircle size={90} color="#34A853" />

        <h1 className="vr-title">Vote Recorded</h1>

        <p className="vr-message">
          Your vote has been successfully submitted.
        </p>

        <button className="vr-btn" onClick={handleBackToDashboard}>
          Back to Polls
        </button>
      </div>
    </div>
  );
}
