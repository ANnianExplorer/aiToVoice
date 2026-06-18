import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Typography, Button, Card, Row, Col, Space, Progress, Tag,
  message, Spin, Modal, Statistic, List,
} from 'antd';
import {
  AudioOutlined, PauseOutlined,
  CheckCircleOutlined, FireOutlined, SoundOutlined,
  TrophyOutlined, ReloadOutlined,
} from '@ant-design/icons';
import {
  getExercises, uploadRecord, analyzeRecord, getMyRecords, getMyProgress, submitPractice,
} from '../../api/voice';
import { useTheme } from '../../theme/ThemeProvider';
import type { VoiceExercise, VoiceRecord, AnalysisResult, PracticeProgress } from '../../api/voice';

const { Title, Text, Paragraph } = Typography;

const difficultyStars = (d: number) => '⭐'.repeat(Math.min(d, 5));

const typeLabels: Record<string, { color: string; label: string }> = {
  PITCH: { color: 'green', label: '音准' },
  BREATH: { color: 'blue', label: '气息' },
  RHYTHM: { color: 'orange', label: '节奏' },
  VIBRATO: { color: 'purple', label: '颤音' },
};

export default function StudioPage() {
  const { tokens } = useTheme();
  const [exercises, setExercises] = useState<VoiceExercise[]>([]);
  const [records, setRecords] = useState<VoiceRecord[]>([]);
  const [progress, setProgress] = useState<PracticeProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<VoiceExercise | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [exs, recs, prog] = await Promise.all([
        getExercises(),
        getMyRecords().catch(() => []),
        getMyProgress().catch(() => []),
      ]);
      setExercises(exs);
      setRecords(recs);
      setProgress(prog);
    } catch {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus' : 'audio/webm',
      });
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100);
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      setAnalysisResult(null);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch {
      message.error('无法访问麦克风，请检查权限设置');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }
  }, [isRecording]);

  const handleUploadAndAnalyze = async () => {
    if (!audioBlob) return;
    const file = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
    try {
      setUploading(true);
      const record = await uploadRecord(file, selectedExercise?.id);
      setRecords(prev => [record, ...prev]);
      setUploading(false);
      setAnalyzing(true);
      const result = await analyzeRecord(record.id);
      setAnalysisResult(result);
      setResultModalOpen(true);
      if (selectedExercise) {
        await submitPractice(selectedExercise.id, record.id);
        setProgress(await getMyProgress());
      }
      setRecords(await getMyRecords());
    } catch {
      message.error('上传或分析失败');
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const formatTime = (sec: number) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  const getExerciseProgress = (id: number) => progress.find(p => p.exerciseId === id);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 120 }}><Spin size="large" /></div>;
  }

  return (
    <div>
      <Title level={2} style={{ color: tokens.textPrimary, fontFamily: tokens.fontFamily }}>录音室</Title>
      <Paragraph style={{ color: tokens.textSecondary, marginBottom: 32 }}>
        录制你的演唱，获取 AI 发声分析和练习建议
      </Paragraph>

      {/* 录音区域 */}
      <Card style={{
        background: tokens.bgCard,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.borderRadiusLg,
        marginBottom: 24,
      }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          {selectedExercise && (
            <div style={{ marginBottom: 16 }}>
              <Tag color={typeLabels[selectedExercise.type]?.color}>
                {typeLabels[selectedExercise.type]?.label}
              </Tag>
              <Text style={{ color: tokens.textPrimary, fontSize: 16 }}>
                当前练习：{selectedExercise.title}
              </Text>
            </div>
          )}
          {(isRecording || audioBlob) && (
            <div style={{ marginBottom: 16 }}>
              <Text style={{
                color: isRecording ? tokens.error : tokens.accent,
                fontSize: 36, fontFamily: 'monospace', fontWeight: 600,
              }}>
                {formatTime(recordingTime)}
              </Text>
            </div>
          )}
          {isRecording && (
            <div style={{ marginBottom: 16 }}>
              <SoundOutlined style={{ fontSize: 32, color: tokens.error, animation: 'pulse 1s infinite' }} />
            </div>
          )}
          <Space size="large">
            {!isRecording && !audioBlob && (
              <Button type="primary" size="large" icon={<AudioOutlined />}
                onClick={startRecording}
                style={{ height: 56, fontSize: 18, paddingInline: 32 }}>
                开始录音
              </Button>
            )}
            {isRecording && (
              <Button danger size="large" icon={<PauseOutlined />}
                onClick={stopRecording}
                style={{ height: 56, fontSize: 18, paddingInline: 32 }}>
                停止录音
              </Button>
            )}
            {audioBlob && !isRecording && (
              <>
                <audio src={audioUrl ?? undefined} controls style={{ height: 40 }} />
                <Button type="primary" size="large" icon={<FireOutlined />}
                  onClick={handleUploadAndAnalyze} loading={uploading || analyzing}
                  style={{ height: 48, fontSize: 16 }}>
                  {uploading ? '上传中...' : analyzing ? '分析中...' : '上传并分析'}
                </Button>
                <Button size="large" icon={<ReloadOutlined />}
                  onClick={() => { setAudioBlob(null); setAudioUrl(null); setRecordingTime(0); setAnalysisResult(null); }}
                  style={{ height: 48 }}>
                  重新录制
                </Button>
              </>
            )}
          </Space>
        </div>
      </Card>

      {/* 练习任务 */}
      <Title level={3} style={{ color: tokens.textPrimary, marginBottom: 16, fontFamily: tokens.fontFamily }}>
        练习任务
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {exercises.map((ex) => {
          const prog = getExerciseProgress(ex.id);
          const isSelected = selectedExercise?.id === ex.id;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={ex.id}>
              <Card
                style={{
                  background: isSelected ? tokens.accentBg : tokens.bgCard,
                  border: `1px solid ${isSelected ? tokens.accent : tokens.border}`,
                  borderRadius: tokens.borderRadiusLg,
                  cursor: 'pointer',
                }}
                hoverable
                onClick={() => setSelectedExercise(ex)}
              >
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <Space>
                    <Tag color={typeLabels[ex.type]?.color} style={{ margin: 0 }}>
                      {typeLabels[ex.type]?.label}
                    </Tag>
                    <Text style={{ color: tokens.textPrimary, fontWeight: 600 }}>{ex.title}</Text>
                  </Space>
                  <Text style={{ color: tokens.textSecondary, fontSize: 13 }}>{ex.description}</Text>
                  <Text style={{ color: tokens.accent, fontSize: 12 }}>
                    难度: {difficultyStars(ex.difficulty)}
                  </Text>
                  {prog && (
                    <div style={{ marginTop: 4 }}>
                      <Space size={8}>
                        {prog.status === 'COMPLETED' && <CheckCircleOutlined style={{ color: tokens.success }} />}
                        <Text style={{ color: tokens.textSecondary, fontSize: 12 }}>
                          最高分: {prog.bestScore ?? '-'} | 尝试: {prog.attemptsCount}
                        </Text>
                      </Space>
                    </div>
                  )}
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 练习进度 */}
      {progress.length > 0 && (
        <>
          <Title level={3} style={{ color: tokens.textPrimary, marginBottom: 16, fontFamily: tokens.fontFamily }}>
            <TrophyOutlined style={{ marginRight: 8 }} />练习进度
          </Title>
          <Card style={{
            background: tokens.bgCard,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.borderRadiusLg,
            marginBottom: 32,
          }}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>已完成</span>}
                  value={progress.filter(p => p.status === 'COMPLETED').length}
                  suffix={`/ ${progress.length}`}
                  valueStyle={{ color: tokens.accent }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>总尝试次数</span>}
                  value={progress.reduce((s, p) => s + p.attemptsCount, 0)}
                  valueStyle={{ color: tokens.textPrimary }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>最高分</span>}
                  value={Math.max(...progress.map(p => p.bestScore ?? 0), 0)}
                  valueStyle={{ color: tokens.warning }}
                />
              </Col>
            </Row>
          </Card>
        </>
      )}

      {/* 最近录音 */}
      {records.length > 0 && (
        <>
          <Title level={3} style={{ color: tokens.textPrimary, marginBottom: 16, fontFamily: tokens.fontFamily }}>
            最近录音
          </Title>
          <List
            dataSource={records.slice(0, 5)}
            renderItem={(record) => (
              <List.Item style={{
                background: tokens.bgCard,
                border: `1px solid ${tokens.border}`,
                borderRadius: tokens.borderRadius,
                padding: 12, marginBottom: 8,
              }}>
                <Space>
                  <audio src={record.audioUrl} controls style={{ height: 32 }} />
                  {record.score != null && (
                    <Tag color={record.score >= 80 ? 'green' : record.score >= 60 ? 'orange' : 'red'}>
                      {record.score}分
                    </Tag>
                  )}
                  <Text style={{ color: tokens.textSecondary, fontSize: 12 }}>
                    {new Date(record.createdAt).toLocaleString()}
                  </Text>
                  {record.feedbackText && (
                    <Text style={{ color: tokens.textSecondary, fontSize: 13 }}>
                      {record.feedbackText}
                    </Text>
                  )}
                </Space>
              </List.Item>
            )}
          />
        </>
      )}

      {/* 分析结果弹窗 */}
      <Modal
        title={<span style={{ color: tokens.textPrimary }}>🎤 分析结果</span>}
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        footer={[<Button key="close" onClick={() => setResultModalOpen(false)}>关闭</Button>]}
        styles={{
          header: { background: tokens.bgSecondary },
          body: { background: tokens.bgSecondary },
          footer: { background: tokens.bgSecondary },
        }}
      >
        {analysisResult && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="dashboard"
                percent={analysisResult.overallScore}
                strokeColor={analysisResult.overallScore >= 80 ? tokens.accent : analysisResult.overallScore >= 60 ? tokens.warning : tokens.error}
                format={(pct) => <span style={{ color: tokens.textPrimary, fontSize: 24 }}>{pct}</span>}
                size={140}
              />
              <div style={{ marginTop: 8 }}>
                <Text style={{ color: tokens.textSecondary }}>综合评分</Text>
              </div>
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>平均音高</span>}
                  value={analysisResult.averagePitch.toFixed(1)} suffix="Hz"
                  valueStyle={{ color: tokens.textPrimary, fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>稳定性</span>}
                  value={analysisResult.stabilityScore} suffix="%"
                  valueStyle={{ color: tokens.accent, fontSize: 16 }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={<span style={{ color: tokens.textSecondary }}>音域</span>}
                  value={`${analysisResult.minPitch.toFixed(0)}-${analysisResult.maxPitch.toFixed(0)}`} suffix="Hz"
                  valueStyle={{ color: tokens.textPrimary, fontSize: 16 }}
                />
              </Col>
            </Row>
            <Card style={{ background: tokens.bgElevated, border: 'none', borderRadius: tokens.borderRadius }}>
              <Text style={{ color: tokens.textPrimary }}>{analysisResult.feedback}</Text>
            </Card>
          </Space>
        )}
      </Modal>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
