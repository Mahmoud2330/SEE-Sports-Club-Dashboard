import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Globe, 
  Camera, 
  Edit3, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage: string | null;
}

interface NotificationSettings {
  emailNotifications: boolean;
  phoneNotifications: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
}

interface PrivacySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
}

interface LanguageSettings {
  language: 'english' | 'arabic';
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State for different sections
  const [profile, setProfile] = useState<UserProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: null
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    phoneNotifications: false
  });

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'auto'
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showPassword: false
  });

  const [language, setLanguage] = useState<LanguageSettings>({
    language: 'english'
  });

  // File input ref for profile image
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          profileImage: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // Handle profile save logic
    console.log('Profile saved:', profile);
  };

  const handleSavePrivacy = () => {
    if (privacy.newPassword !== privacy.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    // Handle privacy save logic
    console.log('Privacy settings saved:', privacy);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setAppearance(prev => ({ ...prev, theme }));
    // Here you would implement the actual theme change logic
    console.log('Theme changed to:', theme);
  };

  const handleLanguageChange = (lang: 'english' | 'arabic') => {
    setLanguage(prev => ({ ...prev, language: lang }));
    // Here you would implement the actual language change logic
    console.log('Language changed to:', lang);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <h1>Settings</h1>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="settings-breadcrumb">
        <button 
          className="breadcrumb-item"
          onClick={() => scrollToSection('account')}
        >
          Account
        </button>
        <button 
          className="breadcrumb-item"
          onClick={() => scrollToSection('notifications')}
        >
          Notifications
        </button>
        <button 
          className="breadcrumb-item"
          onClick={() => scrollToSection('appearance')}
        >
          Appearance
        </button>
        <button 
          className="breadcrumb-item"
          onClick={() => scrollToSection('privacy')}
        >
          Privacy
        </button>
        <button 
          className="breadcrumb-item"
          onClick={() => scrollToSection('language')}
        >
          Language
        </button>
      </div>

      <div className="settings-content">
        {/* Account Section */}
        <div id="account" className="settings-section">
          <div className="section-header">
            <h2>Account</h2>
            <div className="section-icon">
              <User size={20} />
            </div>
          </div>
          
          <div className="section-content">
            <div className="profile-image-section">
              <div className="profile-image-container">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="profile-image-placeholder">
                    <User size={40} />
                  </div>
                )}
                <button 
                  className="change-image-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={16} />
                  Change
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <button className="save-btn" onClick={handleSaveProfile}>
              <Save size={16} />
              Save 
            </button>
          </div>
        </div>

        {/* Notifications Section */}
        <div id="notifications" className="settings-section">
          <div className="section-header">
            <h2>Notifications</h2>
            <div className="section-icon">
              <Bell size={20} />
            </div>
          </div>
          
          <div className="section-content">
            <div className="toggle-row">
              <div className="toggle-info">
                <h3>Email Notifications</h3>
                <p>Receive notifications via email</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.emailNotifications}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    emailNotifications: e.target.checked 
                  }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-row">
              <div className="toggle-info">
                <h3>Phone Notifications</h3>
                <p>Receive notifications via phone</p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications.phoneNotifications}
                  onChange={(e) => setNotifications(prev => ({ 
                    ...prev, 
                    phoneNotifications: e.target.checked 
                  }))}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div id="appearance" className="settings-section">
          <div className="section-header">
            <h2>Appearance</h2>
            <div className="section-icon">
              <Palette size={20} />
            </div>
          </div>
          
          <div className="section-content">
            <div className="theme-options">
              <h3>Theme</h3>
              <div className="theme-toggles">
                <div className="toggle-row">
                  <div className="toggle-info">
                    <h3>Light Theme</h3>
                    <p>Use light theme</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="radio"
                      name="theme"
                      checked={appearance.theme === 'light'}
                      onChange={() => handleThemeChange('light')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h3>Dark Theme</h3>
                    <p>Use dark theme</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="radio"
                      name="theme"
                      checked={appearance.theme === 'dark'}
                      onChange={() => handleThemeChange('dark')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-row">
                  <div className="toggle-info">
                    <h3>Auto Theme</h3>
                    <p>Follow system preference</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="radio"
                      name="theme"
                      checked={appearance.theme === 'auto'}
                      onChange={() => handleThemeChange('auto')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div id="privacy" className="settings-section">
          <div className="section-header">
            <h2>Privacy & Security</h2>
            <div className="section-icon">
              <Shield size={20} />
            </div>
          </div>
          
          <div className="section-content">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={privacy.currentPassword}
                onChange={(e) => setPrivacy(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input">
                  <input
                    type={privacy.showPassword ? 'text' : 'password'}
                    value={privacy.newPassword}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setPrivacy(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                  >
                    {privacy.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type={privacy.showPassword ? 'text' : 'password'}
                  value={privacy.confirmPassword}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button className="save-btn" onClick={handleSavePrivacy}>
              <Save size={16} />
              Save 
            </button>
          </div>
        </div>

        {/* Language Section */}
        <div id="language" className="settings-section">
          <div className="section-header">
            <h2>Language</h2>
            <div className="section-icon">
              <Globe size={20} />
            </div>
          </div>
          
          <div className="section-content">
            <div className="language-options">
              <h3>Select Language</h3>
              <div className="language-buttons">
                <button
                  className={`language-btn ${language.language === 'english' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('english')}
                >
                  English
                </button>
                <button
                  className={`language-btn ${language.language === 'arabic' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('arabic')}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
