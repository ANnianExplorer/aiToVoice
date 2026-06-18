import { useState, useEffect } from 'react';
import { Typography, Upload, Input, Select, Button, message, Card, Space } from 'antd';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useTheme } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface Genre {
  id: number;
  name: string;
}

export default function UploadPage() {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreId, setGenreId] = useState<number | undefined>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    client.get('/genres').then(r => setGenres(r.data.data)).catch(() => {});
  }, []);

  const handleUpload = async () => {
    if (!file) { message.warning('请选择音频文件'); return; }
    if (!title.trim()) { message.warning('请输入歌曲名称'); return; }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title.trim());
    if (genreId) formData.append('genreId', genreId.toString());

    setUploading(true);
    try {
      await client.post('/songs/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      message.success('上传成功！');
      navigate('/');
    } catch {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  const cardStyle = {
    background: tokens.bgCard,
    border: `1px solid ${tokens.border}`,
    borderRadius: tokens.borderRadiusLg,
  };

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
        上传歌曲
      </Title>
      <Text style={{ color: tokens.textSecondary, display: 'block', marginBottom: 24 }}>
        上传本地音频文件到曲库
      </Text>

      <div style={{ maxWidth: 500 }}>
        <Card style={cardStyle}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Dragger
              accept=".mp3,.flac,.wav,.aac,.ogg,.m4a"
              maxCount={1}
              beforeUpload={(f) => {
                setFile(f);
                // 自动填充标题（去掉扩展名）
                const name = f.name.replace(/\.[^.]+$/, '');
                if (!title) setTitle(name);
                return false; // 阻止自动上传
              }}
              onRemove={() => setFile(null)}
              fileList={file ? [file as any] : []}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: tokens.accent }} />
              </p>
              <p className="ant-upload-text" style={{ color: tokens.textPrimary }}>
                点击或拖拽音频文件到此区域
              </p>
              <p className="ant-upload-hint" style={{ color: tokens.textTertiary }}>
                支持 MP3, FLAC, WAV, AAC, OGG, M4A 格式，最大 50MB
              </p>
            </Dragger>

            <div>
              <Text style={{ color: tokens.textSecondary, marginBottom: 4, display: 'block' }}>
                歌曲名称 *
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入歌曲名称"
                style={{ background: tokens.bgElevated, border: `1px solid ${tokens.border}` }}
              />
            </div>

            <div>
              <Text style={{ color: tokens.textSecondary, marginBottom: 4, display: 'block' }}>
                流派
              </Text>
              <Select
                placeholder="选择流派（可选）"
                value={genreId}
                onChange={setGenreId}
                allowClear
                style={{ width: '100%' }}
                options={genres.map(g => ({ value: g.id, label: g.name }))}
              />
            </div>

            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={handleUpload}
              loading={uploading}
              disabled={!file || !title.trim()}
              size="large"
              block
            >
              {uploading ? '上传中...' : '上传'}
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}
