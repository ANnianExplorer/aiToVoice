import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/authStore';

const { Title, Text } = Typography;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const onFinish = async (values: { username: string; email: string; password: string }) => {
    setLoading(true);
    try {
      await register(values.username, values.email, values.password);
      message.success('注册成功');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '注册失败';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#121212'
    }}>
      <div style={{ width: 400, padding: 40, background: '#181818', borderRadius: 12 }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1DB954' }}>
          AiToVoice
        </Title>
        <Text style={{ display: 'block', textAlign: 'center', color: '#B3B3B3', marginBottom: 32 }}>
          创建账号开始使用
        </Text>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="username" rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, max: 50, message: '用户名长度 3-50 个字符' }
          ]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" size="large" />
          </Form.Item>
          <Form.Item name="email" rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}>
            <Input prefix={<MailOutlined />} placeholder="邮箱" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少 6 个字符' }
          ]}>
            <Input.Password prefix={<LockOutlined />} placeholder="密码" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              注册
            </Button>
          </Form.Item>
        </Form>
        <Text style={{ color: '#B3B3B3' }}>
          已有账号？ <Link to="/login">立即登录</Link>
        </Text>
      </div>
    </div>
  );
}
