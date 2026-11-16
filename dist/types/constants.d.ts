/**
 * @epicscrum/document-capture — constants. Framework-free and domain-free.
 */
export declare const CAPTURE_ACCEPTED_MIME_TYPES: readonly ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
export type CaptureMimeType = (typeof CAPTURE_ACCEPTED_MIME_TYPES)[number];
/** Used only when the browser reports no MIME type (common for HEIC on Windows). */
export declare const CAPTURE_EXTENSION_MIME: Readonly<Record<string, CaptureMimeType>>;
export declare const CAPTURE_MAX_FILES = 5;
export declare const CAPTURE_MAX_TOTAL_BYTES: number;
export declare const CAPTURE_MAX_LONG_EDGE_PX = 2400;
export declare const CAPTURE_JPEG_QUALITY = 0.9;
/** `accept` for the file picker. */
export declare const CAPTURE_INPUT_ACCEPT: string;
/** `accept` for the mobile "Take Photo" input (paired with `capture="environment"`). */
export declare const CAPTURE_CAMERA_ACCEPT = "image/jpeg,image/png";
