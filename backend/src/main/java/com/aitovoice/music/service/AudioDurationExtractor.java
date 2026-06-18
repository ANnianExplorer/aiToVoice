package com.aitovoice.music.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import java.io.File;

/**
 * 提取音频文件时长（秒）
 */
@Slf4j
@Component
public class AudioDurationExtractor {

    /**
     * 提取音频时长，失败返回 0
     */
    public int extract(File audioFile) {
        // 方法1: javax.sound.sampled（支持 WAV、AIFF）
        try {
            AudioInputStream ais = AudioSystem.getAudioInputStream(audioFile);
            AudioFormat format = ais.getFormat();
            long frames = ais.getFrameLength();
            ais.close();
            if (format.getFrameRate() > 0 && frames > 0) {
                return (int) (frames / format.getFrameRate());
            }
        } catch (Exception e) {
            log.debug("javax.sound failed for {}: {}", audioFile.getName(), e.getMessage());
        }

        // 方法2: 通过文件大小估算（MP3/OGG 等压缩格式）
        // MP3 128kbps ≈ 16KB/s, 320kbps ≈ 40KB/s, 取中间值 24KB/s 估算
        try {
            long fileSize = audioFile.length();
            if (fileSize > 0) {
                String name = audioFile.getName().toLowerCase();
                int bytesPerSec;
                if (name.endsWith(".mp3")) {
                    bytesPerSec = 20_000; // ~160kbps 估算
                } else if (name.endsWith(".ogg")) {
                    bytesPerSec = 18_000; // ~128kbps 估算
                } else if (name.endsWith(".flac")) {
                    bytesPerSec = 70_000; // 无损估算
                } else {
                    bytesPerSec = 20_000;
                }
                int estimated = (int) (fileSize / bytesPerSec);
                if (estimated > 0) return estimated;
            }
        } catch (Exception e) {
            log.debug("File size estimation failed: {}", e.getMessage());
        }

        return 0;
    }
}
