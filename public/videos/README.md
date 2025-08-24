# Video Files Directory

This directory contains video files that work with the VideoWithOverlays component.

## File Structure
- `sample-video.mp4` - Sample video file for testing overlays
- `sample-poster.jpg` - Poster image for the sample video

## Overlay Integration
Each video can have a corresponding overlay JSON file in `/data/overlays/` that provides:
- Keypoint tracking data
- Skeleton connections
- Focus area annotations
- Frame-by-frame analysis

## Example Usage
```tsx
<VideoWithOverlays
  src="/videos/sample-video.mp4"
  overlaySrc="/data/overlays/ahmed-run-01.json"
  poster="/videos/sample-poster.jpg"
  compact
/>
```

## Adding New Videos
1. Place your MP4 file in this directory
2. Create a corresponding overlay JSON in `/data/overlays/`
3. Update the component props to reference your new files

## Supported Formats
- Video: MP4, WebM, OGV
- Overlay: JSON with v1 schema
- Poster: JPG, PNG, WebP
