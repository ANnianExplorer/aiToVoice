package com.aitovoice.voice.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.music.entity.Song;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "voice_records")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE voice_records SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class VoiceRecord extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private Song song;
    @Column(name = "file_path", nullable = false, length = 500)
    private String filePath;
    @Column(name = "duration_sec")
    private Integer durationSec;
    @Column(name = "pitch_data", columnDefinition = "JSON")
    private String pitchData;
    @Column(name = "rhythm_data", columnDefinition = "JSON")
    private String rhythmData;
    @Column
    private Integer score;
    @Column(name = "comparison_data", columnDefinition = "JSON")
    private String comparisonData;
    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;
}
