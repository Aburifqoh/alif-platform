const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

/**
 * Extracts the playlist ID from a YouTube playlist URL.
 */
export function extractPlaylistId(url: string): string | null {
  const match = url.match(/[?&]list=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Extracts the video ID from a YouTube video URL.
 */
export function extractVideoId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
  return match ? match[1] : null;
}

/**
 * Fetches all videos in a YouTube playlist using the YouTube Data API v3.
 */
export async function getPlaylistVideos(playlistId: string) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const maxResults = 50;
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${maxResults}&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`YouTube API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  return data.items.map((item: any) => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
  }));
}

/**
 * Fetches metadata for a single YouTube video.
 */
export async function getVideoMetadata(videoId: string) {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YOUTUBE_API_KEY is not configured');
  }

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`YouTube API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    return null;
  }
  
  const snippet = data.items[0].snippet;
  
  return {
    id: videoId,
    title: snippet.title,
    description: snippet.description,
    thumbnailUrl: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
    publishedAt: snippet.publishedAt,
  };
}
