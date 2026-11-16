/**
 * @epicscrum/document-capture — headless staged queue (1–5 items). A pure reducer plus
 * selectors: no React, no DOM, so it is testable in Node and reusable by any UI.
 */
export type StagedStatus = "normalising" | "ready" | "error";
export interface StagedItem {
    id: string;
    file: File;
    status: StagedStatus;
    /** Set once normalisation finishes. */
    sha256?: string;
    /** True when the image was re-encoded. */
    normalised?: boolean;
    error?: string;
}
export type StagedAction = {
    type: "add";
    items: StagedItem[];
} | {
    type: "resolve";
    id: string;
    file: File;
    sha256: string;
    normalised: boolean;
} | {
    type: "fail";
    id: string;
    error: string;
} | {
    type: "remove";
    id: string;
} | {
    type: "reorder";
    from: number;
    to: number;
} | {
    type: "clear";
};
export declare const EMPTY_STAGED_QUEUE: readonly StagedItem[];
export declare function stagedQueueReducer(queue: readonly StagedItem[], action: StagedAction): readonly StagedItem[];
export declare const stagedTotalBytes: (queue: readonly StagedItem[]) => number;
export declare const isStagedBusy: (queue: readonly StagedItem[]) => boolean;
/** Ready to submit: non-empty, nothing still normalising, nothing failed. */
export declare const isStagedReady: (queue: readonly StagedItem[]) => boolean;
