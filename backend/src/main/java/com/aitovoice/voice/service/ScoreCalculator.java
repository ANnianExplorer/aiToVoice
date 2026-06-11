package com.aitovoice.voice.service;

import com.aitovoice.voice.dto.AnalysisResultDto;
import org.springframework.stereotype.Service;

@Service
public class ScoreCalculator {

    public int calculateOverall(AnalysisResultDto pitch, AnalysisResultDto rhythm) {
        var pitchWeight = 0.6;
        var rhythmWeight = 0.4;
        return (int) (pitch.stabilityScore() * pitchWeight + rhythm.stabilityScore() * rhythmWeight);
    }

    public String generatePracticeAdvice(AnalysisResultDto result) {
        var sb = new StringBuilder();
        if (result.averagePitch() < 100) {
            sb.append("• 你的声音偏低，尝试用腹式呼吸支撑更高的音调\n");
        }
        if (result.stabilityScore() < 50) {
            sb.append("• 音高稳定性不足，建议做长音保持练习（每个音保持10秒）\n");
        }
        if (result.overallScore() >= 80) {
            sb.append("• 表现优秀！可以挑战更有难度的曲目\n");
        } else if (result.overallScore() >= 60) {
            sb.append("• 基础扎实，继续练习提升稳定性\n");
        } else {
            sb.append("• 建议每天坚持基础发声练习15-20分钟\n");
        }
        return sb.toString();
    }
}
