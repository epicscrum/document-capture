/**
 * @epicscrum/document-capture — pre-flight validation. Pure; shared by client queue and server proxy.
 * Only PDFs and the listed image types pass; everything else is rejected before any network call.
 */
import { type CaptureMimeType } from "./constants.js";
export interface CaptureFileLike {
    name: string;
    type: string;
    size: number;
}
export type CaptureRejectionCode = "UNSUPPORTED_TYPE" | "TOO_MANY_FILES" | "TOTAL_TOO_LARGE";
export interface CaptureRejection {
    name: string;
    code: CaptureRejectionCode;
}
/** The accepted MIME type for a file, from its reported type or lowercase extension; else null. */
export declare function resolveCaptureMimeType(file: Pick<CaptureFileLike, "name" | "type">): CaptureMimeType | null;
export declare const isHeicLike: (file: Pick<CaptureFileLike, "name" | "type">) => boolean;
export interface CaptureValidation<T extends CaptureFileLike> {
    accepted: T[];
    rejected: CaptureRejection[];
}
/**
 * Splits `incoming` into accepted and rejected files, given what is already staged.
 * Order matters: type first, then the 5-file cap, then the combined 10 MB cap.
 */
export declare function validateCaptureFiles<T extends CaptureFileLike>(existing: ReadonlyArray<CaptureFileLike>, incoming: ReadonlyArray<T>): CaptureValidation<T>;
/** "1.2 MB" / "340 KB" — for the staged queue rows. */
export declare function formatCaptureBytes(bytes: number): string;
