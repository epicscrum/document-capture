"use strict";
/**
 * @epicscrum/document-capture — constants. Framework-free and domain-free.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAPTURE_CAMERA_ACCEPT = exports.CAPTURE_INPUT_ACCEPT = exports.CAPTURE_JPEG_QUALITY = exports.CAPTURE_MAX_LONG_EDGE_PX = exports.CAPTURE_MAX_TOTAL_BYTES = exports.CAPTURE_MAX_FILES = exports.CAPTURE_EXTENSION_MIME = exports.CAPTURE_ACCEPTED_MIME_TYPES = void 0;
exports.CAPTURE_ACCEPTED_MIME_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
];
/** Used only when the browser reports no MIME type (common for HEIC on Windows). */
exports.CAPTURE_EXTENSION_MIME = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    heic: "image/heic",
    heif: "image/heif",
};
exports.CAPTURE_MAX_FILES = 5;
exports.CAPTURE_MAX_TOTAL_BYTES = 10 * 1024 * 1024;
exports.CAPTURE_MAX_LONG_EDGE_PX = 2400;
exports.CAPTURE_JPEG_QUALITY = 0.9;
/** `accept` for the file picker. */
exports.CAPTURE_INPUT_ACCEPT = [
    ...exports.CAPTURE_ACCEPTED_MIME_TYPES,
    ".heic",
    ".heif",
].join(",");
/** `accept` for the mobile "Take Photo" input (paired with `capture="environment"`). */
exports.CAPTURE_CAMERA_ACCEPT = "image/jpeg,image/png";
