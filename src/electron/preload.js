const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectAndProcessFolder: () => ipcRenderer.invoke('select-and-process-folder')
});
