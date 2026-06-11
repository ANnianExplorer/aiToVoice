import { Typography, Tabs } from 'antd';
import { HeartOutlined, HistoryOutlined, CustomerServiceOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function LibraryPage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>我的音乐库</Title>
      <Tabs
        items={[
          { key: 'favorites', label: '我喜欢的', icon: <HeartOutlined />, children: <Text style={{ color: '#B3B3B3' }}>收藏的歌曲将在这里显示</Text> },
          { key: 'history', label: '最近播放', icon: <HistoryOutlined />, children: <Text style={{ color: '#B3B3B3' }}>播放历史将在这里显示</Text> },
          { key: 'local', label: '本地音乐', icon: <CustomerServiceOutlined />, children: <Text style={{ color: '#B3B3B3' }}>本地导入的音乐</Text> },
        ]}
      />
    </div>
  );
}
