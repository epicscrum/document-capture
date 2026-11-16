"use strict";
/**
 * @epicscrum/document-capture — React binding for the staged queue. Validates incoming files,
 * stages them immediately, then normalises each in the background.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useStagedCapture = useStagedCapture;
const react_1 = require("react");
const normaliser_js_1 = require("./normaliser.js");
const staged_queue_js_1 = require("./staged-queue.js");
const validation_js_1 = require("./validation.js");
function useStagedCapture() {
    const [items, dispatch] = (0, react_1.useReducer)(staged_queue_js_1.stagedQueueReducer, staged_queue_js_1.EMPTY_STAGED_QUEUE);
    const [rejections, setRejections] = (0, react_1.useState)([]);
    const addFiles = (0, react_1.useCallback)((incoming, options = {}) => {
        const { accepted, rejected } = (0, validation_js_1.validateCaptureFiles)(items.map((item) => item.file), incoming);
        setRejections(rejected);
        const staged = accepted.map((file) => ({
            id: crypto.randomUUID(),
            file,
            status: "normalising",
        }));
        dispatch({ type: "add", items: staged });
        for (const item of staged) {
            (0, normaliser_js_1.normaliseCaptureFile)(item.file, options).then((result) => dispatch({
                type: "resolve",
                id: item.id,
                file: result.file,
                sha256: result.sha256,
                normalised: result.normalised,
            }), (error) => dispatch({
                type: "fail",
                id: item.id,
                error: error instanceof Error ? error.message : "Capture failed",
            }));
        }
    }, [items]);
    return {
        items,
        rejections,
        totalBytes: (0, staged_queue_js_1.stagedTotalBytes)(items),
        isBusy: (0, staged_queue_js_1.isStagedBusy)(items),
        isReady: (0, staged_queue_js_1.isStagedReady)(items),
        addFiles,
        remove: (id) => dispatch({ type: "remove", id }),
        reorder: (from, to) => dispatch({ type: "reorder", from, to }),
        clear: () => {
            dispatch({ type: "clear" });
            setRejections([]);
        },
    };
}
