import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Window controls
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
  hide: () => ipcRenderer.send('window:hide'),

  // Media commands from global shortcuts
  onMediaCommand: (callback: (command: string) => void) => {
    ipcRenderer.on('media-command', (_event, command: string) => callback(command));
  },

  // Remove listener
  removeMediaCommandListener: () => {
    ipcRenderer.removeAllListeners('media-command');
  },
});
