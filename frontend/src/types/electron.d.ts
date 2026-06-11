interface ElectronAPI {
  platform: string;
  getAppVersion: () => Promise<string>;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  hide: () => void;
  onMediaCommand: (callback: (command: string) => void) => void;
  removeMediaCommandListener: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
