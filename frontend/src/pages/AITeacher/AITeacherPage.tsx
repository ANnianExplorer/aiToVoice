import { useState, useEffect, useRef } from 'react';
import { Typography, Button, Card, Input, List, Space, message } from 'antd';
import { RobotOutlined, SendOutlined, AudioOutlined } from '@ant-design/icons';
import { createSession, getMySessions, getSessionMessages, sendMessage } from '../../api/ai';

const { Title, Text, Paragraph } = Typography;

interface AiMsg {
  id: number;
  role: string;
  content: string;
  createdAt: string;
}

export default function AITeacherPage() {
  const [sessions, setSessions] = useState<{ id: number; title: string; sessionType: string }[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<AiMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMySessions().then(res => setSessions(res.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeSession) {
      getSessionMessages(activeSession).then(res => setMessages(res.data.data || [])).catch(() => {});
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewSession = async (type: string) => {
    try {
      const res = await createSession({ sessionType: type });
      const session = res.data.data;
      setSessions(prev => [session, ...prev]);
      setActiveSession(session.id);
    } catch {
      message.error('创建会话失败');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSession) return;
    setLoading(true);
    try {
      const res = await sendMessage(activeSession, input);
      setMessages(prev => [...prev, res.data.data]);
      setInput('');
    } catch {
      message.error('发送失败');
    } finally {
      setLoading(false);
    }
  };

  if (!activeSession) {
    return (
      <div>
        <Title level={2} style={{ color: '#fff' }}>AI 音乐老师</Title>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card style={{ background: '#181818', border: '1px solid #282828' }} hoverable
            onClick={() => handleNewSession('VOICE_COACH')}>
            <Space>
              <AudioOutlined style={{ fontSize: 48, color: '#1DB954' }} />
              <div>
                <Title level={4} style={{ color: '#fff' }}>声乐教练</Title>
                <Paragraph style={{ color: '#B3B3B3' }}>上传录音，AI 分析发声并给出专业建议</Paragraph>
              </div>
            </Space>
          </Card>
          <Card style={{ background: '#181818', border: '1px solid #282828' }} hoverable
            onClick={() => handleNewSession('GENERAL')}>
            <Space>
              <RobotOutlined style={{ fontSize: 48, color: '#1DB954' }} />
              <div>
                <Title level={4} style={{ color: '#fff' }}>音乐助手</Title>
                <Paragraph style={{ color: '#B3B3B3' }}>问任何音乐相关的问题</Paragraph>
              </div>
            </Space>
          </Card>
          {sessions.length > 0 && (
            <>
              <Title level={4} style={{ color: '#fff' }}>历史会话</Title>
              <List
                dataSource={sessions}
                renderItem={(s) => (
                  <List.Item style={{ background: '#181818', marginBottom: 4, borderRadius: 8, cursor: 'pointer', padding: '12px 16px' }}
                    onClick={() => setActiveSession(s.id)}>
                    <Text style={{ color: '#fff' }}>{s.title}</Text>
                    <Text style={{ color: '#6A6A6A' }}>{s.sessionType}</Text>
                  </List.Item>
                )}
              />
            </>
          )}
        </Space>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }}>
      <div style={{ marginBottom: 16 }}>
        <Button onClick={() => setActiveSession(null)} style={{ color: '#B3B3B3' }}>← 返回</Button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16, background: '#181818', borderRadius: 8 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'USER' ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}>
            <div style={{
              maxWidth: '70%',
              padding: '10px 16px',
              borderRadius: 12,
              background: msg.role === 'USER' ? '#1DB954' : '#282828',
              color: '#fff',
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入消息..."
          style={{ background: '#282828', border: 'none', borderRadius: 20 }}
        />
        <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={loading}>
          发送
        </Button>
      </div>
    </div>
  );
}
