import { useState } from "react";
import { LuPackage } from "react-icons/lu";

interface ProductImageProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<
  NonNullable<ProductImageProps["size"]>,
  string
> = {
  sm: "size-11 rounded-lg",
  md: "size-16 rounded-xl",
  lg: "size-30 rounded-2xl",
};

const ICON_SIZE: Record<
  NonNullable<ProductImageProps["size"]>,
  number
> = {
  sm: 18,
  md: 24,
  lg: 40,
};


export default function ProductImage({
  src,
  name,
  size = "sm",
  className = "",
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center
          bg-c-primary/8 text-c-primary ring-1 ring-c-border
          ${SIZE_CLASSES[size]} ${className}`}
      >
        <LuPackage size={ICON_SIZE[size]} />
      </div>
    );
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden
        bg-c-bg ring-1 ring-c-border p-1 bg-white
        ${SIZE_CLASSES[size]} ${className}`}
    >
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className="size-full object-contain"
      />
    </div>
  );
}
