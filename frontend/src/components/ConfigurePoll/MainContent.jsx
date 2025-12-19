// Keep your existing MainContent component but move it to:
// src/components/ConfigurePoll/MainContent.jsx

// The component remains the same as your original MainContent.jsx from document 2
// Just make sure it's in the correct folder: components/ConfigurePoll/
import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";

// ✅ KEY CHANGE: Add configData and setConfigData as parameters
const MainContent = ({ 
  activeTab, 
  markTabAsVisited,
  configData,      // ← ADD THIS
  setConfigData    // ← ADD THIS
}) => {
  const { state } = useLocation();
  const pollData = state?.pollData || { options: [] };
  const [dateErrors, setDateErrors] = useState({
  startDate: false,
  closeDate: false,
  startBeforeClose: false
});

  // Add validation function
const validateDates = (startDate, closeDate) => {
  const errors = {
    startDate: false,
    closeDate: false,
    startBeforeClose: false
  };

  // Check if dates are empty
  if (!startDate || startDate.trim() === '') {
    errors.startDate = true;
  }

  if (!closeDate || closeDate.trim() === '') {
    errors.closeDate = true;
  }

  // Check if start date is before close date
  if (startDate && closeDate) {
    const start = new Date(startDate);
    const close = new Date(closeDate);
    
    if (start >= close) {
      errors.startBeforeClose = true;
    }
  }

  setDateErrors(errors);
  return !errors.startDate && !errors.closeDate && !errors.startBeforeClose;
};

// Handle date change with validation
const handleDateChange = (field, value) => {
  handleChange(field, value);
  
  // Clear error for this field when user types
  if (field === 'startDate') {
    setDateErrors(prev => ({ ...prev, startDate: false, startBeforeClose: false }));
  } else if (field === 'closeDate') {
    setDateErrors(prev => ({ ...prev, closeDate: false, startBeforeClose: false }));
  }
};

  // ✅ KEY CHANGE: DELETE the formData and setFormData state
  // Remove this entire useState block:
  // const [formData, setFormData] = useState({ ... });
  
  // ✅ KEY CHANGE: Create handleChange function to update parent state
  const handleChange = (field, value) => {
    setConfigData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Keep all other state (these are local, not form data)
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const logoInputRef = useRef(null);
  const bgInputRef = useRef(null);
  const [urlErrors, setUrlErrors] = useState({ logo: false, background: false });
  const [isValidating, setIsValidating] = useState({ logo: false, background: false });

  const triggerFileUpload = (ref) => {
    ref?.current?.click();
  };

  // ✅ KEY CHANGE: Update handleFileChange to use setConfigData instead of setFormData
  const handleFileChange = (e, field) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // ✅ CHANGED: setFormData → setConfigData
        setConfigData(prev => ({ ...prev, [field]: reader.result }));
        setUrlErrors(prev => ({ ...prev, [field === 'logo' ? 'logo' : 'background']: false }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateImageUrl = (url) => {
    if (!url) return Promise.resolve(true);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleUrlBlur = async (field, url) => {
    if (!url) return;
    setIsValidating(prev => ({ ...prev, [field]: true }));
    const isValid = await validateImageUrl(url);
    setIsValidating(prev => ({ ...prev, [field]: false }));
    setUrlErrors(prev => ({ ...prev, [field]: !isValid }));
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
    if (emailError) setEmailError(false);
  };

  // ✅ KEY CHANGE: Update handleAddEmail to use configData and setConfigData
  const handleAddEmail = () => {
    if (!newEmail.trim()) return;
    if (!isValidEmail(newEmail)) {
      setEmailError(true);
      return;
    }
    // ✅ CHANGED: formData → configData, setFormData → setConfigData
    if (!configData.allowedVoters.includes(newEmail)) {
      setConfigData(prev => ({
        ...prev,
        allowedVoters: [...prev.allowedVoters, newEmail]
      }));
    }
    setNewEmail("");
    setEmailError(false);
  };

  // ✅ KEY CHANGE: Update removeEmail to use configData and setConfigData
  const removeEmail = (emailToRemove) => {
    // ✅ CHANGED: formData → configData, setFormData → setConfigData
    setConfigData(prev => ({
      ...prev,
      allowedVoters: prev.allowedVoters.filter(email => email !== emailToRemove)
    }));
  };

  // ✅ KEY CHANGE: Update handleAddDomain to use configData and setConfigData
  const handleAddDomain = () => {
    let domain = newDomain.trim();
    if (!domain) return;
    if (!domain.startsWith("@")) {
      domain = "@" + domain;
    }
    // ✅ CHANGED: formData → configData, setFormData → setConfigData
    if (!configData.allowedDomains.includes(domain)) {
      setConfigData(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, domain]
      }));
    }
    setNewDomain("");
  };

  // ✅ KEY CHANGE: Update removeDomain to use configData and setConfigData
  const removeDomain = (domainToRemove) => {
    // ✅ CHANGED: formData → configData, setFormData → setConfigData
    setConfigData(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domainToRemove)
    }));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
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

  // const handleChange = (field, value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: value,
  //   }));
  // };

  return (
    <main className="config-main-content">
      {/* GENERAL TAB */}
      {activeTab === "General" && (
        <>
          <div className="config-section-card">
            <h2>Anonymity</h2>
            <div className="config-section-content">
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="anonymity"
                  value="fully-anonymous"
                  checked={configData.anonymity === "fully-anonymous"}
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
                  checked={configData.anonymity === "show-names"}
                  onChange={(e) => handleChange("anonymity", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Show Voter Names</h3>
                  <p>Voters' names will be visible to everyone.</p>
                </div>
              </label>
            </div>
          </div>

          <div className="config-section-card">
            <h2>Visibility</h2>
            <div className="config-section-content">
              <label className="config-radio-option">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={configData.visibility === "public"}
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
                  checked={configData.visibility === "private"}
                  onChange={(e) => handleChange("visibility", e.target.value)}
                />
                <div className="config-radio-text">
                  <h3>Private</h3>
                  <p>Only people with the password or on the allowed list can access.</p>
                </div>
              </label>
            </div>
          </div>

          {configData.visibility === "private" && (
            <div className="config-section-card">
              <h2>Allowed Access</h2>
              <div className="config-section-content">
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
                  <button onClick={handleAddEmail} className="config-btn config-btn-small" style={{
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

                {configData.allowedVoters.length > 0 && (
                  <div style={{ marginTop: "1rem", border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                      <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <tr>
                          <th style={{ padding: "10px 15px", textAlign: "left", color: "#374151" }}>Email Address</th>
                          <th style={{ padding: "10px 15px", textAlign: "right", color: "#374151", width: "80px" }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {configData.allowedVoters.map((email, index) => (
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
                            {configData.allowedVoters.length}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                {configData.allowedVoters.length === 0 && (
                  <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.9rem", marginTop: "0.5rem" }}>No emails added yet.</p>
                )}

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
                    <button onClick={handleAddDomain} className="config-btn config-btn-small" style={{
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
                  
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {configData.allowedDomains.map((d, i) => (
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
            <label className="config-radio-option">
              <input
                type="radio"
                name="votingType"
                checked={configData.selectionLimit === 1 && configData.minSelectionLimit === 1}
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

            <label className="config-radio-option">
              <input
                type="radio"
                name="votingType"
                checked={configData.selectionLimit > 1}
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
          </div>
        </div>
      )}

      {activeTab === "Schedule" && (
  <div className="config-section-card">
    <h2>Schedule</h2>
    <p style={{ 
      fontSize: "0.875rem", 
      color: "#6b7280", 
      marginBottom: "1.5rem",
      marginTop: "-0.5rem"
    }}>
      Set when your poll will start and end. Both dates are required.
    </p>

    <div className="config-section-content">
      <div className="config-form-grid">
        {/* START DATE */}
        <div className="config-form-group">
          <label className="config-form-label" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem' 
          }}>
            Poll Start Date & Time
            <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>*</span>
          </label>
          
          <input
            type="datetime-local"
            className="config-form-input"
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            value={configData.startDate ? configData.startDate.slice(0, 16) : ""}
            onChange={(e) => handleDateChange("startDate", e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              if (!value || value.trim() === '') {
                setDateErrors(prev => ({ ...prev, startDate: true }));
              }
            }}
            min={new Date().toISOString().slice(0, 16)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 16)}
            style={{
              borderColor: dateErrors.startDate || dateErrors.startBeforeClose ? '#ef4444' : '',
              backgroundColor: dateErrors.startDate || dateErrors.startBeforeClose ? '#fef2f2' : ''
            }}
            required
          />
          
          {dateErrors.startDate && (
            <p style={{ 
              color: "#ef4444", 
              fontSize: "0.75rem", 
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>⚠️</span>
              <span>Start date is required</span>
            </p>
          )}
          
          {!dateErrors.startDate && (
            <p style={{
              fontSize: "0.75rem", 
              color: "#6b7280", 
              marginTop: "4px"
            }}>
              Maximum: 1 year from today
            </p>
          )}
        </div>

        {/* END DATE */}
        <div className="config-form-group">
          <label className="config-form-label" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem' 
          }}>
            Poll Close Date & Time
            <span style={{ color: '#ef4444', fontSize: '1.2rem' }}>*</span>
          </label>
          
          <input
            type="datetime-local"
            className="config-form-input"
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
            value={configData.closeDate ? configData.closeDate.slice(0, 16) : ""}
            onChange={(e) => handleDateChange("closeDate", e.target.value)}
            onBlur={(e) => {
              const value = e.target.value;
              if (!value || value.trim() === '') {
                setDateErrors(prev => ({ ...prev, closeDate: true }));
              }
            }}
            min={configData.startDate ? configData.startDate.slice(0, 16) : new Date().toISOString().slice(0, 16)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString().slice(0, 16)}
            style={{
              borderColor: dateErrors.closeDate || dateErrors.startBeforeClose ? '#ef4444' : '',
              backgroundColor: dateErrors.closeDate || dateErrors.startBeforeClose ? '#fef2f2' : ''
            }}
            required
          />
          
          {dateErrors.closeDate && (
            <p style={{ 
              color: "#ef4444", 
              fontSize: "0.75rem", 
              marginTop: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}>
              <span>⚠️</span>
              <span>Close date is required</span>
            </p>
          )}
          
          {!dateErrors.closeDate && (
            <p style={{
              fontSize: "0.75rem", 
              color: "#6b7280", 
              marginTop: "4px"
            }}>
              Must be after start date
            </p>
          )}
        </div>
      </div>

      {/* DATE COMPARISON ERROR */}
      {dateErrors.startBeforeClose && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#ef4444", fontSize: "1.25rem" }}>⚠️</span>
          <div>
            <p style={{ 
              color: "#dc2626", 
              fontWeight: "600", 
              fontSize: "0.875rem",
              marginBottom: "0.25rem"
            }}>
              Invalid Date Range
            </p>
            <p style={{ 
              color: "#991b1b", 
              fontSize: "0.8rem",
              margin: 0
            }}>
              The poll start date must be before the close date. Please adjust your dates.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS STATE - Show when both dates are valid */}
      {configData.startDate && 
       configData.closeDate && 
       !dateErrors.startDate && 
       !dateErrors.closeDate && 
       !dateErrors.startBeforeClose && (
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <span style={{ color: "#16a34a", fontSize: "1.25rem" }}>✓</span>
          <p style={{ 
            color: "#15803d", 
            fontSize: "0.875rem",
            margin: 0
          }}>
            Poll schedule configured successfully
          </p>
        </div>
      )}
    </div>
  </div>
)}

      {/* ADVANCED TAB */}
      {activeTab === "Advanced" && (
        <div className="config-section-card">
          <h2>Advanced Options</h2>
          <div className="config-section-content">
            <div className="config-toggle-container">
              <div className="config-toggle-label">
                <h3>Enable Comments</h3>
                <p>Allow users to leave comments on the poll.</p>
              </div>
              <label className="config-toggle-switch">
                <input
                  type="checkbox"
                  checked={configData.enableComments}
                  onChange={(e) => handleChange("enableComments", e.target.checked)}
                />
                <span className="config-toggle-slider"></span>
              </label>
            </div>

            <div className="config-toggle-container">
              <div className="config-toggle-label">
                <h3>Show Results During Voting</h3>
                <p>Live results will be visible to voters after they have voted.</p>
              </div>
              <label className="config-toggle-switch">
                <input
                  type="checkbox"
                  checked={configData.showResults}
                  onChange={(e) => handleChange("showResults", e.target.checked)}
                />
                <span className="config-toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* THEMES TAB */}
      {activeTab === "Themes" && (
        <>
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
                      border: configData.selectedTheme === theme.id ? "2px solid #137fec" : "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      backgroundColor: configData.selectedTheme === theme.id ? "#f0f7ff" : "#ffffff",
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

          <div className="config-section-card">
            <h2>Theme Adjustments</h2>
            <div className="config-section-content">
              <div className="config-form-group">
                <label className="config-form-label">Company Logo (Optional)</label>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  Upload your company logo to display on the poll
                </p>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <input
                      type="text"
                      className="config-form-input"
                      placeholder="Enter logo URL or upload new"
                      value={configData.logo}
                      onChange={(e) => handleChange("logo", e.target.value)}
                      onBlur={(e) => handleUrlBlur('logo', e.target.value)}
                      style={{ 
                        borderColor: urlErrors.logo ? '#ef4444' : '', 
                        backgroundColor: urlErrors.logo ? '#fef2f2' : '' 
                      }}
                    />
                    {urlErrors.logo && <span style={{color: '#ef4444', fontSize: '0.75rem'}}>⚠️ URL does not point to a valid image</span>}
                    {isValidating.logo && <span style={{color: '#6b7280', fontSize: '0.75rem'}}>Validating URL...</span>}
                  </div>
                  
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleFileChange(e, 'logo')}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <button
                    onClick={() => triggerFileUpload(logoInputRef)}
                    className="config-btn"
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
                {configData.logo && !urlErrors.logo && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <img src={configData.logo} alt="Logo Preview" style={{ maxWidth: "100px", height: "auto", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
                  </div>
                )}
              </div>

              <div className="config-form-group">
                <label className="config-form-label">Background Image</label>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                  Current image URL or upload new
                </p>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <input
                      type="text"
                      className="config-form-input"
                      placeholder="Enter image URL"
                      value={configData.backgroundImage}
                      onChange={(e) => handleChange("backgroundImage", e.target.value)}
                      onBlur={(e) => handleUrlBlur('background', e.target.value)}
                      style={{ 
                        borderColor: urlErrors.background ? '#ef4444' : '', 
                        backgroundColor: urlErrors.background ? '#fef2f2' : '' 
                      }}
                    />
                    {urlErrors.background && <span style={{color: '#ef4444', fontSize: '0.75rem'}}>⚠️ URL does not point to a valid image</span>}
                    {isValidating.background && <span style={{color: '#6b7280', fontSize: '0.75rem'}}>Validating URL...</span>}
                  </div>
                  
                  <input
                    type="file"
                    ref={bgInputRef}
                    onChange={(e) => handleFileChange(e, 'backgroundImage')}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  
                  <button
                    onClick={() => triggerFileUpload(bgInputRef)}
                    type="button"
                    className="config-btn"
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
                {configData.backgroundImage && !urlErrors.background && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <img 
                      src={configData.backgroundImage} 
                      alt="Background Preview" 
                      style={{ maxWidth: "200px", height: "auto", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} 
                      onError={() => setUrlErrors(prev => ({...prev, background: true}))}
                    />
                  </div>
                )}
              </div>

              <div className="config-form-group">
                <label className="config-form-label">Font Style</label>
                <select
                  className="config-form-input"
                  value={configData.fontStyle}
                  onChange={(e) => handleChange("fontStyle", e.target.value)}
                >
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="poppins">Poppins</option>
                  <option value="playfair">Playfair Display</option>
                </select>
              </div>

              <div className="config-form-group">
                <label className="config-form-label">Primary Color</label>
                <input
                  type="color"
                  value={configData.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                />
              </div>

              <div className="config-form-group">
                <label className="config-form-label">Secondary Color</label>
                <input
                  type="color"
                  value={configData.secondaryColor}
                  onChange={(e) => handleChange("secondaryColor", e.target.value)}
                  style={{ width: "100%", height: "40px", cursor: "pointer", borderRadius: "0.5rem", border: "1px solid #d1d5db" }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default MainContent;