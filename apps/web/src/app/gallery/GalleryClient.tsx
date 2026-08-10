"use client";

import React, { useState } from "react";
import { Play, X, Image as ImageIcon, Video, Calendar as CalendarIcon, MapPin } from "lucide-react";

type MediaItem = {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  category?: string;
  created_at: string;
};

export default function GalleryClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [filter, setFilter] = useState("All");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Extract unique categories from data dynamically, add base filters
  const categoriesSet = new Set<string>();
  initialMedia.forEach(item => {
    if (item.category && item.category !== 'Uncategorized') {
      categoriesSet.add(item.category);
    }
  });
  const CATEGORIES = ["All", "Photos", "Videos", ...Array.from(categoriesSet)];

  const filteredItems = initialMedia.filter((item) => {
    if (filter === "All") return true;
    if (filter === "Photos") return item.file_type === "image";
    if (filter === "Videos") return item.file_type === "video";
    return item.category === filter;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d1117]">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-[#0a3d26] via-[#0f5132] to-[#1e2a35] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-[#d4a017] text-sm font-semibold uppercase tracking-widest">Media Archive</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-[Outfit] leading-tight">
            ALIF Gallery
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore photos and videos from our past events, rural da'wah outreaches, and community programs.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-brand-red text-white shadow-md"
                    : "bg-gray-100 dark:bg-[#161b22] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="group cursor-pointer bg-[#faf6ef] dark:bg-[#161b22] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:shadow-xl transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
                    {item.file_type === "image" ? (
                      <img 
                        src={item.file_url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black group-hover:scale-105 transition-transform duration-500">
                         <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all z-10">
                           <div className="w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                             <Play className="w-6 h-6 ml-1" />
                           </div>
                         </div>
                      </div>
                    )}
                    
                    <div className="absolute top-3 left-3 flex gap-2 z-20">
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur text-white text-xs font-semibold rounded flex items-center gap-1.5">
                        {item.file_type === "video" ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        {item.file_type === "video" ? "Video" : "Photo"}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white font-[Outfit] text-lg mb-2 group-hover:text-brand-red dark:group-hover:text-brand-red-light transition-colors line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-[#161b22] rounded-3xl border border-gray-100 dark:border-white/5">
              <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-[Outfit]">No media found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later or try a different filter.</p>
            </div>
          )}

        </div>
      </section>

      {/* Lightbox / Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col">
          <div className="flex justify-between items-center p-4 sm:p-6 text-white border-b border-white/10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-[Outfit]">{selectedItem.title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span>{new Date(selectedItem.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedItem(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
            {selectedItem.file_type === "image" ? (
              <img 
                src={selectedItem.file_url} 
                alt={selectedItem.title}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl relative">
                <iframe 
                  src={selectedItem.file_url} 
                  title={selectedItem.title}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </div>
          
          {selectedItem.description && (
            <div className="p-6 bg-black/50 border-t border-white/10 text-center">
              <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">{selectedItem.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
