import * as time from "./time";

const debugContentProviders : Array<Function> = [];
let nextUpdateTimeMsec: number = 0;
const UPDATE_PERIOD_MSEC = 1000;
export const DEBUG_INFO_CONTENT_DIV_ID = "debug_info_content";

// export function isLocalDevMode() {
//     // local dev mode when hot reload is present
//     return (typeof window.webpackHotUpdate === "function");
// }

export function registerDebugContentProvider(provider: Function) {
    debugContentProviders.push(provider);
}

export function render_debug(tick: number) {
    const div = document.getElementById(DEBUG_INFO_CONTENT_DIV_ID);
    if (div) {
        const currentTimeMsec = time.getMsecTimestamp();
        if (nextUpdateTimeMsec === 0 || currentTimeMsec > nextUpdateTimeMsec) {
            nextUpdateTimeMsec = currentTimeMsec + UPDATE_PERIOD_MSEC;
            let content = "";
            for (const provider of debugContentProviders) {
                content += provider() + "<br>";
            }
            div.innerHTML = content;
        }
    } else {
        nextUpdateTimeMsec = 0;
    }
}
