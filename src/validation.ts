/**
 * @epicscrum/document-capture — pre-flight validation. Pure; shared by client queue and server proxy.
 * Only PDFs and the listed image types pass; everything else is rejected before any network call.
 */

import {
  CAPTURE_ACCEPTED_MIME_TYPES,
  CAPTURE_EXTENSION_MIME,
  CAPTURE_MAX_FILES,
  CAPTURE_MAX_TOTAL_BYTES,
  type CaptureMimeType,
} from "./constants.js";

export interface CaptureFileLike {
  name: string;
  type: string;
  size: number;
}

export type CaptureRejectionCode =
  "UNSUPPORTED_TYPE" | "TOO_MANY_FILES" | "TOTAL_TOO_LARGE";

export interface CaptureRejection {
  name: string;
  code: CaptureRejectionCode;
}

const ACCEPTED: ReadonlySet<string> = new Set(CAPTURE_ACCEPTED_MIME_TYPES);

/** The accepted MIME type for a file, from its reported type or lowercase extension; else null. */
export function resolveCaptureMimeType(
  file: Pick<CaptureFileLike, "name" | "type">
): CaptureMimeType | null {
  const reported = file.type.trim().toLowerCase();
  if (ACCEPTED.has(reported)) return reported as CaptureMimeType;
  // A blank or generic type falls back to the extension; a known-bad type never does.
  if (reported && reported !== "application/octet-stream") return null;
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return CAPTURE_EXTENSION_MIME[extension] ?? null;
}

export const isHeicLike = (
  file: Pick<CaptureFileLike, "name" | "type">
): boolean => {
  const mime = resolveCaptureMimeType(file);
  return mime === "image/heic" || mime === "image/heif";
};

export interface CaptureValidation<T extends CaptureFileLike> {
  accepted: T[];
  rejected: CaptureRejection[];
}

/**
 * Splits `incoming` into accepted and rejected files, given what is already staged.
 * Order matters: type first, then the 5-file cap, then the combined 10 MB cap.
 */
export function validateCaptureFiles<T extends CaptureFileLike>(
  existing: ReadonlyArray<CaptureFileLike>,
  incoming: ReadonlyArray<T>
): CaptureValidation<T> {
  const accepted: T[] = [];
  const rejected: CaptureRejection[] = [];
  let count = existing.length;
  let bytes = existing.reduce((sum, file) => sum + file.size, 0);
  for (const file of incoming) {
    if (!resolveCaptureMimeType(file)) {
      rejected.push({ name: file.name, code: "UNSUPPORTED_TYPE" });
    } else if (count >= CAPTURE_MAX_FILES) {
      rejected.push({ name: file.name, code: "TOO_MANY_FILES" });
    } else if (bytes + file.size > CAPTURE_MAX_TOTAL_BYTES) {
      rejected.push({ name: file.name, code: "TOTAL_TOO_LARGE" });
    } else {
      accepted.push(file);
      count += 1;
      bytes += file.size;
    }
  }
  return { accepted, rejected };
}

/** "1.2 MB" / "340 KB" — for the staged queue rows. */
export function formatCaptureBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
