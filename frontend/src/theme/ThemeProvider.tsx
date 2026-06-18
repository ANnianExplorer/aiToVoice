import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { darkTokens, lightTokens, type ThemeTokens } from './tokens';

type ThemeMode = 'dark' | 'light';

interface ThemeContextValue {
  mode: ThemeMode;
  tokens: ThemeTokens;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'theme-mode';

function loadThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return 'dark'; // 默认暗色
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(loadThemeMode);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const tokens = mode === 'dark' ? darkTokens : lightTokens;

  const toggleTheme = () => setMode(m => m === 'dark' ? 'light' : 'dark');
  const setTheme = (m: ThemeMode) => setMode(m);

  // Ant Design 主题配置
  const antThemeConfig = {
    token: {
      colorPrimary: tokens.accent,
      borderRadius: tokens.borderRadius,
      fontFamily: tokens.fontFamily,
      colorBgContainer: tokens.bgSecondary,
      colorBgElevated: tokens.bgElevated,
      colorText: tokens.textPrimary,
      colorTextSecondary: tokens.textSecondary,
      colorBorder: tokens.border,
      colorSuccess: tokens.success,
      colorWarning: tokens.warning,
      colorError: tokens.error,
      colorInfo: tokens.info,
    },
    algorithm: mode === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
  };

  return (
    <ThemeContext.Provider value={{ mode, tokens, toggleTheme, setTheme }}>
      <ConfigProvider locale={zhCN} theme={antThemeConfig}>
        {/* 注入 CSS 变量 */}
        <style>{`
          :root {
            --bg-primary: ${tokens.bgPrimary};
            --bg-secondary: ${tokens.bgSecondary};
            --bg-elevated: ${tokens.bgElevated};
            --bg-card: ${tokens.bgCard};
            --bg-hover: ${tokens.bgHover};
            --bg-active: ${tokens.bgActive};
            --text-primary: ${tokens.textPrimary};
            --text-secondary: ${tokens.textSecondary};
            --text-tertiary: ${tokens.textTertiary};
            --accent: ${tokens.accent};
            --accent-hover: ${tokens.accentHover};
            --accent-bg: ${tokens.accentBg};
            --border: ${tokens.border};
            --border-light: ${tokens.borderLight};
            --shadow: ${tokens.shadow};
            --shadow-elevated: ${tokens.shadowElevated};
            --player-bg: ${tokens.playerBg};
            --player-border: ${tokens.playerBorder};
            --sidebar-bg: ${tokens.sidebarBg};
            --sidebar-active: ${tokens.sidebarActive};
            --glass-bg: ${tokens.glassBg};
            --glass-blur: ${tokens.glassBlur}px;
            --radius: ${tokens.borderRadius}px;
            --radius-lg: ${tokens.borderRadiusLg}px;
            --font-family: ${tokens.fontFamily};
            --transition: all 0.3s ease;
          }
          body {
            font-family: var(--font-family);
            background: var(--bg-primary);
            color: var(--text-primary);
            transition: background 0.3s ease, color 0.3s ease;
          }
        `}</style>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
