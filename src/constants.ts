/**
 * @epicscrum/document-capture — constants. Framework-free and domain-free.
 */

export const CAPTURE_ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
] as const;
export type CaptureMimeType = (typeof CAPTURE_ACCEPTED_MIME_TYPES)[number];

/** Used only when the browser reports no MIME type (common for HEIC on Windows). */
export const CAPTURE_EXTENSION_MIME: Readonly<Record<string, CaptureMimeType>> =
  {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
  };

export const CAPTURE_MAX_FILES = 5;
export const CAPTURE_MAX_TOTAL_BYTES = 10 * 1024 * 1024;
export const CAPTURE_MAX_LONG_EDGE_PX = 2400;
export const CAPTURE_JPEG_QUALITY = 0.9;

/** `accept` for the file picker. */
export const CAPTURE_INPUT_ACCEPT = [
  ...CAPTURE_ACCEPTED_MIME_TYPES,
  ".heic",
  ".heif",
].join(",");

/** `accept` for the mobile "Take Photo" input (paired with `capture="environment"`). */
export const CAPTURE_CAMERA_ACCEPT = "image/jpeg,image/png";
