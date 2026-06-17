"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // Platform info
  platform: process.platform,
  getAppVersion: () => electron.ipcRenderer.invoke("get-app-version"),
  // Window controls
  minimize: () => electron.ipcRenderer.send("window:minimize"),
  maximize: () => electron.ipcRenderer.send("window:maximize"),
  close: () => electron.ipcRenderer.send("window:close"),
  hide: () => electron.ipcRenderer.send("window:hide"),
  // Media commands from global shortcuts
  onMediaCommand: (callback) => {
    electron.ipcRenderer.on("media-command", (_event, command) => callback(command));
  },
  // Remove listener
  removeMediaCommandListener: () => {
    electron.ipcRenderer.removeAllListeners("media-command");
  }
});
