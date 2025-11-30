// ===== MainContent/MainContent.jsx - UPDATED (Only ClassNames Changed) =====
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MainContent = ({ activeTab }) => {
  const { state } = useLocation();
  const pollData = state?.pollData || { options: [] }; // Fallback to avoid crash
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    anonymity: "fully-anonymous",
    visibility: "public",
    startDate: "",
    closeDate: "",
    enableComments: true,
    showResults: false,
    allowedVoters: [], // Stores emails
    allowedDomains: [], // Stores domains like @gmail.com
    minSelectionLimit: 1,
    selectionLimit: pollData['options'].length,
    ismultiplechoices : false,
    selectedTheme: "corporate",
    backgroundImage: "",
    logo: "",
    fontStyle: "inter",
    primaryColor: "#137fec",
    secondaryColor: "#ffffff",
  });

  // --- EMAIL STATE ---
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(false); // Controls the red border

  // --- DOMAIN STATE ---
  const [newDomain, setNewDomain] = useState("");

  // 1. Handle Email Input
  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
    if (emailError) setEmailError(false); // Clear error when user types
  };

  // 2. Add Email with Validation
  const handleAddEmail = () => {
    if (!newEmail.trim()) return;

    if (!isValidEmail(newEmail)) {
      setEmailError(true); // Trigger red border
      return;
    }

    // Check duplicates
    if (!formData.allowedVoters.includes(newEmail)) {
      setFormData(prev => ({
        ...prev,
        allowedVoters: [...prev.allowedVoters, newEmail]
      }));
    }
    setNewEmail("");
    setEmailError(false);
  };

  // 3. Remove Email
  const removeEmail = (emailToRemove) => {
    setFormData(prev => ({
      ...prev,
      allowedVoters: prev.allowedVoters.filter(email => email !== emailToRemove)
    }));
  };

  // 4. Add Domain
  const handleAddDomain = () => {
    let domain = newDomain.trim();
    if (!domain) return;

    // Ensure it starts with @
    if (!domain.startsWith("@")) {
      domain = "@" + domain;
    }

    if (!formData.allowedDomains.includes(domain)) {
      setFormData(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, domain]
      }));
    }
    setNewDomain("");
  };

  // 5. Remove Domain
  const removeDomain = (domainToRemove) => {
    setFormData(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domainToRemove)
    }));
  };

  // Regex Helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  // ADD THIS THEMES ARRAY HERE
  const themes = [
    {
      id: "corporate",
      name: "Corporate",
      image: "🏢",
      description: "Professional and clean design for business polls"
    },
    {
      id: "modern",
      name: "Modern",
      image: "✨",
      description: "Sleek and contemporary style"
    },
    {
      id: "colorful",
      name: "Colorful",
      image: "🎨",
      description: "Vibrant and eye-catching design"
    },
    {
      id: "minimal",
      name: "Minimal",
      image: "⚪",
      description: "Simple and distraction-free"
    },
    {
      id: "dark",
      name: "Dark Mode",
      image: "🌙",
      description: "Easy on the eyes with dark theme"
    },
    {
      id: "nature",
      name: "Nature",
      image: "🌿",
      description: "Earthy tones and natural feel"
    }
  ];

    const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    handlePreview(); 
    console.log("Saving configuration:", formData);
    alert("Configuration saved successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this poll?")) return;
  };

