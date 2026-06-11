import { Typography, Button, Card, Row, Col, Space } from 'antd';
import { AudioOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const exercises = [
  { title: '音阶练习', desc: '基础音阶上下行练习', difficulty: 1 },
  { title: '长音保持', desc: '每个音保持10秒以上', difficulty: 2 },
  { title: '音准测试', desc: '跟着示例音高演唱', difficulty: 3 },
  { title: '节奏感训练', desc: '跟拍子演唱', difficulty: 2 },
];

export default function StudioPage() {
  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>录音室</Title>
      <Paragraph style={{ color: '#B3B3B3', marginBottom: 32 }}>
        录制你的演唱，获取 AI 发声分析和练习建议
      </Paragraph>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card style={{ background: '#181818', border: '1px solid #282828', textAlign: 'center' }}>
          <AudioOutlined style={{ fontSize: 64, color: '#1DB954' }} />
          <Title level={3} style={{ color: '#fff', marginTop: 16 }}>开始录音</Title>
          <Button type="primary" size="large" icon={<AudioOutlined />}>
            点击录制
          </Button>
        </Card>
        <Title level={3} style={{ color: '#fff' }}>练习任务</Title>
        <Row gutter={[16, 16]}>
          {exercises.map((ex, i) => (
            <Col span={6} key={i}>
              <Card
                style={{ background: '#181818', border: '1px solid #282828' }}
                hoverable
              >
                <Title level={5} style={{ color: '#fff' }}>{ex.title}</Title>
                <Text style={{ color: '#B3B3B3' }}>{ex.desc}</Text>
                <br />
                <Text style={{ color: '#1DB954' }}>难度: {'⭐'.repeat(ex.difficulty)}</Text>
                <br />
                <Button type="link" icon={<PlayCircleOutlined />} style={{ padding: 0, marginTop: 8 }}>
                  开始练习
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </div>
  );
}
