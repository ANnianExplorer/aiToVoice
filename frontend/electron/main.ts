import { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage, dialog } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuitting = false; // 标记是否真正退出

function createWindow() {
  const iconPath = path.join(__dirname, '../assets/icon-256.png');

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
    icon: iconPath,
    show: false, // 等待 ready-to-show 再显示
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 窗口准备好后显示（避免白屏闪烁）
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // 关闭按钮 → 弹窗询问是否最小化到托盘
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();

      dialog.showMessageBox(mainWindow!, {
        type: 'question',
        buttons: ['最小化到托盘', '退出程序', '取消'],
        defaultId: 0,
        cancelId: 2,
        title: '关闭 AiToVoice',
        message: '你想要最小化到托盘还是退出程序？',
        detail: '最小化到托盘后，程序将在后台继续运行。',
      }).then(({ response }) => {
        if (response === 0) {
          // 最小化到托盘
          mainWindow?.hide();
        } else if (response === 1) {
          // 真正退出
          isQuitting = true;
          mainWindow?.close();
        }
        // response === 2: 取消，什么都不做
      });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // 注册媒体快捷键
  registerGlobalShortcuts();
}

function registerGlobalShortcuts() {
  const shortcuts: [string, () => void][] = [
    ['MediaPlayPause', () => mainWindow?.webContents.send('media-command', 'play-pause')],
    ['MediaNextTrack', () => mainWindow?.webContents.send('media-command', 'next')],
    ['MediaPreviousTrack', () => mainWindow?.webContents.send('media-command', 'previous')],
    ['MediaStop', () => mainWindow?.webContents.send('media-command', 'stop')],
    ['VolumeUp', () => mainWindow?.webContents.send('media-command', 'volume-up')],
    ['VolumeDown', () => mainWindow?.webContents.send('media-command', 'volume-down')],
    ['VolumeMute', () => mainWindow?.webContents.send('media-command', 'mute')],
  ];

  for (const [key, handler] of shortcuts) {
    try {
      globalShortcut.register(key, handler);
    } catch {
      // 某些快捷键可能已被占用
    }
  }
}

function createTray() {
  const trayIconPath = path.join(__dirname, '../assets/tray-icon-16.png');
  const trayIcon = nativeImage.createFromPath(trayIconPath);
  tray = new Tray(trayIcon.isEmpty() ? nativeImage.createEmpty() : trayIcon);

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
      click: () => mainWindow?.webContents.send('media-command', 'play-pause'),
    },
    {
      label: '下一首',
      click: () => mainWindow?.webContents.send('media-command', 'next'),
    },
    {
      label: '上一首',
      click: () => mainWindow?.webContents.send('media-command', 'previous'),
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        isQuitting = true;
        mainWindow?.close();
      },
    },
  ]);

  tray.setToolTip('AiToVoice');
  tray.setContextMenu(contextMenu);

  // 双击托盘图标 → 显示窗口
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
ipcMain.on('window:close', () => {
  // 触发 close 事件，由 close handler 处理弹窗
  mainWindow?.close();
});
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

app.on('before-quit', () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
});
