import { Button, Space } from 'antd';
import { MinusOutlined, BorderOutlined, CloseOutlined } from '@ant-design/icons';

export default function TitleBar() {
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  if (!isElectron) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        background: '#000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px',
        WebkitAppRegion: 'drag',
        zIndex: 9999,
      }}
    >
      <span style={{ color: '#1DB954', fontSize: 12, fontWeight: 600, marginLeft: 8 }}>
        AiToVoice
      </span>
      <Space size={0} style={{ WebkitAppRegion: 'no-drag' }}>
        <Button
          type="text"
          size="small"
          icon={<MinusOutlined />}
          onClick={() => window.electronAPI?.minimize()}
          style={{ color: '#B3B3B3', width: 32, height: 32 }}
        />
        <Button
          type="text"
          size="small"
          icon={<BorderOutlined />}
          onClick={() => window.electronAPI?.maximize()}
          style={{ color: '#B3B3B3', width: 32, height: 32 }}
        />
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={() => window.electronAPI?.close()}
          style={{ color: '#B3B3B3', width: 32, height: 32 }}
        />
      </Space>
    </div>
  );
}
