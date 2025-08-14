import React from "react";
import '../App.css';
import { Bell, User as UserIcon, Menu } from "lucide-react";

type Props = {
  appName?: string;
  notifCount?: number;
  userName: string;
  userRole: string;
  avatarUrl?: string;
  onMenuClick?: () => void;
  showHamburger?: boolean;
};

const TopHeader: React.FC<Props> = ({
  appName = "Sports Club",
  notifCount = 3,
  userName,
  userRole,
  avatarUrl,
  onMenuClick,
  showHamburger = false,
}) => {
  return (
    <header className="top-header">
      <div className="top-header__left">
        {showHamburger && (
          <button 
            className="hamburger-menu-btn" 
            onClick={onMenuClick}
            aria-label="Toggle navigation menu"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="top-header__brand">
          <div className="top-header__logo">S</div>
          <div className="top-header__title">{appName}</div>
        </div>
      </div>

      <div className="top-header__right">
        {/* Notifications */}
        <button className="notif-btn" aria-label={`Notifications (${notifCount} unread)`}>
          <Bell size={20} />
          {notifCount ? <span className="notif-dot" aria-hidden /> : null}
        </button>

        {/* User */}
        <div className="user-chip">
          <div className="user-meta">
            <p className="user-meta__name">{userName}</p>
            <p className="user-meta__role">{userRole}</p>
          </div>
          <button className="avatar-btn" aria-label="User profile menu">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="avatar-img" />
            ) : (
              <UserIcon size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
