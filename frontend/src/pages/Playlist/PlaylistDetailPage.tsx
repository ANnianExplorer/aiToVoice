import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

export default function PlaylistDetailPage() {
  const { id } = useParams();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>歌单详情</Title>
      <Text style={{ color: '#B3B3B3' }}>歌单 ID: {id} - 详情页面即将实现</Text>
    </div>
  );
}
