import { useRef, useState, type ChangeEvent } from "react";
import { LuPackage, LuUpload, LuX } from "react-icons/lu";

interface ProductImagePickerProps {
  image: string;
  onChange: (image: string) => void;
}

const MAX_IMAGE_SIZE = 256;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const source = new Image();

      source.onload = () => {
        const scale = Math.min(
          1,
          MAX_IMAGE_SIZE / source.width,
          MAX_IMAGE_SIZE / source.height,
        );

        const width = Math.round(source.width * scale);
        const height = Math.round(source.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) {
          reject(new Error("Canvas is not supported"));
          return;
        }

        context.drawImage(source, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };

      source.onerror = () => reject(new Error("Failed to load image"));
      source.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function ProductImagePicker({
  image,
  onChange,
}: ProductImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      const resizedImage = await resizeImage(file);
      onChange(resizedImage);
    } catch {
      setError("Failed to process the image.");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleRemove() {
    onChange("");
    setError("");
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex flex-col gap-4 rounded-xl border border-c-border
          p-4 max-sm:border-none max-sm:px-0 sm:flex-row
          sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="flex size-24 shrink-0 items-center justify-center
              overflow-hidden rounded-xl bg-c-bg ring-1 ring-c-border p-1"
          >
            {image ? (
              <img
                src={image}
                alt="Product preview"
                className="size-full object-contain"
              />
            ) : (
              <LuPackage size={36} className="text-c-primary" />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-c-text-secondary">
              Product Image
            </p>

            <p className="mt-1 text-xs text-c-text-muted">
              Upload an image for your product.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-1.5
              rounded-lg border border-c-border bg-c-surface px-3 py-2
              text-sm font-medium text-c-text-secondary transition
              hover:bg-c-surface-hover hover:text-c-text
              disabled:cursor-not-allowed disabled:opacity-50
              max-sm:flex-1"
          >
            <LuUpload size={16} />
            {isProcessing
              ? "Processing..."
              : image
                ? "Change image"
                : "Upload"}
          </button>

          {image && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isProcessing}
              aria-label="Remove product image"
              className="inline-flex items-center justify-center gap-1.5
                rounded-lg border border-c-danger px-3 py-2
                text-sm font-medium text-c-danger transition
                hover:bg-c-danger hover:text-white
                disabled:cursor-not-allowed disabled:opacity-50
                max-sm:flex-1"
            >
              <LuX size={16} />
              Remove
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <p className="text-xs text-c-text-muted">
        JPG, PNG or WebP. Maximum file size: 5MB.
        Images are resized before saving.
      </p>

      {error && (
        <p role="alert" className="text-xs text-c-danger">
          {error}
        </p>
      )}
    </div>
  );
}