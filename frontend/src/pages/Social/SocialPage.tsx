import { Typography, Tabs } from 'antd';
import { TeamOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function SocialPage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>社交</Title>
      <Tabs
        items={[
          { key: 'following', label: '关注', icon: <TeamOutlined />, children: <Text style={{ color: '#B3B3B3' }}>关注的用户</Text> },
          { key: 'followers', label: '粉丝', icon: <TeamOutlined />, children: <Text style={{ color: '#B3B3B3' }}>你的粉丝</Text> },
          { key: 'messages', label: '私信', icon: <MessageOutlined />, children: <Text style={{ color: '#B3B3B3' }}>私信列表</Text> },
        ]}
      />
    </div>
  );
}
