import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

export default function MessagePage() {
  const { id } = useParams();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>私信</Title>
      <Text style={{ color: '#B3B3B3' }}>与用户 {id} 的对话 - 即将实现</Text>
    </div>
  );
}
