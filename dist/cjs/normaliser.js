"use strict";
/**
 * @epicscrum/document-capture — camera / HEIC normaliser (browser only). PDFs pass through
 * byte-for-byte; HEIC and camera photos are re-encoded as JPEG (long edge <= 2400px, quality 0.90).
 * SHA-256 is computed AFTER normalising so the fingerprint describes the kept file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Hex = sha256Hex;
exports.fitLongEdge = fitLongEdge;
exports.normaliseCaptureFile = normaliseCaptureFile;
const constants_js_1 = require("./constants.js");
const validation_js_1 = require("./validation.js");
async function sha256Hex(blob) {
    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}
/** Dimensions that bring the long edge to <= `maxEdge` (never upscales). */
function fitLongEdge(width, height, maxEdge = constants_js_1.CAPTURE_MAX_LONG_EDGE_PX) {
    const longEdge = Math.max(width, height);
    if (longEdge <= maxEdge)
        return { width, height };
    const scale = maxEdge / longEdge;
    return {
        width: Math.max(1, Math.round(width * scale)),
        height: Math.max(1, Math.round(height * scale)),
    };
}
const jpegName = (name) => `${name.replace(/\.[^.]+$/, "") || "capture"}.jpg`;
async function reencode(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const size = fitLongEdge(bitmap.width, bitmap.height);
        const canvas = document.createElement("canvas");
        canvas.width = size.width;
        canvas.height = size.height;
        const context = canvas.getContext("2d");
        if (!context)
            return null;
        context.drawImage(bitmap, 0, 0, size.width, size.height);
        bitmap.close();
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", constants_js_1.CAPTURE_JPEG_QUALITY));
        return blob
            ? new File([blob], jpegName(file.name), {
                type: "image/jpeg",
                lastModified: file.lastModified,
            })
            : null;
    }
    catch {
        // Browsers without HEIC decoding reject here; the caller keeps the original untouched.
        return null;
    }
}
/**
 * `fromCamera` forces a re-encode so phone photos always land under the long-edge cap;
 * other JPEG/PNG/WebP files are only re-encoded when they exceed it.
 */
async function normaliseCaptureFile(file, options = {}) {
    const mime = (0, validation_js_1.resolveCaptureMimeType)(file);
    if (mime === "application/pdf" || mime === null)
        return { file, normalised: false, sha256: await sha256Hex(file) };
    let needsReencode = options.fromCamera === true || (0, validation_js_1.isHeicLike)(file);
    if (!needsReencode) {
        try {
            const probe = await createImageBitmap(file);
            needsReencode =
                Math.max(probe.width, probe.height) > constants_js_1.CAPTURE_MAX_LONG_EDGE_PX;
            probe.close();
        }
        catch {
            needsReencode = false;
        }
    }
    const converted = needsReencode ? await reencode(file) : null;
    const final = converted ?? file;
    return {
        file: final,
        normalised: converted !== null,
        sha256: await sha256Hex(final),
    };
}
