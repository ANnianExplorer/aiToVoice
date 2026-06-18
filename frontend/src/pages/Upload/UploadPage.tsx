import { useState, useEffect } from 'react';
import { Typography, Input, Select, Button, message, Card, Space } from 'antd';
import { InboxOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useTheme } from '../../theme/ThemeProvider';

const { Title, Text } = Typography;

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
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    client.get('/genres').then(r => setGenres(r.data?.data || [])).catch(() => {});
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
    }
  };

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
    <div className="page-enter">
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>
        上传歌曲
      </Title>
      <Text style={{ color: tokens.textSecondary, display: 'block', marginBottom: 24 }}>
        上传本地音频文件到曲库
      </Text>

      <div style={{ maxWidth: 500 }}>
        <Card style={cardStyle}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 拖拽上传区域 */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragOver ? tokens.accent : tokens.border}`,
                borderRadius: tokens.borderRadiusLg,
                padding: '40px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: dragOver ? tokens.accentBg : 'transparent',
                transition: 'all 0.3s ease',
              }}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".mp3,.flac,.wav,.aac,.ogg,.m4a"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
              {file ? (
                <Space direction="vertical">
                  <Text style={{ color: tokens.accent, fontSize: 16 }}>🎵 {file.name}</Text>
                  <Text style={{ color: tokens.textTertiary }}>
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </Text>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    style={{ color: tokens.error }}
                  >
                    移除
                  </Button>
                </Space>
              ) : (
                <>
                  <InboxOutlined style={{ fontSize: 48, color: tokens.accent, marginBottom: 12 }} />
                  <Text style={{ color: tokens.textPrimary, display: 'block', fontSize: 16 }}>
                    点击或拖拽音频文件到此区域
                  </Text>
                  <Text style={{ color: tokens.textTertiary, display: 'block', marginTop: 4 }}>
                    支持 MP3, FLAC, WAV, AAC, OGG, M4A，最大 50MB
                  </Text>
                </>
              )}
            </div>

            {/* 歌曲名称 */}
            <div>
              <Text style={{ color: tokens.textSecondary, marginBottom: 8, display: 'block' }}>
                歌曲名称 *
              </Text>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入歌曲名称"
                size="large"
                style={{
                  background: tokens.bgElevated,
                  border: `1px solid ${tokens.border}`,
                  color: tokens.textPrimary,
                }}
              />
            </div>

            {/* 流派选择 */}
            <div>
              <Text style={{ color: tokens.textSecondary, marginBottom: 8, display: 'block' }}>
                流派
              </Text>
              <Select
                placeholder="选择流派（可选）"
                value={genreId}
                onChange={setGenreId}
                allowClear
                size="large"
                style={{ width: '100%' }}
                options={genres.map(g => ({ value: g.id, label: g.name }))}
              />
            </div>

            {/* 上传按钮 */}
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
