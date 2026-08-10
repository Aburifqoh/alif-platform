"use server";

import { createClient } from "@alif/database/server";
import { revalidatePath } from "next/cache";
import { extractPlaylistId, getPlaylistVideos } from "@/lib/youtube";
import { uploadToR2 } from "@/lib/r2";

export async function importYouTubePlaylist(formData: FormData) {
  const url = formData.get("playlistUrl")?.toString();
  
  if (!url) {
    return { success: false, error: "Playlist URL is required." };
  }

  const playlistId = extractPlaylistId(url);
  
  if (!playlistId) {
    return { success: false, error: "Invalid YouTube Playlist URL." };
  }

  try {
    const supabase = await createClient();
    
    // Auth check (ensure user is admin)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Fetch videos from YouTube API
    const videos = await getPlaylistVideos(playlistId);
    
    if (videos.length === 0) {
      return { success: false, error: "No videos found in this playlist." };
    }

    // Map videos to our database schema
    const mediaItems = videos.map((video: any) => ({
      title: video.title,
      description: video.description,
      file_url: `https://youtube.com/watch?v=${video.id}`,
      file_type: 'video',
      mime_type: 'video/youtube',
      uploaded_by: user.id,
      is_public: true,
      tags: ['youtube', 'playlist-import']
    }));

    // Insert into Supabase
    const { error } = await supabase
      .from('media_items')
      .insert(mediaItems);

    if (error) {
      console.error("Database Error:", error);
      return { success: false, error: "Failed to save videos to database." };
    }

    revalidatePath("/gallery");
    return { success: true, count: videos.length };

  } catch (err: any) {
    console.error("YouTube Import Error:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function uploadMediaAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "No file provided." };
    }
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Convert File to Buffer for AWS SDK
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const isPublic = true; // By default gallery is public
    const { url } = await uploadToR2(buffer, `${Date.now()}-${file.name}`, file.type, isPublic);
    
    if (!url) {
      return { success: false, error: "Failed to upload to Cloudflare R2." };
    }

    // Determine file_type
    let fileType = 'other';
    if (file.type.startsWith('image/')) fileType = 'image';
    else if (file.type.startsWith('video/')) fileType = 'video';
    else if (file.type.startsWith('audio/')) fileType = 'audio';

    // Insert to DB
    const { error } = await supabase
      .from('media_items')
      .insert({
        title: file.name,
        file_url: url,
        file_type: fileType,
        mime_type: file.type,
        file_size: file.size,
        uploaded_by: user.id,
        is_public: isPublic
      });

    if (error) {
      console.error("Database Error:", error);
      return { success: false, error: "Failed to save record to database." };
    }

    revalidatePath("/gallery");
    return { success: true };

  } catch (err: any) {
    console.error("Upload Error:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
