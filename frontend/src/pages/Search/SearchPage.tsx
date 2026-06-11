import { Typography, Input, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';

const { Title, Text } = Typography;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div>
      <Title level={2} style={{ color: '#fff' }}>发现</Title>
      <Input
        prefix={<SearchOutlined />}
        placeholder="搜索歌曲、歌手、歌单..."
        size="large"
        defaultValue={query}
        onPressEnter={(e) => setSearchParams({ q: (e.target as HTMLInputElement).value })}
        style={{ background: '#282828', border: 'none', borderRadius: 20, maxWidth: 600, marginBottom: 24 }}
      />
      <Tabs
        items={[
          { key: 'songs', label: '歌曲', children: <Text style={{ color: '#B3B3B3' }}>搜索结果将在这里显示</Text> },
          { key: 'playlists', label: '歌单', children: <Text style={{ color: '#B3B3B3' }}>歌单搜索结果</Text> },
          { key: 'artists', label: '歌手', children: <Text style={{ color: '#B3B3B3' }}>歌手搜索结果</Text> },
        ]}
      />
    </div>
  );
}
