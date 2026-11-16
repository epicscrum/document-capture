"use strict";
/**
 * @epicscrum/document-capture — headless staged queue (1–5 items). A pure reducer plus
 * selectors: no React, no DOM, so it is testable in Node and reusable by any UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStagedReady = exports.isStagedBusy = exports.stagedTotalBytes = exports.EMPTY_STAGED_QUEUE = void 0;
exports.stagedQueueReducer = stagedQueueReducer;
exports.EMPTY_STAGED_QUEUE = [];
const patch = (queue, id, change) => queue.map((item) => (item.id === id ? { ...item, ...change } : item));
function stagedQueueReducer(queue, action) {
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
            if (from === to || from < 0 || to < 0)
                return queue;
            if (from >= queue.length || to >= queue.length)
                return queue;
            const next = [...queue];
            const [moved] = next.splice(from, 1);
            next.splice(to, 0, moved);
            return next;
        }
        case "clear":
            return exports.EMPTY_STAGED_QUEUE;
    }
}
const stagedTotalBytes = (queue) => queue.reduce((sum, item) => sum + item.file.size, 0);
exports.stagedTotalBytes = stagedTotalBytes;
const isStagedBusy = (queue) => queue.some((item) => item.status === "normalising");
exports.isStagedBusy = isStagedBusy;
/** Ready to submit: non-empty, nothing still normalising, nothing failed. */
const isStagedReady = (queue) => queue.length > 0 && queue.every((item) => item.status === "ready");
exports.isStagedReady = isStagedReady;