// handle the preview function
   const handlePreview = () => {
    // Combine the Questions (pollData) with the Settings (formData)
    const finalPollData = {
      ...pollData, // Contains title, questions, options from previous page
      ...formData, // Contains the rules, theme, colors you just set
    };

    console.log("Sending to preview:", finalPollData);

    // Navigate to the preview route and pass the data
    navigate("/poll/:pollId", { state: { pollData: finalPollData } });
  };


  return (
    
    <main className="config-main-content">
      <div className="config-header-section">
        <div className="config-header-text">
          <h1>Poll Configurations</h1>
          <p>Customize your poll settings</p>
        </div>
        <button className="config-save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

{/* GENERAL TAB */}
      {activeTab === "General" && (
        <>
          {/* Anonymity */}
          <div className="config-section-card">
            <h2>Anonymity</h2>
            <div className="config-section-content">
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="anonymity"
                  value="fully-anonymous"
                  checked={formData.anonymity === "fully-anonymous"}
                  onChange={(e) => handleChange("anonymity", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Fully Anonymous</h3>
                  <p>Voters' identities will be hidden.</p>
                </div>
              </label>
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="anonymity"
                  value="show-names"
                  checked={formData.anonymity === "show-names"}
                  onChange={(e) => handleChange("anonymity", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Show Voter Names</h3>
                  <p>Voters' names will be visible to everyone.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Visibility */}
          <div className="config-section-card">
            <h2>Visibility</h2>
            <div className="config-section-content">
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === "public"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Public</h3>
                  <p>Anyone with the link can view and vote.</p>
                </div>
              </label>

              <label className="config-radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === "private"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Private</h3>
                  <p>Only people with the password or on the allowed list can access.</p>
                </div>
              </label>

              {/* {formData.visibility === "private" && (
                <div className="password-input-container">
                  <label className="config-form-label">Password</label>
                  <input
                    type="password"
                    className="config-form-input"
                    placeholder="Enter a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
              )} */}
            </div>
          </div>

          {/* === ALLOWED VOTERS (TABLE VERSION) === */}
          {formData.visibility === "private" && (
            <div className="config-section-card">
              <h2>Allowed Access</h2>
              <div className="config-section-content">
                
                {/* 1. Email Input */}
                <label className="config-form-label">Add Allowed Email</label>
                <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                  <input
                    type="text"
                    className="config-form-input"
                    placeholder="user@example.com"
                    style={{ 
                      flex: 1, 
                      borderColor: emailError ? "#ef4444" : "",
                      backgroundColor: emailError ? "#fef2f2" : "" 
                    }}
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      if(emailError) setEmailError(false);
                    }}
                  />
                  <button onClick={handleAddEmail} className="config-btn config-btn-small"  style={{
            padding: "0.625rem 1rem",
            backgroundColor: "#e5e7eb",
            color: "#111827",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}>
                    Add
                  </button>
                </div>
                {emailError && <p style={{ color: "#ef4444", fontSize: "0.8rem" }}>⚠️ Invalid email format</p>}

                {/* 2. THE EMAIL TABLE */}
                {formData.allowedVoters.length > 0 && (
                  <div style={{ marginTop: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <tr>
                          <th style={{ padding: "10px 15px", textAlign: "left", color: "#374151" }}>Email Address</th>
                          <th style={{ padding: "10px 15px", textAlign: "right", color: "#374151", width: "80px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.allowedVoters.map((email, index) => (
                          <tr key={index} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ padding: "10px 15px" }}>{email}</td>
                            <td style={{ padding: "10px 15px", textAlign: "right" }}>
                              <button 
                                onClick={() => removeEmail(email)}
                                style={{ 
                                  backgroundColor: "#fee2e2", 
                                  color: "#dc2626", 
                                  border: "none", 
                                  borderRadius: "4px", 
                                  padding: "4px 8px", 
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                  fontWeight: "600"
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                         <tfoot style={{ backgroundColor: "#f9fafb", borderTop: "2px solid #e5e7eb" }}>
                        <tr>
                          <td style={{ padding: "10px 15px", fontWeight: "bold", color: "#374151" }}>
                            Total Allowed Voters:
                          </td>
                          <td style={{ padding: "10px 15px", textAlign: "right", fontWeight: "bold", color: "#137fec" }}>
                            {formData.allowedVoters.length}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                {formData.allowedVoters.length === 0 && (
                  <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.9rem", marginTop: "0.5rem" }}>No emails added yet.</p>
                )}

                {/* 3. Domain Input (Separate) */}
                <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
                  <label className="config-form-label">Allowed Domains</label>
                  <div style={{ display: "flex", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      className="config-form-input"
                      placeholder="@company.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button onClick={handleAddDomain} className="config-btn config-btn-small"  style={{
            padding: "0.625rem 1rem",
            backgroundColor: "#e5e7eb",
            color: "#111827",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}>
                      Add Domain
                    </button>
                  </div>
                  
                  {/* Domains List (Chips) */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {formData.allowedDomains.map((d, i) => (
                      <span key={i} style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 8px", borderRadius: "4px", fontSize: "0.85rem" }}>
                        {d} <button onClick={() => removeDomain(d)} style={{ border: "none", background: "none", cursor: "pointer", color: "#1e40af", fontWeight: "bold" }}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      )}

      
      {/* VOTING RULES TAB */}
      {activeTab === "Voting Rules" && (
        <div className="config-section-card">
          <h2>Selection Rules</h2>
          <div className="config-section-content">
            
            {/* Single Choice Option */}
            <label className="config-radio-option">
              <input
                type="radio"
                name="votingType"
                // It is single choice if both Min and Max are 1
                checked={formData.selectionLimit === 1 && formData.minSelectionLimit === 1}
                onChange={() => {
                  handleChange("minSelectionLimit", 1);
                  handleChange("selectionLimit", 1);
                  handleChange("ismultiplechoice", false);
                }}
              />
              <div className="config-radio-text">
                <h3>Single Choice</h3>
                <p>Voters can only choose one option.</p>
              </div>
            </label>

            {/* Multiple Choice Option */}
            <label className="config-radio-option">
              <input
                type="radio"
                name="votingType"
                // Checked if Max is greater than 1
                checked={formData.selectionLimit > 1}
                onChange={() => {
                  handleChange("minSelectionLimit", 1);
                  handleChange("selectionLimit", 2);
                  handleChange("ismultiplechoice", true);
                }}
              />
              <div className="config-radio-text">
                <h3>Multiple Choice</h3>
                <p>Voters can choose more than one option.</p>
              </div>
            </label>

            {/* Inputs for Minimum and Maximum - Only show for Multiple Choice */}
            {1 == 0 && (
              <div className="config-form-grid" style={{ marginTop: "1.5rem", paddingLeft: "2.5rem", borderLeft: "3px solid #e5e7eb" }}>
                
                {/* MINIMUM INPUT */}
                <div className="config-form-group">
                  <label className="config-form-label">Minimum choices required</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number"
                      className="config-form-input"
                      style={{ width: "120px" }}
                      min="1"
                      max={formData.selectionLimit} // Cannot exceed the Max
                      value={formData.minSelectionLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        // Ensure Min is at least 1 and does not exceed current Max
                        if (val >= 1 && val <= formData.selectionLimit) {
                          handleChange("minSelectionLimit", val);
                        }
                      }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>options</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                    Voters must select at least this many.
                  </p>
                </div>

                {/* MAXIMUM INPUT */}
                <div className="config-form-group">
                  <label className="config-form-label">Maximum choices allowed</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input
                      type="number"
                      className="config-form-input"
                      style={{ width: "120px" }}
                      min={formData.minSelectionLimit} 
                      value={formData.selectionLimit}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (val >= formData.minSelectionLimit && val <= pollData['options'].length) {
                          handleChange("selectionLimit", val);
                        }
                      }}
                    />
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>options</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                    Voters cannot select more than this.
                  </p>
                </div>

              </div>
            )}
            
          </div>
        </div>
      )}

    {/* SCHEDULE TAB */}
      {activeTab === "Schedule" && (
        <div className="config-section-card">
          <h2>Schedule</h2>
          <div className="config-section-content">
            <div className="config-form-grid">
              
              {/* START DATE */}
              <div className="config-form-group">
                <label className="config-form-label">Poll Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="config-form-input"
                  
                  // 1. Allow clicking anywhere to open calendar
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  
                  // 2. Handle Value
                  value={formData.startDate ? formData.startDate.slice(0, 16) : ""}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  
                  // 3. LOGIC: Cannot be in the past, Cannot be > 1 year
                  min={new Date().toISOString().slice(0, 16)} 
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16)}
                />
                <p style={{fontSize: "0.75rem", color: "#6b7280", marginTop: "4px"}}>
                  Limit: 1 year from today
                </p>
              </div>

              {/* CLOSE DATE */}
              <div className="config-form-group">
                <label className="config-form-label">Poll Close Date & Time</label>
                <input
                  type="datetime-local"
                  className="config-form-input"
                  
                  // 1. Allow clicking anywhere to open calendar
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  
                  // 2. Handle Value
                  value={formData.closeDate ? formData.closeDate.slice(0, 16) : ""}
                  onChange={(e) => handleChange("closeDate", e.target.value)}
                  
                  // 3. LOGIC: Must be after Start Date
                  min={formData.startDate ? formData.startDate.slice(0, 16) : new Date().toISOString().slice(0, 16)}
                  
                  // 4. LOGIC: Limit close date (e.g., max 2 years from now)
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().slice(0, 16)}
                />
              </div>

            </div>
          </div>
        </div>
      )}
      {/*  ADVANCED TAB */}
       {activeTab === "Advanced" && (
        <div className="config-section-card">
          <h2>Advanced Options</h2>
          <div className="config-section-content">
            
            {/* Toggle 1: Comments */}
            <div className="config-toggle-container">
              <div className="config-toggle-label">
                <h3>Enable Comments</h3>
                <p>Allow users to leave comments on the poll.</p>
              </div>
              {/* Note: We use a label so clicking anywhere on the switch works */}
              <label className="config-toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.enableComments}
                  // IMPORTANT: Use e.target.checked for checkboxes
                  onChange={(e) => handleChange("enableComments", e.target.checked)}
                />
                <span className="config-toggle-slider"></span>
              </label>
            </div>

            {/* Toggle 2: Results */}
            <div className="config-toggle-container">
              <div className="config-toggle-label">
                <h3>Show Results During Voting</h3>
                <p>Live results will be visible to voters after they have voted.</p>
              </div>
              <label className="config-toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.showResults}
                  onChange={(e) => handleChange("showResults", e.target.checked)}
                />
                <span className="config-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

          {/* THEME SECTION */}
        {activeTab === "Themes" && (
        <>
          {/* THEME GALLERY */}
          <div className="config-section-card">
            <h2>Theme Gallery</h2>
            <div className="config-section-content">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => handleChange("selectedTheme", theme.id)}
                    style={{
                      padding: "1rem",
                      border: formData.selectedTheme === theme.id ? "2px solid #137fec" : "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: formData.selectedTheme === theme.id ? "#f0f7ff" : "#ffffff",
                    }}
                  >
                    <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
                      {theme.image}
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: "#111827" }}>
                      {theme.name}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {theme.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* THEME ADJUSTMENTS */}
<div className="config-section-card">
  <h2>Theme Adjustments</h2>
  <div className="config-section-content">
    
    {/* LOGO UPLOAD */}
    <div className="config-form-group">
      <label className="config-form-label">Company Logo (Optional)</label>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
        Upload your company logo to display on the poll
      </p>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <input
          type="text"
          className="config-form-input"
          placeholder="Enter logo URL or upload new"
          value={formData.logo}
          onChange={(e) => handleChange("logo", e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          style={{
            padding: "0.625rem 1rem",
            backgroundColor: "#e5e7eb",
            color: "#111827",
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          Upload Logo
        </button>
      </div>
      {formData.logo && (
        <div style={{ marginTop: "0.75rem" }}>
          <img src={formData.logo} alt="Logo Preview" style={{ maxWidth: "100px", height: "auto", borderRadius: "0.5rem" }} />
        </div>
      )}
    </div>

              {/* BACKGROUND IMAGE */}
              <div className="config-form-group">
                <label className="config-form-label">Background Image</label>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  Current image URL or upload new
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    className="config-form-input"
                    placeholder="Enter image URL"
                    value={formData.backgroundImage}
                    onChange={(e) => handleChange("backgroundImage", e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    style={{
                      padding: "0.625rem 1rem",
                      backgroundColor: "#e5e7eb",
                      color: "#111827",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      fontWeight: "600",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* FONT STYLE */}
              <div className="config-form-group">
                <label className="config-form-label">Font Style</label>
                <select
                  className="config-form-input"
                  value={formData.fontStyle}
                  onChange={(e) => handleChange("fontStyle", e.target.value)}
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="poppins">Poppins</option>
                  <option value="playfair">Playfair Display</option>
                </select>
              </div>

              {/* PRIMARY COLOR */}
              <div className="config-form-group">
                <label className="config-form-label">Primary Color</label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                />
              </div>

              {/* SECONDARY COLOR */}
              <div className="config-form-group">
                <label className="config-form-label">Secondary Color</label>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                />
              </div>

            </div>
          </div>
        </>
      )}

        

      {/* ACTION BUTTONS */}
      <div className="config-button-group">
        <button className="config-btn config-btn-cancel">Cancel</button>
        <button className="config-btn config-btn-delete" onClick={handleDelete}>
          Delete Poll
        </button>
      </div>
    </main>
  );
};

export default MainContent;