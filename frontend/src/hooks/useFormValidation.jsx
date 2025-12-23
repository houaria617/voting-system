// hooks/useFormValidation.js
import { useState, useEffect } from 'react';

const useFormValidation = (pollData, configData, isEditing) => {
  const [tabErrors, setTabErrors] = useState({
    General: [],
    'Voting Rules': [],
    Schedule: [],
    Advanced: [],
    Themes: []
  });

  // Validate individual fields
  const validateField = (field, value) => {
    switch (field) {
      case 'title':
        if (!value || value.trim() === '') {
          return 'Poll question is required';
        }
        if (value.trim().length < 5) {
          return 'Poll question must be at least 5 characters';
        }
        return null;

      case 'options':
        const validOptions = value.filter(opt => opt && opt.trim() !== '');
        if (validOptions.length < 2) {
          return 'At least 2 poll options are required';
        }
        const emptyOptions = value.filter((opt, idx) => {
          return opt === '' || !opt.trim();
        });
        if (emptyOptions.length > 0 && validOptions.length >= 2) {
          return 'Please remove or fill empty option fields';
        }
        return null;

      case 'startDate':
        if (!value || value.trim() === '') {
          return 'Start date is required';
        }
        return null;

      case 'closeDate':
        if (!value || value.trim() === '') {
          return 'Close date is required';
        }
        if (configData.startDate) {
          const start = new Date(configData.startDate);
          const close = new Date(value);
          if (close <= start) {
            return 'Close date must be after start date';
          }
        }
        return null;

      case 'allowedVoters':
        if (!isEditing && configData.visibility === 'private' && 
            (!value || value.length === 0) && 
            (!configData.allowedDomains || configData.allowedDomains.length === 0)) {
          return 'Private polls require at least one allowed email or domain';
        }
        return null;

      default:
        return null;
    }
  };

  // Validate entire tab
  const validateTab = (tabName) => {
    const tabValidationErrors = [];

    switch (tabName) {
      case 'General':
        // Title validation
        const titleError = validateField('title', pollData?.title);
        if (titleError) tabValidationErrors.push({ field: 'title', message: titleError });

        // Options validation
        const optionsError = validateField('options', pollData?.options || []);
        if (optionsError) tabValidationErrors.push({ field: 'options', message: optionsError });

        // Private access validation (only for new polls)
        if (!isEditing && configData.visibility === 'private') {
          const votersError = validateField('allowedVoters', configData.allowedVoters);
          if (votersError) tabValidationErrors.push({ field: 'allowedVoters', message: votersError });
        }
        break;

      case 'Voting Rules':
        // No required fields
        break;

      case 'Schedule':
        // Start date validation
        const startError = validateField('startDate', configData.startDate);
        if (startError) tabValidationErrors.push({ field: 'startDate', message: startError });

        // Close date validation
        const closeError = validateField('closeDate', configData.closeDate);
        if (closeError) tabValidationErrors.push({ field: 'closeDate', message: closeError });
        break;

      case 'Advanced':
        // No required fields
        break;

      case 'Themes':
        // No required fields
        break;

      default:
        break;
    }

    return tabValidationErrors;
  };

  // Update errors whenever data changes
  useEffect(() => {
    const newTabErrors = {
      General: validateTab('General'),
      'Voting Rules': validateTab('Voting Rules'),
      Schedule: validateTab('Schedule'),
      Advanced: validateTab('Advanced'),
      Themes: validateTab('Themes')
    };

    setTabErrors(newTabErrors);
  }, [pollData, configData, isEditing]);

  // Check if a specific tab is valid
  const isTabValid = (tabName) => {
    return tabErrors[tabName].length === 0;
  };

  // Check if all required tabs are valid
  const isFormValid = () => {
    return (
      tabErrors.General.length === 0 &&
      tabErrors.Schedule.length === 0
    );
  };

  // Get all errors for a specific tab
  const getTabErrors = (tabName) => {
    return tabErrors[tabName] || [];
  };

  return {
    tabErrors,
    isTabValid,
    isFormValid,
    getTabErrors,
    validateField
  };
};

export default useFormValidation;