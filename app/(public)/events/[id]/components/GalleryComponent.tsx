"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image as ImageIcon, Trash2, Plus, Download } from "lucide-react";
import {
  deleteEventPhoto,
  uploadEventPhotos,
} from "@/app/(private)/admin/events/actions";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useRef } from "react";

export default function GalleryComponent({
  eventId,
  eventTitle,
  photos,
  isAdmin,
  isApproved,
}: {
  eventId: string;
  eventTitle: string;
  photos: {
    id: string;
    url: string;
    caption?: string;
    profiles?: { full_name?: string };
  }[];
  isAdmin: boolean;
  isApproved: boolean;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAddPhotos = async () => {
    if (!fileInputRef.current?.files?.length) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("eventId", eventId);
    formData.append("eventTitle", eventTitle);
    if (caption.trim()) {
      formData.append("caption", caption.trim());
    }

    Array.from(fileInputRef.current.files).forEach((file) => {
      formData.append("files", file);
    });

    const { success, error } = await uploadEventPhotos(formData);

    if (success) {
      toast.success("Photos added to gallery");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setCaption("");
      router.refresh();
    } else {
      toast.error(error || "Failed to add photos");
    }
    setIsUploading(false);
  };

  const handleDelete = async (photoId: string) => {
    if (
      !confirm("Are you sure you want to delete this photo from the gallery?")
    )
      return;

    const { success, error } = await deleteEventPhoto(photoId, eventId);
    if (success) {
      toast.success("Photo removed");
      router.refresh();
    } else {
      toast.error(error || "Failed to remove photo");
    }
  };

  if (photos.length === 0 && !isAdmin) return null;

  return (
    <div className="bg-card rounded-xl border p-6 md:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-2">
        <ImageIcon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Event Gallery</h2>
      </div>

      {isAdmin && (
        <div className="bg-muted/30 p-4 rounded-lg border space-y-4 mb-6">
          <h3 className="text-sm font-semibold">Admin: Upload Photos</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              placeholder="Optional caption for these photos"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mb-2"
            />
            <div className="grow">
              <Input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="cursor-pointer file:cursor-pointer"
              />
            </div>
            <Button onClick={handleAddPhotos} disabled={isUploading}>
              <Plus className="h-4 w-4 mr-2" />{" "}
              {isUploading ? "Uploading..." : "Upload Photos"}
            </Button>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-center text-muted-foreground py-6 border border-dashed rounded-lg">
          No photos have been added to this event yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              {/* Low-quality preview initially, full quality loaded dynamically. Handled by image size optimization or proxying in a real production Next app. For now, native img supports dynamic src. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.caption || "Event photo"}
                loading="lazy"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }} // Fallback
              />

              {/* Hover overlay: Caption and Uploader Name */}
              <div className="absolute inset-x-0 bottom-0 bg-black/70 backdrop-blur-sm text-white p-3 truncate translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-1">
                {photo.caption && (
                  <span className="text-sm font-medium">{photo.caption}</span>
                )}
                <span className="text-xs text-white/80">
                  By {photo.profiles?.full_name || "Unknown"}
                </span>
              </div>

              {/* Download & Delete Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {isApproved && (
                  <Button
                    variant="secondary"
                    className="h-8 w-8 bg-background/80 hover:bg-background backdrop-blur-sm shadow-sm"
                    onClick={() => {
                      // Trigger download of original high-quality image
                      const link = document.createElement("a");
                      link.href = photo.url;
                      link.target = "_blank";
                      link.download = `event-photo-${photo.id}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      toast.success("Downloading original image...");
                    }}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                {isAdmin && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-sm"
                    onClick={() => handleDelete(photo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
