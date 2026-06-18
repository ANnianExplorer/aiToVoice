package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "songs", indexes = {
        @Index(name = "idx_song_title", columnList = "title"),
        @Index(name = "idx_song_artist", columnList = "artist_id"),
        @Index(name = "idx_song_genre", columnList = "genre_id")
})
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE songs SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Song extends BaseEntity {
    @Column(nullable = false, length = 200)
    private String title;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artist_id")
    private Artist artist;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "album_id")
    private Album album;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "genre_id")
    private Genre genre;
    @Column(nullable = false)
    private Integer duration;
    @Column(name = "file_path", length = 500)
    private String filePath;
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", nullable = false, length = 20)
    private SourceType sourceType;
    @Column(name = "source_id", length = 100)
    private String sourceId;
    @Column(name = "play_count")
    @Builder.Default
    private Long playCount = 0L;
    @Column(name = "like_count")
    @Builder.Default
    private Long likeCount = 0L;

    public enum SourceType { LOCAL, NETEASE, AUDIUS, JAMENDO }
}
