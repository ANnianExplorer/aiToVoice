import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

export default function SongDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>歌曲详情</Title>
      <Text style={{ color: '#B3B3B3' }}>歌曲 ID: {id} - 详情页面即将实现</Text>
    </div>
  );
}
