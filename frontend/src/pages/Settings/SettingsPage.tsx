import { useEffect, useState } from 'react';
import { Typography, Card, Form, Switch, Select, Slider, message, Spin } from 'antd';
import { getSettings, updateSettings } from '../../api/settings';
import { useAuthStore } from '../../stores/authStore';
import { useTheme } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;

interface Settings {
  theme: string;
  language: string;
  audioQuality: string;
  crossfadeEnabled: boolean;
  lyricFontSize: number;
  notificationEnabled: boolean;
  cacheMaxMb: number;
  autoPlayOnLaunch: boolean;
}

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { tokens, mode, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings().then(res => {
      setSettings(res);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (field: string, value: unknown) => {
    try {
      await updateSettings({ [field]: value });
      setSettings(prev => prev ? { ...prev, [field]: value } : prev);
      message.success('设置已保存');
    } catch {
      message.error('保存失败');
    }
  };

  const handleThemeChange = (value: string) => {
    const themeMode = value === 'LIGHT' ? 'light' : 'dark';
    setTheme(themeMode);
    handleUpdate('theme', value);
  };

  const cardStyle = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg,
    marginBottom: 16,
  };

  if (loading || !settings) return <Spin size="large" />;

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>设置</Title>
      <div style={{ maxWidth: 600 }}>
        <Card title="外观" style={cardStyle}>
          <Form layout="vertical">
            <Form.Item label="主题">
              <Select
                value={mode === 'dark' ? 'DARK' : 'LIGHT'}
                onChange={handleThemeChange}
                options={[
                  { value: 'DARK', label: '🌙 深色 (Spotify 风格)' },
                  { value: 'LIGHT', label: '☀️ 浅色 (苹果风格)' },
                ]}
              />
            </Form.Item>
            <Form.Item label="语言">
              <Select value={settings.language} onChange={(v) => handleUpdate('language', v)}
                options={[
                  { value: 'zh-CN', label: '简体中文' },
                  { value: 'en', label: 'English' },
                ]} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="音频" style={cardStyle}>
          <Form layout="vertical">
            <Form.Item label="音频质量">
              <Select value={settings.audioQuality} onChange={(v) => handleUpdate('audioQuality', v)}
                options={[
                  { value: 'LOW', label: '标准 (128kbps)' },
                  { value: 'HIGH', label: '高品质 (320kbps)' },
                  { value: 'LOSSLESS', label: '无损 (FLAC)' },
                ]} />
            </Form.Item>
            <Form.Item label="交叉淡入淡出">
              <Switch checked={settings.crossfadeEnabled} onChange={(v) => handleUpdate('crossfadeEnabled', v)} />
            </Form.Item>
            <Form.Item label="歌词字体大小">
              <Slider min={12} max={32} value={settings.lyricFontSize}
                onChange={(v) => handleUpdate('lyricFontSize', v)} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="其他" style={cardStyle}>
          <Form layout="vertical">
            <Form.Item label="通知">
              <Switch checked={settings.notificationEnabled} onChange={(v) => handleUpdate('notificationEnabled', v)} />
            </Form.Item>
            <Form.Item label="启动时自动播放">
              <Switch checked={settings.autoPlayOnLaunch} onChange={(v) => handleUpdate('autoPlayOnLaunch', v)} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="账号" style={cardStyle}>
          <Text style={{ color: tokens.textSecondary }}>用户名: {user?.username}</Text><br />
          <Text style={{ color: tokens.textSecondary }}>邮箱: {user?.email}</Text>
        </Card>
      </div>
    </div>
  );
}
