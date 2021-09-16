// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from 'electron';

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once('loaded', () => {
    contextBridge.exposeInMainWorld('electron', {
        send: (channel: string, data: any) => {
            // whitelist channels
            let validChannels = ['get-api-details'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel: string, func: any) => {
            let validChannels = ['api-details', 'api-details-error'];
            if (validChannels.includes(channel)) {
                // deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        versions: process.versions,
    });
});
