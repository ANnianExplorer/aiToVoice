package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_songs", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "song_id", "type"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class UserSong extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserSongType type;
    @Column(name = "play_count")
    @Builder.Default
    private Integer playCount = 0;
    @Column(name = "last_played_at")
    private LocalDateTime lastPlayedAt;
    @Column(name = "progress_sec")
    @Builder.Default
    private Integer progressSec = 0;

    public enum UserSongType { FAVORITE, HISTORY }
}
