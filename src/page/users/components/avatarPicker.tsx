import { useRef, useState, type ChangeEvent } from "react";
import { LuUpload, LuX } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";

interface AvatarPickerProps {
  avatar: string;
  name: string;
  onChange: (avatar: string) => void;
}

const MAX_AVATAR_SIZE = 256;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        let { width, height } = image;

        if (width > height) {
          if (width > MAX_AVATAR_SIZE) {
            height = Math.round((height * MAX_AVATAR_SIZE) / width);
            width = MAX_AVATAR_SIZE;
          }
        } else if (height > MAX_AVATAR_SIZE) {
          width = Math.round((width * MAX_AVATAR_SIZE) / height);
          height = MAX_AVATAR_SIZE;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Canvas is not supported"));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };

      image.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      image.src = reader.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

export default function AvatarPicker({
  avatar,
  name,
  onChange,
}: AvatarPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      const resizedAvatar = await resizeImage(file);
      console.log(resizedAvatar);
      
      onChange(resizedAvatar);
      setError("");
    } catch {
      setError("Failed to process the image");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-4 rounded-xl border border-c-border p-4
          max-sm:border-none sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <div
            className="flex size-20 shrink-0 items-center justify-center overflow-hidden
              rounded-full bg-primary/10 ring-2 ring-c-border"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={name || "New user"}
                className="size-full object-cover"
              />
            ) : (
              <FaUserAlt size={32} className="text-primary" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-c-text-secondary">
              Profile Image
            </p>

            <p className="text-xs text-c-text-muted">
              Upload a photo for your profile.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-c-border
              bg-c-surface px-3 py-2 text-sm font-medium text-c-text-secondary
              transition hover:bg-c-surface-hover hover:text-c-text
              max-sm:flex-1 max-sm:justify-center"
          >
            <LuUpload size={16} />
            Upload
          </button>

          {avatar && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove profile image"
              className="inline-flex items-center gap-1.5 rounded-lg border border-c-danger
                px-3 py-2 text-sm font-medium text-c-danger transition
                hover:bg-c-danger hover:text-white
                max-sm:flex-1 max-sm:justify-center"
            >
              <LuX size={16} />
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-c-danger">
          {error}
        </p>
      )}
    </div>
  );
}
