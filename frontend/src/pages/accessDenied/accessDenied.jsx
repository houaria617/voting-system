import React from "react";
import { Lock } from "lucide-react";
import "../../styles/accessDenied.css"; 

export default function AccessDenied() {
  return (
    <div className="ad-container">
      <div className="ad-card">
        <Lock size={90} color="#EA4335" />

        <h1 className="ad-title">Access Denied</h1>

        <p className="ad-message">
          You have already voted and cannot access this poll.
        </p>

        <button className="ad-btn">Back to Home</button>
      </div>
    </div>
  );
}
