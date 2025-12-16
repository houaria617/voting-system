const themeUtils = {
    applyTheme(themeSettings) {
        return {
            backgroundColor: themeSettings?.backgroundColor || '#f5f5f5',
            primaryColor: themeSettings?.primaryColor || '#3b82f6',
            textColor: themeSettings?.textColor || '#1f2937',
            fontFamily: themeSettings?.fontFamily || 'system-ui, -apple-system, sans-serif',
            cardBackground: themeSettings?.cardBackground || '#ffffff',
            optionBackground: themeSettings?.optionBackground || '#f9fafb',
            optionHoverBackground: themeSettings?.optionHoverBackground || '#e5e7eb'
        };
    },

    getPercentage(voteCount, totalVotes) {
        if (totalVotes === 0) return 0;
        return Math.round((voteCount / totalVotes) * 100);
    }
};

export default themeUtils;