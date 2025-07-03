import { HandCoins, Settings, UserPen, Users, UsersRound, User, Layers, LayoutDashboard, Bell } from 'lucide-react';
import { Money, Article } from '@phosphor-icons/react';

const iconMap = {
  Users: <Users />,
  UsersRound: <UsersRound />,
  UserPen: <UserPen />,
  User: <User />, // Added for Members
  Layers: <Layers />, // Added for Chapters
  LayoutDashboard: <LayoutDashboard />, // Added for Dashboard
  Settings: <Settings />,
  HandCoins: <HandCoins />,
  Money: <Money size={32} />,
  Article: <Article size={32} />,
  Notifications: <Bell />,
};

export default iconMap;
