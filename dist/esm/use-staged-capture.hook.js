/**
 * @epicscrum/document-capture — React binding for the staged queue. Validates incoming files,
 * stages them immediately, then normalises each in the background.
 */
import { useCallback, useReducer, useState } from "react";
import { normaliseCaptureFile } from "./normaliser.js";
import { EMPTY_STAGED_QUEUE, isStagedBusy, isStagedReady, stagedQueueReducer, stagedTotalBytes, } from "./staged-queue.js";
import { validateCaptureFiles } from "./validation.js";
export function useStagedCapture() {
    const [items, dispatch] = useReducer(stagedQueueReducer, EMPTY_STAGED_QUEUE);
    const [rejections, setRejections] = useState([]);
    const addFiles = useCallback((incoming, options = {}) => {
        const { accepted, rejected } = validateCaptureFiles(items.map((item) => item.file), incoming);
        setRejections(rejected);
        const staged = accepted.map((file) => ({
            id: crypto.randomUUID(),
            file,
            status: "normalising",
        }));
        dispatch({ type: "add", items: staged });
        for (const item of staged) {
            normaliseCaptureFile(item.file, options).then((result) => dispatch({
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
        totalBytes: stagedTotalBytes(items),
        isBusy: isStagedBusy(items),
        isReady: isStagedReady(items),
        addFiles,
        remove: (id) => dispatch({ type: "remove", id }),
        reorder: (from, to) => dispatch({ type: "reorder", from, to }),
        clear: () => {
            dispatch({ type: "clear" });
            setRejections([]);
        },
    };
}
