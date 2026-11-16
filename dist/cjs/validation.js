"use strict";
/**
 * @epicscrum/document-capture — pre-flight validation. Pure; shared by client queue and server proxy.
 * Only PDFs and the listed image types pass; everything else is rejected before any network call.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHeicLike = void 0;
exports.resolveCaptureMimeType = resolveCaptureMimeType;
exports.validateCaptureFiles = validateCaptureFiles;
exports.formatCaptureBytes = formatCaptureBytes;
const constants_js_1 = require("./constants.js");
const ACCEPTED = new Set(constants_js_1.CAPTURE_ACCEPTED_MIME_TYPES);
/** The accepted MIME type for a file, from its reported type or lowercase extension; else null. */
function resolveCaptureMimeType(file) {
    const reported = file.type.trim().toLowerCase();
    if (ACCEPTED.has(reported))
        return reported;
    // A blank or generic type falls back to the extension; a known-bad type never does.
    if (reported && reported !== "application/octet-stream")
        return null;
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    return constants_js_1.CAPTURE_EXTENSION_MIME[extension] ?? null;
}
const isHeicLike = (file) => {
    const mime = resolveCaptureMimeType(file);
    return mime === "image/heic" || mime === "image/heif";
};
exports.isHeicLike = isHeicLike;
/**
 * Splits `incoming` into accepted and rejected files, given what is already staged.
 * Order matters: type first, then the 5-file cap, then the combined 10 MB cap.
 */
function validateCaptureFiles(existing, incoming) {
    const accepted = [];
    const rejected = [];
    let count = existing.length;
    let bytes = existing.reduce((sum, file) => sum + file.size, 0);
    for (const file of incoming) {
        if (!resolveCaptureMimeType(file)) {
            rejected.push({ name: file.name, code: "UNSUPPORTED_TYPE" });
        }
        else if (count >= constants_js_1.CAPTURE_MAX_FILES) {
            rejected.push({ name: file.name, code: "TOO_MANY_FILES" });
        }
        else if (bytes + file.size > constants_js_1.CAPTURE_MAX_TOTAL_BYTES) {
            rejected.push({ name: file.name, code: "TOTAL_TOO_LARGE" });
        }
        else {
            accepted.push(file);
            count += 1;
            bytes += file.size;
        }
    }
    return { accepted, rejected };
}
/** "1.2 MB" / "340 KB" — for the staged queue rows. */
function formatCaptureBytes(bytes) {
    if (bytes >= 1024 * 1024)
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
