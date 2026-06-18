import { Input, Avatar, Dropdown, Space } from 'antd';
import { SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeProvider';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { tokens } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const dropdownItems = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: '个人资料', onClick: () => navigate('/profile') },
      { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: handleLogout },
    ],
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
      <Input
        prefix={<SearchOutlined style={{ color: tokens.textTertiary }} />}
        placeholder="搜索歌曲、歌手、歌单..."
        style={{
          width: 400,
          background: tokens.bgElevated,
          border: `1px solid ${tokens.border}`,
          borderRadius: 20,
          color: tokens.textPrimary,
        }}
        onPressEnter={(e) => navigate(`/search?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`)}
      />
      <Dropdown menu={dropdownItems} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar size={32} icon={<UserOutlined />} src={user?.avatarUrl} />
          <span style={{ color: tokens.textSecondary }}>
            {user?.nickname || user?.username}
          </span>
        </Space>
      </Dropdown>
    </div>
  );
}
