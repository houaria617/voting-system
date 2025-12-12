import { Settings, ClipboardList, Calendar, Zap, Palette } from 'lucide-react';

export const navItems = [
  {
    label: "General",
    icon: <Settings size={20} />  // ⚙️ → Now proper icon
  },
  {
    label: "Voting Rules",
    icon: <ClipboardList size={20} />  // 📋 → Now proper icon
  },
  {
    label: "Schedule",
    icon: <Calendar size={20} />  // 📅 → Now proper icon
  },
  {
    label: "Advanced",
    icon: <Zap size={20} />  // ⚡ → Now proper icon
  },
  {
    label: "Themes",
    icon: <Palette size={20} />  // 🎨 → Now proper icon
  }
];