import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Video, 
  BookOpen, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './HelpSupportPage.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'To reset your password, go to the login page and click "Forgot Password". Enter your email address and follow the instructions sent to your inbox.',
      category: 'account'
    },
    {
      id: '2',
      question: 'How can I upload a video for analysis?',
      answer: 'Navigate to the Video Analysis section, click "Upload Video", and select your video file. Supported formats include MP4, AVI, and MOV.',
      category: 'features'
    },
    {
      id: '3',
      question: 'What are the system requirements?',
      answer: 'Our platform works best with Chrome, Firefox, Safari, or Edge browsers. For video analysis, we recommend a stable internet connection.',
      category: 'technical'
    },
    {
      id: '4',
      question: 'How do I export my performance reports?',
      answer: 'In the Performance section, click the export button (download icon) next to any report. You can export as PDF or CSV format.',
      category: 'features'
    },
    {
      id: '5',
      question: 'Can I use the platform on mobile devices?',
      answer: 'Yes! Our platform is fully responsive and works on smartphones and tablets. However, some advanced features work best on desktop.',
      category: 'technical'
    },
    {
      id: '6',
      question: 'How do I add team members to my account?',
      answer: 'Go to Settings > Team Management and click "Add Member". Enter their email address and assign appropriate permissions.',
      category: 'account'
    }
  ];

  const helpCategories: HelpCategory[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics and set up your account',
      icon: <BookOpen size={24} />,
      color: '#3B82F6'
    },
    {
      id: 'features',
      title: 'Features Guide',
      description: 'Explore all platform features and capabilities',
      icon: <HelpCircle size={24} />,
      color: '#10B981'
    },
    {
      id: 'account',
      title: 'Account & Billing',
      description: 'Manage your account settings and billing',
      icon: <FileText size={24} />,
      color: '#F59E0B'
    },
    {
      id: 'technical',
      title: 'Technical Support',
      description: 'Troubleshoot technical issues',
      icon: <Video size={24} />,
      color: '#EF4444'
    }
  ];

  const filteredFAQ = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted');
  };

  return (
    <div className="help-support-page">
      {/* Header */}
      <div className="help-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1>Help & Support</h1>
        <p>Find answers to your questions and get the help you need</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Quick Contact */}
      <div className="quick-contact">
        <div className="contact-card">
          <div className="contact-icon">
            <MessageCircle size={24} />
          </div>
          <div className="contact-info">
            <h3>Live Chat</h3>
            <p>Get instant help from our support team</p>
            <button className="contact-btn">Start Chat</button>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <Phone size={24} />
          </div>
          <div className="contact-info">
            <h3>Phone Support</h3>
            <p>Call us at +1 (555) 123-4567</p>
            <p className="hours">Mon-Fri 9AM-6PM EST</p>
          </div>
        </div>

        <div className="contact-card">
          <div className="contact-icon">
            <Mail size={24} />
          </div>
          <div className="contact-info">
            <h3>Email Support</h3>
            <p>Send us a detailed message</p>
            <button className="contact-btn">Send Email</button>
          </div>
        </div>
      </div>

      <div className="help-content">
        {/* Help Categories */}
        <div className="help-categories">
          <h2>Help Categories</h2>
          <div className="categories-grid">
            {helpCategories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  {category.icon}
                </div>
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>
                {selectedCategory === category.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {filteredFAQ.map((faq) => (
              <div key={faq.id} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span>{faq.question}</span>
                  {expandedFAQ === faq.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {expandedFAQ === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-section">
          <h2>Still Need Help?</h2>
          <p>Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.</p>
          
          <form onSubmit={handleContactSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" required placeholder="Enter your first name" />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" required placeholder="Enter your last name" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="Enter your email address" />
            </div>

            <div className="form-group">
              <label>Subject</label>
              <select required>
                <option value="">Select a topic</option>
                <option value="technical">Technical Issue</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows={5}
                required
                placeholder="Describe your issue or question in detail..."
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>

        {/* Additional Resources */}
        <div className="resources-section">
          <h2>Additional Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">
                <BookOpen size={24} />
              </div>
              <h3>User Guide</h3>
              <p>Comprehensive guide to using all features</p>
              <button className="resource-btn">
                Read Guide <ExternalLink size={16} />
              </button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <Video size={24} />
              </div>
              <h3>Video Tutorials</h3>
              <p>Step-by-step video instructions</p>
              <button className="resource-btn">
                Watch Videos <ExternalLink size={16} />
              </button>
            </div>

            <div className="resource-card">
              <div className="resource-icon">
                <FileText size={24} />
              </div>
              <h3>API Documentation</h3>
              <p>Technical documentation for developers</p>
              <button className="resource-btn">
                View Docs <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
