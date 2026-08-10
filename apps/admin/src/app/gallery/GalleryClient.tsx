"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { PlaySquare, Upload, Image as ImageIcon, Video, Search, Loader2, Trash2 } from "lucide-react";
import { importYouTubePlaylist, uploadMediaAction } from "../actions/gallery";
import { createClient } from "@alif/database/client";

export default function GalleryClient() {
  const supabase = createClient();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [filterType, setFilterType] = useState<"All"|"Images"|"Videos">("All");

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoadingMedia(true);
    const { data } = await supabase
      .from("media_items")
      .select("*")
      .order("created_at", { ascending: false });
    
    setMediaItems(data || []);
    setLoadingMedia(false);
  };

  const handleImportPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl) return;
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("playlistUrl", playlistUrl);
      
      const result = await importYouTubePlaylist(formData);
      
      if (result.success) {
        setPlaylistUrl("");
        alert(`Successfully imported ${result.count} videos!`);
        fetchMedia();
      } else {
        alert(`Error: ${result.error}`);
      }
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMediaAction(formData);
    setIsUploading(false);

    if (result.success) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMedia();
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!confirm("Are you sure you want to delete this media item?")) return;
    
    // Deleting from DB. A complete solution would also trigger R2 deletion,
    // but for now we'll just delete the DB record.
    await supabase.from("media_items").delete().eq("id", id);
    fetchMedia();
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filterType === "Images") return item.file_type === 'image';
    if (filterType === "Videos") return item.file_type === 'video';
    return true;
  });

  const imageCount = mediaItems.filter(i => i.file_type === 'image').length;
  const videoCount = mediaItems.filter(i => i.file_type === 'video').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Media Gallery</h1>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,video/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isUploading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* YouTube Import Card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <PlaySquare className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Import YouTube Playlist</h2>
              <p className="text-sm text-gray-500">Automatically sync videos from a YouTube playlist URL</p>
            </div>
          </div>
          <form onSubmit={handleImportPlaylist} className="flex gap-3">
            <input 
              type="url" 
              placeholder="https://youtube.com/playlist?list=..." 
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={isPending}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Importing..." : "Import"}
            </button>
          </form>
        </div>

        {/* Quick Stats */}
        <div className="rounded-xl border bg-white p-6 shadow-sm grid grid-cols-2 gap-4">
          <div className="flex flex-col justify-center border-r">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Images (R2)</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">{imageCount}</span>
          </div>
          <div className="flex flex-col justify-center pl-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Video className="h-4 w-4" />
              <span className="text-sm font-medium">Videos (YT)</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">{videoCount}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <div className="flex gap-4">
            <h2 className="font-semibold text-gray-900">All Media</h2>
            <div className="flex gap-2 border-l pl-4">
              <button onClick={() => setFilterType("All")} className={`text-sm font-medium px-2 py-1 rounded ${filterType === 'All' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'}`}>All</button>
              <button onClick={() => setFilterType("Images")} className={`text-sm font-medium px-2 py-1 rounded ${filterType === 'Images' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'}`}>Images</button>
              <button onClick={() => setFilterType("Videos")} className={`text-sm font-medium px-2 py-1 rounded ${filterType === 'Videos' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-900'}`}>Videos</button>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {loadingMedia ? (
             <div className="py-12 flex justify-center text-gray-400">
               <Loader2 className="w-8 h-8 animate-spin" />
             </div>
          ) : filteredMedia.length === 0 ? (
            <div className="aspect-[4/1] bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-sm">No media found</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map(item => (
                <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {item.file_type === 'image' ? (
                    <img src={item.file_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black">
                      <PlaySquare className="h-8 w-8 text-white/80 mb-2" />
                      <span className="text-[10px] text-white/70 px-2 text-center line-clamp-1">{item.title}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => handleDelete(item.id, item.file_url)}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
