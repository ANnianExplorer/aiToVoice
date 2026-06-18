"use strict";
const electron = require("electron");
const path = require("path");
let mainWindow = null;
let tray = null;
let isQuitting = false;
function createWindow() {
  const iconPath = path.join(__dirname, "../assets/icon.png");
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
    icon: iconPath,
    show: false
    // 等待 ready-to-show 再显示
  });
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow == null ? void 0 : mainWindow.show();
  });
  mainWindow.on("close", (event) => {
    if (!isQuitting) {
      event.preventDefault();
      electron.dialog.showMessageBox(mainWindow, {
        type: "question",
        buttons: ["最小化到托盘", "退出程序", "取消"],
        defaultId: 0,
        cancelId: 2,
        title: "关闭 AiToVoice",
        message: "你想要最小化到托盘还是退出程序？",
        detail: "最小化到托盘后，程序将在后台继续运行。"
      }).then(({ response }) => {
        if (response === 0) {
          mainWindow == null ? void 0 : mainWindow.hide();
        } else if (response === 1) {
          isQuitting = true;
          mainWindow == null ? void 0 : mainWindow.close();
        }
      });
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  registerGlobalShortcuts();
}
function registerGlobalShortcuts() {
  const shortcuts = [
    ["MediaPlayPause", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "play-pause")],
    ["MediaNextTrack", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "next")],
    ["MediaPreviousTrack", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "previous")],
    ["MediaStop", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "stop")],
    ["VolumeUp", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "volume-up")],
    ["VolumeDown", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "volume-down")],
    ["VolumeMute", () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "mute")]
  ];
  for (const [key, handler] of shortcuts) {
    try {
      electron.globalShortcut.register(key, handler);
    } catch {
    }
  }
}
function createTray() {
  const trayIconPath = path.join(__dirname, "../assets/tray-icon.png");
  const trayIcon = electron.nativeImage.createFromPath(trayIconPath);
  tray = new electron.Tray(trayIcon.isEmpty() ? electron.nativeImage.createEmpty() : trayIcon);
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
      click: () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "play-pause")
    },
    {
      label: "下一首",
      click: () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "next")
    },
    {
      label: "上一首",
      click: () => mainWindow == null ? void 0 : mainWindow.webContents.send("media-command", "previous")
    },
    { type: "separator" },
    {
      label: "退出",
      click: () => {
        isQuitting = true;
        mainWindow == null ? void 0 : mainWindow.close();
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
electron.ipcMain.on("window:close", () => {
  mainWindow == null ? void 0 : mainWindow.close();
});
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
electron.app.on("before-quit", () => {
  isQuitting = true;
  electron.globalShortcut.unregisterAll();
});
