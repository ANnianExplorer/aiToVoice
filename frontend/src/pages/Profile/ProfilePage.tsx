import { Typography, Avatar, Card, Form, Input, Button, Upload, Space } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';

const { Title } = Typography;

export default function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>个人资料</Title>
      <Card style={{ background: '#181818', border: '1px solid #282828', maxWidth: 600 }}>
        <Space direction="vertical" size="large" style={{ width: '100%', alignItems: 'center' }}>
          <Avatar size={96} icon={<UserOutlined />} src={user?.avatarUrl} />
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />}>更换头像</Button>
          </Upload>
          <Form layout="vertical" style={{ width: '100%' }}>
            <Form.Item label="昵称">
              <Input defaultValue={user?.nickname} />
            </Form.Item>
            <Form.Item label="个人简介">
              <Input.TextArea defaultValue={user?.bio} rows={3} />
            </Form.Item>
            <Form.Item>
              <Button type="primary">保存修改</Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
