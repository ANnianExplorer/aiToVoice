import { useState, useEffect, useRef } from 'react';
import { Typography, Button, Card, Input, List, Space, message, Avatar, Spin } from 'antd';
import { RobotOutlined, SendOutlined, AudioOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { createSession, getMySessions, getSessionMessages, sendMessage } from '../../api/ai';
import { useTheme } from '../../theme/ThemeProvider';
import type { AiSession, AiMessage } from '../../types';

const { Title, Text, Paragraph } = Typography;

export default function AITeacherPage() {
  const { tokens } = useTheme();
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMySessions().then(res => setSessions(res || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (activeSession) {
      getSessionMessages(activeSession).then(res => setMessages(res || [])).catch(() => {});
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewSession = async (type: string) => {
    try {
      const session = await createSession({ sessionType: type });
      setSessions(prev => [session, ...prev]);
      setActiveSession(session.id);
    } catch {
      message.error('创建会话失败');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeSession) return;
    const userContent = input.trim();
    setLoading(true);
    try {
      const userMsg: AiMessage = {
        id: Date.now(),
        sessionId: activeSession,
        role: 'USER',
        content: userContent,
        msgType: 'TEXT',
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
      setInput('');

      const msg = await sendMessage(activeSession, userContent);
      setMessages(prev => [...prev, msg]);
    } catch {
      message.error('发送失败');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg,
  };

  // ========== 会话选择页 ==========
  if (!activeSession) {
    return (
      <div className="page-enter">
        <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily, marginBottom: 24 }}>
          AI 音乐老师
        </Title>
        <Space direction="vertical" size="large" style={{ width: '100%', maxWidth: 600 }}>
          <Card style={{ ...cardStyle, cursor: 'pointer' }} hoverable
            onClick={() => handleNewSession('VOICE_COACH')}>
            <Space size={16}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: tokens.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <AudioOutlined style={{ fontSize: 28, color: tokens.accent }} />
              </div>
              <div>
                <Title level={4} style={{ color: tokens.textPrimary, margin: 0 }}>声乐教练</Title>
                <Paragraph style={{ color: tokens.textSecondary, margin: 0, fontSize: 13 }}>
                  上传录音，AI 分析发声并给出专业建议
                </Paragraph>
              </div>
            </Space>
          </Card>

          <Card style={{ ...cardStyle, cursor: 'pointer' }} hoverable
            onClick={() => handleNewSession('GENERAL')}>
            <Space size={16}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: tokens.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <RobotOutlined style={{ fontSize: 28, color: tokens.accent }} />
              </div>
              <div>
                <Title level={4} style={{ color: tokens.textPrimary, margin: 0 }}>音乐助手</Title>
                <Paragraph style={{ color: tokens.textSecondary, margin: 0, fontSize: 13 }}>
                  问任何音乐相关的问题，获取专业解答
                </Paragraph>
              </div>
            </Space>
          </Card>

          {sessions.length > 0 && (
            <>
              <Title level={4} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
                历史会话
              </Title>
              <List
                dataSource={sessions}
                renderItem={(s) => (
                  <List.Item
                    style={{
                      ...cardStyle, marginBottom: 8, cursor: 'pointer', padding: '14px 16px',
                    }}
                    onClick={() => setActiveSession(s.id)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={s.sessionType === 'VOICE_COACH' ? <AudioOutlined /> : <RobotOutlined />}
                          style={{ background: tokens.accentBg, color: tokens.accent }}
                        />
                      }
                      title={<Text style={{ color: tokens.textPrimary }}>{s.title || (s.sessionType === 'VOICE_COACH' ? '声乐教练' : '音乐助手')}</Text>}
                      description={
                        <Text style={{ color: tokens.textTertiary, fontSize: 12 }}>
                          {new Date(s.createdAt).toLocaleDateString()}
                        </Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          )}
        </Space>
      </div>
    );
  }

  // ========== 聊天页 ==========
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' }} className="page-enter">
      {/* 顶部 */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 12, borderBottom: `1px solid ${tokens.border}`,
      }}>
        <Space>
          <Button type="text" onClick={() => setActiveSession(null)}
            style={{ color: tokens.textSecondary }}>← 返回</Button>
          <Text style={{ color: tokens.textPrimary, fontWeight: 600 }}>
            {sessions.find(s => s.id === activeSession)?.title || 'AI 老师'}
          </Text>
        </Space>
        <Button type="text" icon={<PlusOutlined />}
          onClick={() => handleNewSession('GENERAL')}
          style={{ color: tokens.textSecondary }} title="新会话" />
      </div>

      {/* 消息列表 */}
      <div style={{
        flex: 1, overflow: 'auto', padding: 16,
        background: tokens.bgSecondary,
        borderRadius: tokens.borderRadiusLg,
        border: `1px solid ${tokens.border}`,
      }} className="hide-scrollbar">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <RobotOutlined style={{ fontSize: 48, color: tokens.accent, marginBottom: 16 }} />
            <Text style={{ color: tokens.textSecondary, display: 'block' }}>
              你好！我是你的 AI 音乐老师，有什么可以帮你的？
            </Text>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={msg.id} style={{
            display: 'flex',
            justifyContent: msg.role === 'USER' ? 'flex-end' : 'flex-start',
            marginBottom: 16,
            animation: `fadeInUp 0.3s ease-out ${i * 50}ms both`,
          }}>
            {msg.role !== 'USER' && (
              <Avatar
                icon={<RobotOutlined />}
                size={32}
                style={{ background: tokens.accentBg, color: tokens.accent, marginRight: 8, flexShrink: 0 }}
              />
            )}
            <div style={{
              maxWidth: '70%',
              padding: '10px 16px',
              borderRadius: msg.role === 'USER'
                ? `${tokens.borderRadiusLg}px ${tokens.borderRadiusLg}px 4px ${tokens.borderRadiusLg}px`
                : `${tokens.borderRadiusLg}px ${tokens.borderRadiusLg}px ${tokens.borderRadiusLg}px 4px`,
              background: msg.role === 'USER' ? tokens.accent : tokens.bgElevated,
              color: msg.role === 'USER' ? '#fff' : tokens.textPrimary,
              lineHeight: 1.6,
              fontSize: 14,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
            {msg.role === 'USER' && (
              <Avatar
                icon={<UserOutlined />}
                size={32}
                style={{ background: tokens.bgElevated, marginLeft: 8, flexShrink: 0 }}
              />
            )}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <Avatar icon={<RobotOutlined />} size={32}
              style={{ background: tokens.accentBg, color: tokens.accent }} />
            <div style={{
              background: tokens.bgElevated, padding: '10px 16px',
              borderRadius: `${tokens.borderRadiusLg}px ${tokens.borderRadiusLg}px ${tokens.borderRadiusLg}px 4px`,
            }}>
              <Spin size="small" />
              <Text style={{ color: tokens.textTertiary, marginLeft: 8, fontSize: 13 }}>思考中...</Text>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区 */}
      <div style={{
        display: 'flex', gap: 8, marginTop: 12,
        padding: '12px 0',
      }}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onPressEnter={handleSend}
          placeholder="输入消息..."
          size="large"
          style={{
            background: tokens.bgElevated,
            border: `1px solid ${tokens.border}`,
            borderRadius: 24,
            color: tokens.textPrimary,
          }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          size="large"
          style={{ borderRadius: 24, width: 48 }}
        />
      </div>
    </div>
  );
}
