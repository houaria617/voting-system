import { Plus, Check, X } from 'lucide-react';

export const pollsData = [
    {
        id: 1,
        title: 'Marketing Campaign Name Poll',
        closingInfo: 'Closes: 2024-10-26',
        votes: 87,
        status: 'Active'
    },
    {
        id: 2,
        title: 'Team Lunch Preference',
        closingInfo: 'Closes: 2024-09-30',
        votes: 15,
        status: 'Active'
    },
    {
        id: 3,
        title: 'Q4 Feature Prioritization',
        closingInfo: 'Ends in 3 days',
        votes: 128,
        status: 'Draft'
    },
    {
        id: 4,
        title: 'New Office Location',
        closingInfo: 'Closed on 2024-08-15',
        votes: 452,
        status: 'Closed'
    }
];

export const statsData = {
    activePolls: 2,
    totalVotes: 682
};

export const activitiesData = [
    {
        icon: Plus,
        iconBg: 'activity-icon-create',
        title: "Poll 'Team Lunch Preference' was created.",
        time: '2 hours ago'
    },
    {
        icon: X,
        iconBg: 'activity-icon-close',
        title: "Poll 'New Office Location' has closed.",
        time: '1 day ago'
    },
    {
        icon: Check,
        iconBg: 'activity-icon-active',
        title: "Poll 'Marketing Campaign...' is now active.",
        time: '3 days ago'
    }
];

