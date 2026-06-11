import { Typography } from 'antd';

export default function PlayerBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px' }}>
      <Typography.Text style={{ color: '#B3B3B3' }}>
        选择一首歌曲开始播放
      </Typography.Text>
    </div>
  );
}
