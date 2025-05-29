const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectAndProcessFolder: (stockListStr) => ipcRenderer.invoke('select-and-process-folder', stockListStr),
  storeSet: (key, value) => ipcRenderer.invoke('store-set', key, value),
  storeGet: (key) => ipcRenderer.invoke('store-get', key),
  aiProcessUnrecognized: (stockListStr, folderPath) => ipcRenderer.invoke('ai-process-unrecognized', stockListStr, folderPath),
});
