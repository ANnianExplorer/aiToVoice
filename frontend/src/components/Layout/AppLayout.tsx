import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PlayerBar from '../Player/PlayerBar';

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Sider width={240} style={{ background: '#000000' }}>
        <Sidebar />
      </Layout.Sider>
      <Layout>
        <Layout.Header style={{ height: 64, padding: '0 24px', background: '#181818' }}>
          <TopBar />
        </Layout.Header>
        <Content style={{ overflow: 'auto', padding: 24, background: '#121212' }}>
          <Outlet />
        </Content>
      </Layout>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 90,
        background: '#181818', borderTop: '1px solid #282828', zIndex: 100
      }}>
        <PlayerBar />
      </div>
    </Layout>
  );
}
