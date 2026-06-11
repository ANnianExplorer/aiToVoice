import { Typography, Button, Card, Space } from 'antd';
import { RobotOutlined, AudioOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function AITeacherPage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>AI 音乐老师</Title>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card style={{ background: '#181818', border: '1px solid #282828' }}>
          <Space>
            <RobotOutlined style={{ fontSize: 48, color: '#1DB954' }} />
            <div>
              <Title level={4} style={{ color: '#fff' }}>声乐教练</Title>
              <Paragraph style={{ color: '#B3B3B3' }}>
                上传你的录音，AI 会分析你的发声并给出专业建议
              </Paragraph>
              <Button type="primary" icon={<AudioOutlined />}>开始对话</Button>
            </div>
          </Space>
        </Card>
        <Card style={{ background: '#181818', border: '1px solid #282828' }}>
          <Space>
            <RobotOutlined style={{ fontSize: 48, color: '#1DB954' }} />
            <div>
              <Title level={4} style={{ color: '#fff' }}>音乐助手</Title>
              <Paragraph style={{ color: '#B3B3B3' }}>
                问任何音乐相关的问题，获取专业解答
              </Paragraph>
              <Button type="primary">开始对话</Button>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
