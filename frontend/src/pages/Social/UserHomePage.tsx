import { Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

export default function UserHomePage() {
  const { id } = useParams();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>用户主页</Title>
      <Text style={{ color: '#B3B3B3' }}>用户 ID: {id} - 用户主页即将实现</Text>
    </div>
  );
}
