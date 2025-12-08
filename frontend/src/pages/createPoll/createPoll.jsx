import React, { useState } from 'react';
import { BarChart3, Plus, Trash2, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
// import '../../styles/create_poll.css';
const CreatePollPage = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [missingoptions, setmissingoptions] = useState([false, false]);
  const [showSettings, setShowSettings] = useState(false);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [hasExpiration, setHasExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');
  const [missingQuestion, setMissingQuestion] = useState(false);
  const [focused, setFocused] = useState(false);
  const [focuedoptions, setFocusedoptions] = useState([false, false]);
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
const navigate = useNavigate();
  const handleSubmit = async () => {
  
  if (question.trim() === '') {
    setMissingQuestion(true);
    setmissingoptions(options.map(opt => opt.trim() === ''));
    Swal.fire({
      icon: "error",
      title: "Missing Question",
      text: "Please enter a poll question"
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

  const pollData = {
    question,
    options: filledOptions,
    allowMultipleVotes,
    expirationDate: hasExpiration ? expirationDate : null
  };
  console.log('Poll Created:', pollData);
  navigate('/configure-poll', { state: { pollData } });

  
//   try {
//     const response = await fetch("http://localhost:5000/api/polls", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(pollData)
//     });

//     if (!response.ok) {
//       throw new Error("Failed to create poll");
//     }

//     Swal.fire({
//       icon: "success",
//       title: "Poll Created!",
//       text: "Your poll was created successfully."
//     });

//   } catch (err) {
//     Swal.fire({
//       icon: "error",
//       title: "Error",
//       text: "Something went wrong. Try again."
//     });
//   }
// };


//     const filledOptions = options.filter(opt => opt.trim() !== '');
//     if (filledOptions.length < 2) {
//         setmissingoptions(options.map(opt => opt.trim() === ''));
//       alert('Please provide at least 2 options');
//       return;
//     }

//     const pollData = {
//       question,
//       options: filledOptions,
//       allowMultipleVotes,
//       expirationDate: hasExpiration ? expirationDate : null
//     };

//     console.log('Poll Created:', pollData);
//     alert('Poll created successfully!');
  };

  const handleCancel = () => {
    setQuestion('');
    setOptions(['', '']);
    setAllowMultipleVotes(false);
    setHasExpiration(false);
    setExpirationDate('');
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
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            maxWidth: '1280px',
            margin: '0 auto'
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
              
              {/* Poll Question */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '1.125rem',
                  fontWeight: '500',
                  color: '#1F2937',
                  marginBottom: '0.5rem'
                }}>
                  Poll Question
                </label>
              <input
                 type="text"
                value={question}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuestion(val);
                
                  if (val.trim() !== "") setMissingQuestion(false);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="What's your question?"
                style={{
                 width: '100%',
                 padding: '0.875rem 1rem',
                 fontSize: '1rem',
                
                 border: missingQuestion
                      ? '1px solid #F87171'
                      : focused
                      ? '1px solid #007BFF'
                      : '1px solid #6b7280',
                
                    boxShadow: missingQuestion
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

                {missingQuestion && (<div style={{color: '#dc2626', 
                                                 fontsize: '0.875rem', 
                                                 margintop: '0.25rem', /* 4px spacing under input */
                                                 fontweight: 500 }}>
                                             Please enter a poll question </div>)}
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
                        onChange={(e) => {handleOptionChange(index, e.target.value);
                            if(e.target.value.trim() !== ''){ setmissingoptions(prev => {
                                const newMissing = [...prev];
                                newMissing[index] = false;
                                return newMissing;
                              });}
                        }}
                        placeholder="Enter an answer option"
                        style={{
                          flex: 1,
                          padding: '0.875rem 1rem',
                          fontSize: '1rem',
                          borderRadius: '8px',
                          backgroundColor: '#F9FAFB',
                          color: '#1F2937',
                          outline: 'none',
                          border: missingoptions[index] ?"1px solid #F87171" : focuedoptions[index]? '1px solid #007BFF' :'1px solid #6b7280' ,
                          boxShadow: missingoptions[index] ? "0 0 0 3px rgba(239, 68, 68, 0.1)": focuedoptions[index]? '0 0 0 3px rgba(0, 123, 255, 0.1)' : "none",
                          boxSizing: 'border-box',
                          transition: 'all 0.2s'
                        }}
                        onFocus={(e) => {
                            if(options[index].trim() !== ''){ setmissingoptions(prev => {
                              const newMissing = [...prev];
                              newMissing[index] = false;
                              return newMissing;
                            });}
                            setFocusedoptions(prev => {
                              const newFocused = [...prev];
                              newFocused[index] = true;
                              return newFocused;
                            });
                         
                          
                        }}
                        onBlur={(e) => {
                          setFocusedoptions(prev => {
                            const newFocused = [...prev];
                            newFocused[index] = false;
                            return newFocused;
                          });
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
                  {/* {&& (<div className='Error-message'> Please enter at least 2 potions.</div>)} */}
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

              {/* Poll Settings */}
              {/* <div style={{
                borderTop: '1px solid #E5E7EB',
                paddingTop: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    color: '#1F2937',
                    cursor: 'pointer',
                    padding: '0.5rem 0',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#1F2937';
                  }}
                >
                  <span>Poll Settings</span>
                  <ChevronDown 
                    size={20}
                    style={{
                      transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>

                {showSettings && (
                  <div style={{
                    marginTop: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={allowMultipleVotes}
                        onChange={(e) => setAllowMultipleVotes(e.target.checked)}
                        style={{
                          width: '1.25rem',
                          height: '1.25rem',
                          cursor: 'pointer',
                          accentColor: '#007BFF'
                        }}
                      />
                      <span style={{ color: '#1F2937' }}>Allow multiple votes</span>
                    </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          checked={hasExpiration}
                          onChange={(e) => setHasExpiration(e.target.checked)}
                          style={{
                            width: '1.25rem',
                            height: '1.25rem',
                            cursor: 'pointer',
                            accentColor: '#007BFF'
                          }}
                        />
                        <span style={{ color: '#1F2937' }}>Set an expiration date</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={expirationDate}
                        onChange={(e) => setExpirationDate(e.target.value)}
                        disabled={!hasExpiration}
                        style={{
                          marginLeft: '2rem',
                          padding: '0.625rem 0.875rem',
                          fontSize: '1rem',
                          border: '1px solid #E5E7EB',
                          borderRadius: '8px',
                          backgroundColor: '#F9FAFB',
                          color: '#1F2937',
                          outline: 'none',
                          maxWidth: '320px',
                          opacity: hasExpiration ? 1 : 0.5,
                          cursor: hasExpiration ? 'text' : 'not-allowed',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div> */}

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
                  Create Poll
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