import { LayoutDashboard, BarChart3, TrendingUp, Settings } from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'polls', label: 'Polls', icon: BarChart3 },
  { id: 'results', label: 'Results', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const BADGE_VARIANTS = {
  ACTIVE: 'active',
  DRAFT: 'draft',
  CLOSED: 'closed'
};

export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  DANGER: 'danger',
  ICON: 'icon'
};

