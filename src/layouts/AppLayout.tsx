import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopHeader from "../components/TopHeader";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  // Check if we're on mobile or tablet
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileOrTablet(window.innerWidth <= 1023);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="app">
      <TopHeader 
        userName="Abdelrahman Ghareeb" 
        userRole="Administrator" 
        showHamburger={isMobileOrTablet}
        onMenuClick={toggleMobileSidebar}
      />
      <div className="app-content">
        {/* Show sidebar on desktop, or on mobile/tablet when menu is open */}
        {(!isMobileOrTablet || isMobileSidebarOpen) && (
          <Sidebar 
            isMobile={isMobileOrTablet}
            isOpen={isMobileSidebarOpen}
            onClose={closeMobileSidebar}
          />
        )}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay when sidebar is open */}
      {isMobileOrTablet && isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-overlay" 
          onClick={closeMobileSidebar}
          style={{
            left: '280px',
            width: 'calc(100% - 280px)'
          }}
        />
      )}
    </div>
  );
}
