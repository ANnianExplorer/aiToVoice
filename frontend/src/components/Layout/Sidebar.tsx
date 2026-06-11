import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined, SearchOutlined, CustomerServiceOutlined,
  TrophyOutlined, TeamOutlined, RobotOutlined, AudioOutlined,
  SettingOutlined
} from '@ant-design/icons';

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: '首页' },
  { key: '/search', icon: <SearchOutlined />, label: '发现' },
  { key: '/library', icon: <CustomerServiceOutlined />, label: '音乐库' },
  { key: '/rankings', icon: <TrophyOutlined />, label: '排行榜' },
  { key: '/social', icon: <TeamOutlined />, label: '社交' },
  { key: '/ai-teacher', icon: <RobotOutlined />, label: 'AI 老师' },
  { key: '/studio', icon: <AudioOutlined />, label: '录音室' },
  { key: '/settings', icon: <SettingOutlined />, label: '设置' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 64, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#1DB954' }}>AiToVoice</span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ background: 'transparent', borderRight: 'none' }}
      />
    </div>
  );
}
