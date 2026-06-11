import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function HomePage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>发现音乐</Title>
      <Text style={{ color: '#B3B3B3' }}>每日推荐、热门歌单、新歌速递 - 即将实现</Text>
    </div>
  );
}
