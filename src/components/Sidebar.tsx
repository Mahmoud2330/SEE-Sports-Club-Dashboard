import React, { useRef, useState } from "react";
import {
  LogOut,
  User,
  Trophy,
  LayoutDashboard,
  Users,
  User as UserIcon,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const cx = (...c: (string | false)[]) => c.filter(Boolean).join(" ");

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, isOpen = false, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expanding, setExpanding] = useState(false); // temp class for fade-in
  const t = useRef<number | null>(null);

  const toggle = () => {
    if (collapsed) {
      // collapsed -> open: add brief expanding state for smooth fade
      setExpanding(true);
      setCollapsed(false);
      if (t.current) window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setExpanding(false), 320);
    } else {
      // open -> collapsed
      setCollapsed(true);
      if (t.current) window.clearTimeout(t.current);
      setExpanding(false);
    }
  };

  return (
    <aside
      className={cx(
        "sidebar shell",
        collapsed && "is-collapsed",
        expanding && "is-expanding",
        isMobile && "is-mobile",
        isMobile && isOpen && "is-mobile-open"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Mobile close button */}
      {isMobile && (
        <button
          className="mobile-close-btn"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          <X size={20} />
        </button>
      )}

      {/* Collapse FAB — sits on the right edge (only on desktop) */}
      {!isMobile && (
        <button
          className="collapse-fab"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          onClick={toggle}
        >
          {collapsed ? (
            <ChevronRight className="chev" size={14} />
          ) : (
            <ChevronLeft className="chev" size={14} />
          )}
        </button>
      )}

      {/* Brand */}
      <div className="brand">
        <div className="brand-row">
          <div className="brand-icon">
            <Trophy size={16} />
          </div>
          <div className="brand-texts">
            <h2 className="brand-title">Sports Club</h2>
            <p className="brand-sub">Management System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav-area">
        <div className="group">
          <div className="group-label">Main</div>

          <NavLink
            to="/dashboard"
            className={({ isActive }) => cx("row", isActive && "row--active")}
            onClick={() => isMobile && onClose?.()}
          >
            <LayoutDashboard className="row-ico" size={18} />
            <div className="row-text">
              <div className="row-title">Dashboard</div>
              <div className="row-sub">Overview and key metrics</div>
            </div>
          </NavLink>

          <NavLink
            to="/teams"
            className={({ isActive }) => cx("row", isActive && "row--active")}
            onClick={() => isMobile && onClose?.()}
          >
            <Users className="row-ico" size={18} />
            <div className="row-text">
              <div className="row-title">Teams</div>
              <div className="row-sub">Manage team rosters</div>
            </div>
            <span className="pill pill--primary">3</span>
          </NavLink>

          <NavLink
            to="/players"
            className={({ isActive }) => cx("row", isActive && "row--active")}
            onClick={() => isMobile && onClose?.()}
          >
            <UserIcon className="row-ico" size={18} />
            <div className="row-text">
              <div className="row-title">Players</div>
              <div className="row-sub">Player profiles and stats</div>
            </div>
            <span className="pill pill--active">67</span>
          </NavLink>
        </div>

        <div className="group pad-top">
          <div className="group-label">System</div>

          <NavLink
            to="/settings"
            className={({ isActive }) => cx("row", isActive && "row--active")}
            onClick={() => isMobile && onClose?.()}
          >
            <Settings className="row-ico" size={18} />
            <div className="row-text">
              <div className="row-title">Settings</div>
              <div className="row-sub">App preferences</div>
            </div>
          </NavLink>

          <NavLink
            to="/help"
            className={({ isActive }) => cx("row", isActive && "row--active")}
            onClick={() => isMobile && onClose?.()}
          >
            <HelpCircle className="row-ico" size={18} />
            <div className="row-text">
              <div className="row-title">Help &amp; Support</div>
              <div className="row-sub">Get assistance</div>
            </div>
          </NavLink>
        </div>
      </nav>

      {/* User + Logout */}
      <div className="user-block">
        <div className="user-card">
          <div className="user-avatar-2">
            <User size={16} />
          </div>
          <div className="user-meta-2">
            <div className="user-name-2">Coach Admin</div>
            <div className="user-mail-2">admin@sportsclub.com</div>
          </div>
        </div>

        <button 
          className="logout-row" 
          aria-label="Log out"
          onClick={() => isMobile && onClose?.()}
        >
          <LogOut className="row-ico" size={18} />
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
