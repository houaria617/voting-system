// ===== MainContent/MainContent.jsx =====
import { useState } from "react";

const MainContent = ({ activeTab }) => {
  const [formData, setFormData] = useState({
    anonymity: "fully-anonymous",
    visibility: "public",
    startDate: "",
    closeDate: "",
    password: "",
    enableComments: true,
    showResults: false,
    selectedTheme: "corporate",
    backgroundImage: "",
    logo: "",  // ADD THIS
    fontStyle: "inter",  // ADD THIS
    primaryColor: "#137fec",  // ADD THIS
    secondaryColor: "#ffffff", 
  });

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
    console.log("Saving configuration:", formData);
    alert("Configuration saved successfully!");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this poll?")) {
      console.log("Poll deleted");
    }
  };

  return (
    <main className="main-content">
      <div className="header-section">
        <div className="header-text">
          <h1>Poll Configurations</h1>
          <p>Customize your poll settings</p>
        </div>
        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      {/* GENERAL TAB */}
      {activeTab === "General" && (
        <>
          {/* ANONYMITY SECTION */}
          <div className="section-card">
            <h2>Anonymity</h2>
            <div className="section-content">
              <label className="radio-option">
                <input
                  type="radio"
                  name="anonymity"
                  value="fully-anonymous"
                  checked={formData.anonymity === "fully-anonymous"}
                  onChange={(e) => handleChange("anonymity", e.target.value)}
                />
                <div className="radio-text">
                  <h3>Fully Anonymous</h3>
                  <p>
                    Voters' identities will be hidden from everyone, including
                    the poll creator.
                  </p>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="anonymity"
                  value="show-names"
                  checked={formData.anonymity === "show-names"}
                  onChange={(e) => handleChange("anonymity", e.target.value)}
                />
                <div className="radio-text">
                  <h3>Show Voter Names</h3>
                  <p>Voters' names will be visible to everyone.</p>
                </div>
              </label>
            </div>
          </div>

          {/* VISIBILITY SECTION */}
          <div className="section-card">
            <h2>Visibility</h2>
            <div className="section-content">
              <label className="radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === "public"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                />
                <div className="radio-text">
                  <h3>Public</h3>
                  <p>Anyone with the link can view and vote.</p>
                </div>
              </label>

              <label className="radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === "private"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                />
                <div className="radio-text">
                  <h3>Private</h3>
                  <p>Only people with the password can access the poll.</p>
                </div>
              </label>

              {formData.visibility === "private" && (
                <div className="password-input-container">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter a password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* VOTING RULES TAB */}
      {activeTab === "Voting Rules" && (
        <div className="section-card">
          <h2>Voting Rules</h2>
          <div className="section-content">
            <p>Voting rules configuration will go here...</p>
          </div>
        </div>
      )}

      {/* SCHEDULE TAB */}
      {activeTab === "Schedule" && (
        <div className="section-card">
          <h2>Schedule</h2>
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Poll Start Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Poll Close Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.closeDate}
                  onChange={(e) => handleChange("closeDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED TAB */}
      {activeTab === "Advanced" && (
        <div className="section-card">
          <h2>Advanced Options</h2>
          <div className="section-content">
            <div className="toggle-container">
              <div className="toggle-label">
                <h3>Enable Comments</h3>
                <p>Allow users to leave comments on the poll.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.enableComments}
                  onChange={(e) =>
                    handleChange("enableComments", e.target.checked)
                  }
                />
                <div className="toggle-slider"></div>
              </label>
            </div>

            <div className="toggle-container">
              <div className="toggle-label">
                <h3>Show Results During Voting</h3>
                <p>Live results will be visible to voters after they have voted.</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={formData.showResults}
                  onChange={(e) =>handleChange("showResults", e.target.checked)
                  }
                />
                <div className="toggle-slider"></div>
              </label>
            </div>
          </div>
        </div>
      )}

          {/* THEME SECTION */}
        {activeTab === "Themes" && (
        <>
          {/* THEME GALLERY */}
          <div className="section-card">
            <h2>Theme Gallery</h2>
            <div className="section-content">
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
<div className="section-card">
  <h2>Theme Adjustments</h2>
  <div className="section-content">
    
    {/* LOGO UPLOAD */}
    <div className="form-group">
      <label className="form-label">Company Logo (Optional)</label>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
        Upload your company logo to display on the poll
      </p>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
        <input
          type="text"
          className="form-input"
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
              <div className="form-group">
                <label className="form-label">Background Image</label>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  Current image URL or upload new
                </p>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input
                    type="text"
                    className="form-input"
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
              <div className="form-group">
                <label className="form-label">Font Style</label>
                <select
                  className="form-input"
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
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                />
              </div>

              {/* SECONDARY COLOR */}
              <div className="form-group">
                <label className="form-label">Secondary Color</label>
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
      <div className="button-group">
        <button className="btn btn-cancel">Cancel</button>
        <button className="btn btn-delete" onClick={handleDelete}>
          Delete Poll
        </button>
      </div>
    </main>
  );
};

export default MainContent;



