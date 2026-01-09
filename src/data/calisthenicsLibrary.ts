// /workspaces/claude-workspace/fitnessapp/src/data/calisthenicsLibrary.ts
// Calisthenics Workouts und Videos

export interface ICalisthenicsVideo {
  id: string;
  title: string;
  duration: string;
  level: string;
  thumbnail: string;
  youtubeUrl: string;
  channel: string;
}

export const CALISTHENICS_VIDEOS: ICalisthenicsVideo[] = [
  {
    id: 'cali_video_1',
    title: '10 Min Beginner Calisthenics',
    duration: '10:00',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder1',
    channel: 'Calisthenics Movement',
  },
  {
    id: 'cali_video_2',
    title: '15 Min Full Body Workout',
    duration: '15:00',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder2',
    channel: 'Calisthenics Movement',
  },
  {
    id: 'cali_video_3',
    title: '20 Min Push & Pull Routine',
    duration: '20:00',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder3',
    channel: 'FitnessFAQs',
  },
  {
    id: 'cali_video_4',
    title: '30 Min Advanced Bodyweight',
    duration: '30:00',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
    youtubeUrl: 'https://www.youtube.com/watch?v=placeholder4',
    channel: 'Austin Dunham',
  },
];
