import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import TitleBar from './TitleBar';
import PlayerBar from '../Player/PlayerBar';
import { useTheme } from '../../theme/ThemeProvider';

const { Content } = Layout;

export default function AppLayout() {
  const isElectron = typeof window !== 'undefined' && window.electronAPI;
  const titleBarHeight = isElectron ? 32 : 0;
  const { tokens, mode } = useTheme();

  return (
    <Layout style={{ height: '100vh', paddingTop: titleBarHeight }}>
      <TitleBar />
      <Layout.Sider
        width={240}
        style={{
          background: tokens.sidebarBg,
          backdropFilter: mode === 'light' ? `blur(${tokens.glassBlur}px)` : 'none',
          borderRight: `1px solid ${tokens.border}`,
        }}
      >
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{
          height: 64,
          padding: '0 24px',
          background: tokens.bgSecondary,
          borderBottom: `1px solid ${tokens.border}`,
        }}>
          <TopBar />
        </Layout.Header>
        <Content style={{
          overflow: 'auto',
          padding: 24,
          paddingBottom: 114,
          background: tokens.bgPrimary,
        }}>
          <Outlet />
        </Content>
      </Layout>
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        background: tokens.playerBg,
        borderTop: `1px solid ${tokens.playerBorder}`,
        backdropFilter: mode === 'light' ? `blur(${tokens.glassBlur}px)` : 'none',
        zIndex: 100,
      }}>
        <PlayerBar />
      </div>
    </Layout>
  );
}
