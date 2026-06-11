import { Typography, Card, Form, Switch, Select, Slider, Button, Space, Divider } from 'antd';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>设置</Title>
      <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600 }}>
        <Card title="外观" style={{ background: '#181818', border: '1px solid #282828' }}>
          <Form layout="vertical">
            <Form.Item label="主题">
              <Select defaultValue="dark" options={[
                { value: 'dark', label: '深色' },
                { value: 'light', label: '浅色' },
                { value: 'auto', label: '跟随系统' },
              ]} />
            </Form.Item>
            <Form.Item label="语言">
              <Select defaultValue="zh-CN" options={[
                { value: 'zh-CN', label: '简体中文' },
                { value: 'en', label: 'English' },
              ]} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="音频" style={{ background: '#181818', border: '1px solid #282828' }}>
          <Form layout="vertical">
            <Form.Item label="音频质量">
              <Select defaultValue="HIGH" options={[
                { value: 'LOW', label: '标准 (128kbps)' },
                { value: 'HIGH', label: '高品质 (320kbps)' },
                { value: 'LOSSLESS', label: '无损 (FLAC)' },
              ]} />
            </Form.Item>
            <Form.Item label="交叉淡入淡出">
              <Switch defaultChecked={false} />
            </Form.Item>
            <Form.Item label="歌词字体大小">
              <Slider min={12} max={32} defaultValue={16} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="账号" style={{ background: '#181818', border: '1px solid #282828' }}>
          <Text style={{ color: '#B3B3B3' }}>用户名: {user?.username}</Text>
          <br />
          <Text style={{ color: '#B3B3B3' }}>邮箱: {user?.email}</Text>
          <Divider />
          <Button type="primary" danger>退出登录</Button>
        </Card>
      </Space>
    </div>
  );
}
