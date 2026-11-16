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

export type StagedAction =
  | { type: "add"; items: StagedItem[] }
  | { type: "resolve"; id: string; file: File; sha256: string; normalised: boolean }
  | { type: "fail"; id: string; error: string }
  | { type: "remove"; id: string }
  | { type: "reorder"; from: number; to: number }
  | { type: "clear" };

export const EMPTY_STAGED_QUEUE: readonly StagedItem[] = [];

const patch = (
  queue: readonly StagedItem[],
  id: string,
  change: Partial<StagedItem>
): StagedItem[] =>
  queue.map((item) => (item.id === id ? { ...item, ...change } : item));

export function stagedQueueReducer(
  queue: readonly StagedItem[],
  action: StagedAction
): readonly StagedItem[] {
  switch (action.type) {
    case "add":
      return [...queue, ...action.items];
    case "resolve":
      return patch(queue, action.id, {
        file: action.file,
        sha256: action.sha256,
        normalised: action.normalised,
        status: "ready",
        error: undefined,
      });
    case "fail":
      return patch(queue, action.id, { status: "error", error: action.error });
    case "remove":
      return queue.filter((item) => item.id !== action.id);
    case "reorder": {
      const { from, to } = action;
      if (from === to || from < 0 || to < 0) return queue;
      if (from >= queue.length || to >= queue.length) return queue;
      const next = [...queue];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    }
    case "clear":
      return EMPTY_STAGED_QUEUE;
  }
}

export const stagedTotalBytes = (queue: readonly StagedItem[]): number =>
  queue.reduce((sum, item) => sum + item.file.size, 0);

export const isStagedBusy = (queue: readonly StagedItem[]): boolean =>
  queue.some((item) => item.status === "normalising");

/** Ready to submit: non-empty, nothing still normalising, nothing failed. */
export const isStagedReady = (queue: readonly StagedItem[]): boolean =>
  queue.length > 0 && queue.every((item) => item.status === "ready");
