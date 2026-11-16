/**
 * @epicscrum/document-capture — React binding for the staged queue. Validates incoming files,
 * stages them immediately, then normalises each in the background.
 */
import { type StagedItem } from "./staged-queue.js";
import { type CaptureRejection } from "./validation.js";
export declare function useStagedCapture(): {
    items: readonly StagedItem[];
    rejections: CaptureRejection[];
    totalBytes: number;
    isBusy: boolean;
    isReady: boolean;
    addFiles: (incoming: File[], options?: {
        fromCamera?: boolean;
    }) => void;
    remove: (id: string) => void;
    reorder: (from: number, to: number) => void;
    clear: () => void;
};
