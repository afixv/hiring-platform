// app/components/ProfileUploader.js
"use client";

import { useState } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import GestureCaptureModal from "./gesture-capture-modal";

export default function ProfileUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null); // State untuk menyimpan URL gambar hasil capture
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageSubmit = (newImageUrl: string) => {
    setImageUrl(newImageUrl);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs-bold text-neutral-90">Photo Profile</label>

      {/* Avatar Container */}
      <div className="flex flex-col items-start gap-2">
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Captured profile"
              layout="fill"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src="/img/avatar-input.svg"
                alt="Avatar placeholder"
                width={128}
                height={128}
                priority
              />
            </div>
          )}
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="md"
          leadingIcon={<Download size={16} />}>
          Take a Picture
        </Button>
      </div>

      {isModalOpen && (
        <GestureCaptureModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleImageSubmit}
        />
      )}
    </div>
  );
}
