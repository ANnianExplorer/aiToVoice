package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "lyrics")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lyrics extends BaseEntity {
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id")
    private Song song;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(length = 50)
    private String source;
    @Column(name = "synced_at")
    private LocalDateTime syncedAt;
}
