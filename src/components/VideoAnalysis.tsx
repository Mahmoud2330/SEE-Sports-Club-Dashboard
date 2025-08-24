import React from 'react';
import { Play, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VideoItem {
  title: string;
  duration: string;
  thumbnail?: string;
  category: 'physical' | 'skills';
  videoId: string;
}

const physicalTests: VideoItem[] = [
  { title: 'Vertical Jump', duration: '0:52', category: 'physical', videoId: 'vertical-jump' },
  { title: 'Broad Jump', duration: '0:45', category: 'physical', videoId: 'broad-jump' },
  { title: '10 Meter Run', duration: '0:38', category: 'physical', videoId: '10-meter-run' },
  { title: 'Five Ten Five', duration: '1:12', category: 'physical', videoId: '5-10-5' },
  { title: 'T-Agility', duration: '', category: 'physical', videoId: 't-agility' },
];

const skillsAssessment: VideoItem[] = [
  { title: 'Ball Control', duration: '1:18', category: 'skills', videoId: 'ball-control' },
  { title: 'Passing Accuracy', duration: '1:56', category: 'skills', videoId: 'passing-accuracy' },
  { title: '1v1', duration: '1:34', category: 'skills', videoId: '1v1' },
  { title: 'Running with Ball', duration: '1:43', category: 'skills', videoId: 'running-with-ball' },
  { title: 'Shooting', duration: '', category: 'skills', videoId: 'shooting' },
];

const VideoCard: React.FC<{ video: VideoItem; sectionType: 'physical' | 'skills' }> = ({ video, sectionType }) => {
  const navigate = useNavigate();

  const handleVideoClick = () => {
    // Pass video information through URL parameters
    const params = new URLSearchParams({
      category: video.category,
      title: video.title,
      videoId: video.videoId
    });
    navigate(`/video/${video.videoId}?${params.toString()}`);
  };

  return (
    <div className="video-card" onClick={handleVideoClick}>
      <div className="video-thumbnail">
        <div className="play-button">
          <Play size={16} />
        </div>
        {video.duration && (
          <div className="video-duration">{video.duration}</div>
        )}
      </div>
      <div className="video-title-container">
        <p className="video-title-text">{video.title}</p>
        <div className={`video-title-underline ${sectionType === 'physical' ? 'physical-underline' : 'skills-underline'}`}></div>
      </div>
    </div>
  );
};

const VideoSection: React.FC<{ 
  title: string; 
  videos: VideoItem[]; 
  sectionType: 'physical' | 'skills';
}> = ({ title, videos, sectionType }) => {
  return (
    <div className="video-section">
      <div className="section-title-container">
        <h3 className="section-video-title">{title}</h3>
        <div className={`section-title-dash ${sectionType === 'physical' ? 'physical-dash' : 'skills-dash'}`}></div>
      </div>
      <div className="video-grid">
        {videos.map((video, index) => (
          <VideoCard key={index} video={video} sectionType={sectionType} />
        ))}
      </div>
    </div>
  );
};

const VideoAnalysis: React.FC = () => {
  return (
    <div className="video-analysis">
      <div className="video-header">
        <h2>Video Analysis</h2>
        <div className="video-subheader">
          <span>Performance Videos</span>
          <div className="filter-section">
            <Filter size={16} />
            <span>Period Videos</span>
          </div>
        </div>
      </div>
      
      <VideoSection 
        title="Physical Tests" 
        videos={physicalTests} 
        sectionType="physical"
      />
      
      <VideoSection 
        title="Skills Assessment" 
        videos={skillsAssessment} 
        sectionType="skills"
      />
    </div>
  );
};

export default VideoAnalysis; 