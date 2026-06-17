package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "lyrics")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE lyrics SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
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
