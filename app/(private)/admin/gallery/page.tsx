import { Image as ImageIcon } from "lucide-react";

export default function AdminGalleryPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center border-2 border-dashed border-border rounded-xl bg-card/50">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <ImageIcon className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Photo Gallery Management
      </h2>
      <p className="text-muted-foreground max-w-md">
        This feature is currently under development and will be available to
        admins soon.
      </p>
    </div>
  );
}
