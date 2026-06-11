package com.aitovoice.voice.service;

import be.tarsos.dsp.AudioDispatcher;
import be.tarsos.dsp.io.jvm.AudioDispatcherFactory;
import be.tarsos.dsp.pitch.PitchDetectionHandler;
import be.tarsos.dsp.pitch.PitchProcessor;
import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.voice.dto.AnalysisResultDto;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;

@Service
public class PitchAnalyzer {

    public AnalysisResultDto analyze(File audioFile) {
        var pitches = new ArrayList<Double>();

        try {
            AudioDispatcher dispatcher = AudioDispatcherFactory.fromFile(audioFile, 2048, 1024);
            PitchDetectionHandler handler = (result, event) -> {
                if (result.isPitched()) {
                    pitches.add((double) result.getPitch());
                }
            };
            dispatcher.addAudioProcessor(new PitchProcessor(
                    PitchProcessor.PitchEstimationAlgorithm.YIN, 44100, 2048, handler));
            dispatcher.run();
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.AUDIO_ANALYSIS_FAILED, "音高分析失败: " + e.getMessage());
        }

        if (pitches.isEmpty()) {
            return new AnalysisResultDto(0, 0, 0, 0, 0, 0, "未检测到有效音高");
        }

        var avg = pitches.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        var max = pitches.stream().mapToDouble(Double::doubleValue).max().orElse(0);
        var min = pitches.stream().mapToDouble(Double::doubleValue).min().orElse(0);
        var variance = pitches.stream().mapToDouble(p -> Math.pow(p - avg, 2)).average().orElse(0);
        var stability = Math.max(0, 100 - (int) Math.sqrt(variance));

        var score = calculateScore(avg, max, min, stability);
        var feedback = generateFeedback(score, stability);

        return new AnalysisResultDto(avg, max, min, stability, 0, score, feedback);
    }

    private int calculateScore(double avg, double max, double min, int stability) {
        var range = max - min;
        var rangeScore = range > 0 && range < 500 ? 80 : 50;
        return (rangeScore + stability) / 2;
    }

    private String generateFeedback(int score, int stability) {
        if (score >= 80) return "音准非常好，继续保持！";
        if (score >= 60) return stability < 50 ? "音准不错，但音高稳定性需要加强，建议多做长音练习。" : "整体表现良好，可以尝试更高难度的曲目。";
        return "音准需要提升，建议从基础音阶练习开始，每天坚持15分钟。";
    }
}
