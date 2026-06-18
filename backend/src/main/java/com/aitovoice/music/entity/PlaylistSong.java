package com.aitovoice.music.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "playlist_songs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"playlist_id", "song_id"})
})
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class PlaylistSong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
    @CreatedDate
    @Column(name = "added_at", updatable = false)
    private LocalDateTime addedAt;
}
