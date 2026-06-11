import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    frame: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#121212',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event: Electron.Event) => {
    if (process.platform === 'win32') {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  // Register global shortcuts
  registerGlobalShortcuts();
}

function registerGlobalShortcuts() {
  // Media controls
  globalShortcut.register('MediaPlayPause', () => {
    mainWindow?.webContents.send('media-command', 'play-pause');
  });
  globalShortcut.register('MediaNextTrack', () => {
    mainWindow?.webContents.send('media-command', 'next');
  });
  globalShortcut.register('MediaPreviousTrack', () => {
    mainWindow?.webContents.send('media-command', 'previous');
  });
  globalShortcut.register('MediaStop', () => {
    mainWindow?.webContents.send('media-command', 'stop');
  });

  // Volume
  globalShortcut.register('VolumeUp', () => {
    mainWindow?.webContents.send('media-command', 'volume-up');
  });
  globalShortcut.register('VolumeDown', () => {
    mainWindow?.webContents.send('media-command', 'volume-down');
  });
  globalShortcut.register('VolumeMute', () => {
    mainWindow?.webContents.send('media-command', 'mute');
  });
}

function createTray() {
  // Create a simple tray icon
  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 AiToVoice',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      },
    },
    { type: 'separator' },
    {
      label: '播放/暂停',
      click: () => {
        mainWindow?.webContents.send('media-command', 'play-pause');
      },
    },
    {
      label: '下一首',
      click: () => {
        mainWindow?.webContents.send('media-command', 'next');
      },
    },
    {
      label: '上一首',
      click: () => {
        mainWindow?.webContents.send('media-command', 'previous');
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('AiToVoice');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

// IPC handlers
ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window:close', () => mainWindow?.close());
ipcMain.on('window:hide', () => mainWindow?.hide());

ipcMain.handle('get-platform', () => process.platform);
ipcMain.handle('get-app-version', () => app.getVersion());

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on('window-all-closed', () => {
  globalShortcut.unregisterAll();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
