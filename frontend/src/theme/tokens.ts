/**
 * 设计 Token 定义
 * 暗色主题 → Spotify 风格
 * 亮色主题 → 苹果风
 */

export interface ThemeTokens {
  // 背景
  bgPrimary: string;
  bgSecondary: string;
  bgElevated: string;
  bgCard: string;
  bgHover: string;
  bgActive: string;

  // 文字
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;

  // 品牌色
  accent: string;
  accentHover: string;
  accentBg: string;

  // 功能色
  success: string;
  warning: string;
  error: string;
  info: string;

  // 边框
  border: string;
  borderLight: string;

  // 阴影
  shadow: string;
  shadowElevated: string;

  // 播放器
  playerBg: string;
  playerBorder: string;

  // 侧边栏
  sidebarBg: string;
  sidebarActive: string;

  // 圆角
  borderRadius: number;
  borderRadiusLg: number;

  // 字体
  fontFamily: string;

  // 毛玻璃
  glassBg: string;
  glassBlur: number;
}

/** 暗色主题 — Spotify 风格 */
export const darkTokens: ThemeTokens = {
  bgPrimary: '#121212',
  bgSecondary: '#181818',
  bgElevated: '#282828',
  bgCard: '#181818',
  bgHover: '#282828',
  bgActive: '#333333',

  textPrimary: '#ffffff',
  textSecondary: '#B3B3B3',
  textTertiary: '#6A6A6A',
  textInverse: '#121212',

  accent: '#1DB954',
  accentHover: '#1ed760',
  accentBg: 'rgba(29, 185, 84, 0.1)',

  success: '#1DB954',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',

  border: '#282828',
  borderLight: '#333333',

  shadow: '0 2px 8px rgba(0,0,0,0.3)',
  shadowElevated: '0 8px 24px rgba(0,0,0,0.5)',

  playerBg: '#181818',
  playerBorder: '#282828',

  sidebarBg: '#000000',
  sidebarActive: '#282828',

  borderRadius: 8,
  borderRadiusLg: 12,

  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

  glassBg: 'rgba(24, 24, 24, 0.8)',
  glassBlur: 0,
};

/** 亮色主题 — 苹果风 */
export const lightTokens: ThemeTokens = {
  bgPrimary: '#f5f5f7',
  bgSecondary: '#ffffff',
  bgElevated: '#ffffff',
  bgCard: '#ffffff',
  bgHover: '#f0f0f2',
  bgActive: '#e8e8ed',

  textPrimary: '#1d1d1f',
  textSecondary: '#6e6e73',
  textTertiary: '#aeaeb2',
  textInverse: '#ffffff',

  accent: '#0071e3',
  accentHover: '#0077ed',
  accentBg: 'rgba(0, 113, 227, 0.08)',

  success: '#34c759',
  warning: '#ff9f0a',
  error: '#ff3b30',
  info: '#007aff',

  border: '#d2d2d7',
  borderLight: '#e5e5ea',

  shadow: '0 1px 3px rgba(0,0,0,0.08)',
  shadowElevated: '0 4px 12px rgba(0,0,0,0.1)',

  playerBg: 'rgba(255, 255, 255, 0.72)',
  playerBorder: 'rgba(0, 0, 0, 0.06)',

  sidebarBg: 'rgba(255, 255, 255, 0.6)',
  sidebarActive: 'rgba(0, 0, 0, 0.04)',

  borderRadius: 12,
  borderRadiusLg: 16,

  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",

  glassBg: 'rgba(255, 255, 255, 0.72)',
  glassBlur: 20,
};
