import React from "react";
import GalleryClient from "./GalleryClient";
import { createClient } from "@alif/database/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery | ALIF",
  description: "Explore photos and videos from our past events, rural da'wah outreaches, and community programs.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const supabase = await createClient();
  
  // Fetch public media items
  const { data: mediaItems } = await supabase
    .from("media_items")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return <GalleryClient initialMedia={mediaItems || []} />;
}
