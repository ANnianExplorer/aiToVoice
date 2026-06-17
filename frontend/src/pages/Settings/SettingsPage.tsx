import { useEffect, useState } from 'react';
import { Typography, Card, Form, Switch, Select, Slider, message, Spin } from 'antd';
import { getSettings, updateSettings } from '../../api/settings';
import { useAuthStore } from '../../stores/authStore';

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
      message.success('设置已保存');
    } catch {
      message.error('保存失败');
    }
  };

  if (loading) return <Spin size="large" />;

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>设置</Title>
      <div style={{ maxWidth: 600 }}>
        <Card title="外观" style={{ background: '#181818', border: '1px solid #282828', marginBottom: 16 }}>
          <Form layout="vertical">
            <Form.Item label="主题">
              <Select defaultValue={settings?.theme || 'DARK'} onChange={(v) => handleUpdate('theme', v)}
                options={[
                  { value: 'DARK', label: '深色' },
                  { value: 'LIGHT', label: '浅色' },
                  { value: 'AUTO', label: '跟随系统' },
                ]} />
            </Form.Item>
            <Form.Item label="语言">
              <Select defaultValue={settings?.language || 'zh-CN'} onChange={(v) => handleUpdate('language', v)}
                options={[
                  { value: 'zh-CN', label: '简体中文' },
                  { value: 'en', label: 'English' },
                ]} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="音频" style={{ background: '#181818', border: '1px solid #282828', marginBottom: 16 }}>
          <Form layout="vertical">
            <Form.Item label="音频质量">
              <Select defaultValue={settings?.audioQuality || 'HIGH'} onChange={(v) => handleUpdate('audioQuality', v)}
                options={[
                  { value: 'LOW', label: '标准 (128kbps)' },
                  { value: 'HIGH', label: '高品质 (320kbps)' },
                  { value: 'LOSSLESS', label: '无损 (FLAC)' },
                ]} />
            </Form.Item>
            <Form.Item label="交叉淡入淡出">
              <Switch defaultChecked={settings?.crossfadeEnabled} onChange={(v) => handleUpdate('crossfadeEnabled', v)} />
            </Form.Item>
            <Form.Item label="歌词字体大小">
              <Slider min={12} max={32} defaultValue={settings?.lyricFontSize || 16}
                onChange={(v) => handleUpdate('lyricFontSize', v)} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="其他" style={{ background: '#181818', border: '1px solid #282828', marginBottom: 16 }}>
          <Form layout="vertical">
            <Form.Item label="通知">
              <Switch defaultChecked={settings?.notificationEnabled} onChange={(v) => handleUpdate('notificationEnabled', v)} />
            </Form.Item>
            <Form.Item label="启动时自动播放">
              <Switch defaultChecked={settings?.autoPlayOnLaunch} onChange={(v) => handleUpdate('autoPlayOnLaunch', v)} />
            </Form.Item>
          </Form>
        </Card>
        <Card title="账号" style={{ background: '#181818', border: '1px solid #282828' }}>
          <Text style={{ color: '#B3B3B3' }}>用户名: {user?.username}</Text><br />
          <Text style={{ color: '#B3B3B3' }}>邮箱: {user?.email}</Text>
        </Card>
      </div>
    </div>
  );
}
