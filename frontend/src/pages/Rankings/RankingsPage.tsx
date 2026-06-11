import { Typography, Tabs } from 'antd';
import { FireOutlined, RocketOutlined, RiseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function RankingsPage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>排行榜</Title>
      <Tabs
        items={[
          { key: 'hot', label: '热歌榜', icon: <FireOutlined />, children: <Text style={{ color: '#B3B3B3' }}>热歌榜加载中...</Text> },
          { key: 'new', label: '新歌榜', icon: <RocketOutlined />, children: <Text style={{ color: '#B3B3B3' }}>新歌榜加载中...</Text> },
          { key: 'rising', label: '飙升榜', icon: <RiseOutlined />, children: <Text style={{ color: '#B3B3B3' }}>飙升榜加载中...</Text> },
        ]}
      />
    </div>
  );
}
