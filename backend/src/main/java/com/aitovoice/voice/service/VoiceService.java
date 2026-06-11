package com.aitovoice.voice.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.music.service.FileStorageService;
import com.aitovoice.voice.dto.AnalysisResultDto;
import com.aitovoice.voice.dto.PracticeProgressDto;
import com.aitovoice.voice.dto.VoiceRecordDto;
import com.aitovoice.voice.entity.UserPracticeProgress;
import com.aitovoice.voice.entity.VoiceRecord;
import com.aitovoice.voice.repository.PracticeProgressRepository;
import com.aitovoice.voice.repository.VoiceExerciseRepository;
import com.aitovoice.voice.repository.VoiceRecordRepository;
import com.aitovoice.music.entity.Song;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoiceService {

    private final VoiceRecordRepository recordRepository;
    private final VoiceExerciseRepository exerciseRepository;
    private final PracticeProgressRepository progressRepository;
    private final FileStorageService fileStorage;
    private final PitchAnalyzer pitchAnalyzer;
    private final ScoreCalculator scoreCalculator;

    @Transactional
    public VoiceRecordDto uploadRecord(Long userId, MultipartFile file, Long songId) {
        var path = fileStorage.store(file, "voice-records",
                com.aitovoice.common.Constants.ALLOWED_AUDIO_EXTENSIONS);
        var record = VoiceRecord.builder()
                .user(User.builder().id(userId).build())
                .song(songId != null ? Song.builder().id(songId).build() : null)
                .filePath(path)
                .build();
        recordRepository.save(record);
        return toDto(record);
    }

    @Transactional
    public AnalysisResultDto analyzeRecord(Long recordId) {
        var record = recordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOICE_RECORD_NOT_FOUND));

        try {
            var filePath = fileStorage.getFilePath(record.getFilePath());
            var tempFile = Files.createTempFile("voice-", ".wav").toFile();
            Files.copy(filePath, tempFile.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            var result = pitchAnalyzer.analyze(tempFile);
            record.setPitchData(String.valueOf(result.averagePitch()));
            record.setScore(result.overallScore());
            record.setFeedbackText(result.feedback());
            recordRepository.save(record);

            tempFile.delete();
            return result;
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.AUDIO_ANALYSIS_FAILED);
        }
    }

    public List<VoiceRecordDto> getUserRecords(Long userId) {
        return recordRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId).stream()
                .map(this::toDto).toList();
    }

    public List<PracticeProgressDto> getUserProgress(Long userId) {
        return progressRepository.findByUserIdAndDeletedAtIsNull(userId).stream()
                .map(this::toProgressDto).toList();
    }

    @Transactional
    public PracticeProgressDto submitPractice(Long userId, Long exerciseId, Long recordId) {
        var progress = progressRepository.findByUserIdAndExerciseId(userId, exerciseId)
                .orElseGet(() -> {
                    var p = UserPracticeProgress.builder()
                            .user(User.builder().id(userId).build())
                            .exercise(com.aitovoice.voice.entity.VoiceExercise.builder().id(exerciseId).build())
                            .startedAt(LocalDateTime.now())
                            .build();
                    return progressRepository.save(p);
                });

        var record = recordRepository.findById(recordId)
                .orElseThrow(() -> new BusinessException(ErrorCode.VOICE_RECORD_NOT_FOUND));

        progress.setVoiceRecord(record);
        progress.setAttemptsCount(progress.getAttemptsCount() + 1);
        progress.setLatestScore(record.getScore());
        if (progress.getBestScore() == null || record.getScore() > progress.getBestScore()) {
            progress.setBestScore(record.getScore());
        }
        progress.setStatus(UserPracticeProgress.PracticeStatus.IN_PROGRESS);
        if (progress.getBestScore() != null && progress.getBestScore() >= 80) {
            progress.setStatus(UserPracticeProgress.PracticeStatus.COMPLETED);
            progress.setCompletedAt(LocalDateTime.now());
        }
        progressRepository.save(progress);
        return toProgressDto(progress);
    }

    private VoiceRecordDto toDto(VoiceRecord r) {
        return new VoiceRecordDto(r.getId(), r.getUser().getId(),
                r.getSong() != null ? r.getSong().getId() : null,
                r.getFilePath(), r.getDurationSec(), r.getPitchData(),
                r.getScore(), r.getFeedbackText(), r.getCreatedAt());
    }

    private PracticeProgressDto toProgressDto(UserPracticeProgress p) {
        return new PracticeProgressDto(p.getId(), p.getExercise().getId(),
                p.getExercise().getTitle(), p.getStatus().name(),
                p.getAttemptsCount(), p.getBestScore(), p.getLatestScore(),
                p.getPracticeMinutes(), p.getStartedAt(), p.getCompletedAt());
    }
}
