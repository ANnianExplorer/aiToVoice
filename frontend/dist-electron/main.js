"use strict";
const electron = require("electron");
const path = require("path");
let mainWindow = null;
let tray = null;
function createWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    titleBarStyle: "hiddenInset",
    backgroundColor: "#121212",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, "../assets/icon.png")
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  mainWindow.on("minimize", (event) => {
    if (process.platform === "win32") {
      event.preventDefault();
      mainWindow == null ? void 0 : mainWindow.hide();
    }
  });
  registerGlobalShortcuts();
}
function registerGlobalShortcuts() {
  electron.globalShortcut.register("MediaPlayPause", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "play-pause");
  });
  electron.globalShortcut.register("MediaNextTrack", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "next");
  });
  electron.globalShortcut.register("MediaPreviousTrack", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "previous");
  });
  electron.globalShortcut.register("MediaStop", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "stop");
  });
  electron.globalShortcut.register("VolumeUp", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "volume-up");
  });
  electron.globalShortcut.register("VolumeDown", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "volume-down");
  });
  electron.globalShortcut.register("VolumeMute", () => {
    mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "mute");
  });
}
function createTray() {
  const icon = electron.nativeImage.createEmpty();
  tray = new electron.Tray(icon);
  const contextMenu = electron.Menu.buildFromTemplate([
    {
      label: "显示 AiToVoice",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.show();
        mainWindow == null ? void 0 : mainWindow.focus();
      }
    },
    { type: "separator" },
    {
      label: "播放/暂停",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "play-pause");
      }
    },
    {
      label: "下一首",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "next");
      }
    },
    {
      label: "上一首",
      click: () => {
        mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "previous");
      }
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        electron.app.quit();
      }
    }
  ]);
  tray.setToolTip("AiToVoice");
  tray.setContextMenu(contextMenu);
  tray.on("double-click", () => {
    mainWindow == null ? void 0 : mainWindow.show();
    mainWindow == null ? void 0 : mainWindow.focus();
  });
}
electron.ipcMain.on("window:minimize", () => mainWindow == null ? void 0 : mainWindow.minimize());
electron.ipcMain.on("window:maximize", () => {
  if (mainWindow == null ? void 0 : mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow == null ? void 0 : mainWindow.maximize();
  }
});
electron.ipcMain.on("window:close", () => mainWindow == null ? void 0 : mainWindow.close());
electron.ipcMain.on("window:hide", () => mainWindow == null ? void 0 : mainWindow.hide());
electron.ipcMain.handle("get-platform", () => process.platform);
electron.ipcMain.handle("get-app-version", () => electron.app.getVersion());
electron.app.whenReady().then(() => {
  createWindow();
  createTray();
});
electron.app.on("window-all-closed", () => {
  electron.globalShortcut.unregisterAll();
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.on("will-quit", () => {
  electron.globalShortcut.unregisterAll();
});
