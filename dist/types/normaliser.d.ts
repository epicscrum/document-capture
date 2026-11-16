/**
 * @epicscrum/document-capture — camera / HEIC normaliser (browser only). PDFs pass through
 * byte-for-byte; HEIC and camera photos are re-encoded as JPEG (long edge <= 2400px, quality 0.90).
 * SHA-256 is computed AFTER normalising so the fingerprint describes the kept file.
 */
export interface NormalisedCapture {
    file: File;
    /** True when the image was re-encoded (false for PDFs, small JPEG/PNG/WebP, or decode failure). */
    normalised: boolean;
    sha256: string;
}
export declare function sha256Hex(blob: Blob): Promise<string>;
/** Dimensions that bring the long edge to <= `maxEdge` (never upscales). */
export declare function fitLongEdge(width: number, height: number, maxEdge?: number): {
    width: number;
    height: number;
};
/**
 * `fromCamera` forces a re-encode so phone photos always land under the long-edge cap;
 * other JPEG/PNG/WebP files are only re-encoded when they exceed it.
 */
export declare function normaliseCaptureFile(file: File, options?: {
    fromCamera?: boolean;
}): Promise<NormalisedCapture>;
