import React, { useState } from 'react';
import { BarChart3, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const CreatePollPage = () => {
  // ✅ FIXED: Changed 'question' to 'title' to match pollService expectations
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [missingoptions, setmissingoptions] = useState([false, false]);
  const [missingTitle, setMissingTitle] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focusedoptions, setFocusedoptions] = useState([false, false]);
  
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions([...options, '']);
    setmissingoptions([...missingoptions, false]);
    setFocusedoptions([...focusedoptions, false]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      setmissingoptions(missingoptions.filter((_, i) => i !== index));
      setFocusedoptions(focusedoptions.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Clear error when user types
    if (value.trim() !== '') {
      const newMissing = [...missingoptions];
      newMissing[index] = false;
      setmissingoptions(newMissing);
    }
  };

  const handleSubmit = async () => {
    // ✅ FIXED: Validate title (not question)
    if (title.trim() === '') {
      setMissingTitle(true);
      setmissingoptions(options.map(opt => opt.trim() === ''));
      Swal.fire({
        icon: "error",
        title: "Missing Title",
        text: "Please enter a poll title"
      });
      return;
    }

    const filledOptions = options.filter(opt => opt.trim() !== '');
    if (filledOptions.length < 2) {
      setmissingoptions(options.map(opt => opt.trim() === ''));
      Swal.fire({
        icon: "warning",
        title: "Not Enough Options",
        text: "Please provide at least 2 answer options."
      });
      return;
    }

    // ✅ FIXED: Create pollData with 'title' field and include description
    const pollData = {
      title: title,  // ← Changed from 'question'
      description: '', // ← Added description field
      options: filledOptions
    };
    
    console.log('Poll Data:', pollData);
    
    // Navigate to configuration page
    navigate('/configure-poll', { state: { pollData } });
  };

  const handleCancel = () => {
    setTitle('');
    setOptions(['', '']);
    setmissingoptions([false, false]);
    setFocusedoptions([false, false]);
    setMissingTitle(false);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
      `}</style>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F5F7FA',
        overflow: 'auto',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        
        {/* Header */}
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: '#F5F7FA',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#007BFF',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BarChart3 size={24} color="white" />
            </div>

            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827'
            }}>Pollify</span>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              transition: '0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'}
          >
            Dashboard
          </button>
        </div>

        {/* Main Content */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 1rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '768px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}>
            
            {/* Title Section */}
            <div style={{
              textAlign: 'center'
            }}>
              <h1 style={{
                fontSize: '3rem',
                fontWeight: '900',
                color: '#1F2937',
                margin: '0 0 0.5rem 0',
                lineHeight: '1.1'
              }}>
                Create a New Poll
              </h1>
              <p style={{
                fontSize: '1.125rem',
                color: '#6B7280',
                margin: 0
              }}>
                Fill out the details below to create your poll.
              </p>
            </div>

            {/* Form Card */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '2.5rem',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              
              {/* Poll Title */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '0.5rem'
                }}>
                  Poll Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTitle(val);
                    if (val.trim() !== "") setMissingTitle(false);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="What's your poll about?"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: '1rem',
                    border: missingTitle
                      ? '1px solid #F87171'
                      : focused
                      ? '1px solid #007BFF'
                      : '1px solid #6b7280',
                    boxShadow: missingTitle
                      ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
                      : focused
                      ? '0 0 0 3px rgba(0, 123, 255, 0.1)'
                      : 'none',
                    borderRadius: '8px',
                    backgroundColor: '#F9FAFB',
                    color: '#1F2937',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
                {missingTitle && (
                  <div style={{
                    color: '#dc2626', 
                    fontSize: '0.875rem', 
                    marginTop: '0.25rem',
                    fontWeight: 500 
                  }}>
                    Please enter a poll title
                  </div>
                )}
              </div>

              {/* Options */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '0.75rem'
                }}>
                  Options
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {options.map((option, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: '0.5rem',
                      alignItems: 'center'
                    }}>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        style={{
                          flex: 1,
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          borderRadius: '8px',
                          backgroundColor: '#F9FAFB',
                          color: '#1F2937',
                          outline: 'none',
                          border: missingoptions[index] 
                            ? "1px solid #F87171" 
                            : focusedoptions[index]
                            ? '1px solid #007BFF' 
                            : '1px solid #6b7280',
                          boxShadow: missingoptions[index] 
                            ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                            : focusedoptions[index]
                            ? '0 0 0 3px rgba(0, 123, 255, 0.1)' 
                            : "none",
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={() => {
                          if (options[index].trim() !== '') {
                            const newMissing = [...missingoptions];
                            newMissing[index] = false;
                            setmissingoptions(newMissing);
                          }
                          const newFocused = [...focusedoptions];
                          newFocused[index] = true;
                          setFocusedoptions(newFocused);
                        }}
                        onBlur={() => {
                          const newFocused = [...focusedoptions];
                          newFocused[index] = false;
                          setFocusedoptions(newFocused);
                        }}
                      />
                      <button
                        onClick={() => handleRemoveOption(index)}
                        disabled={options.length <= 2}
                        style={{
                          padding: '0.75rem',
                          backgroundColor: 'white',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          cursor: options.length > 2 ? 'pointer' : 'not-allowed',
                          opacity: options.length > 2 ? 1 : 0.4,
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (options.length > 2) {
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                            e.currentTarget.style.borderColor = '#EF4444';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (options.length > 2) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#E5E7EB';
                          }
                        }}
                      >
                        <Trash2 size={20} color={options.length > 2 ? '#9CA3AF' : '#D1D5DB'} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleAddOption}
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#007BFF',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Plus size={20} />
                  <span>Add Option</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                marginTop: '2rem'
              }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    backgroundColor: '#E5E7EB',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    flex: 1,
                    padding: '0.875rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0056B3';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#007BFF';
                  }}
                >
                  Continue to Configuration
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePollPage;