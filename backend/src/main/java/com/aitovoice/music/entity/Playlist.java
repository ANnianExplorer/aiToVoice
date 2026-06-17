package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "playlists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Playlist extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(nullable = false, length = 200)
    private String name;
    @Column(length = 1000)
    private String description;
    @Column(name = "cover_url", length = 500)
    private String coverUrl;
    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;
    @Column(name = "play_count")
    @Builder.Default
    private Long playCount = 0L;
    @Column(name = "song_count")
    @Builder.Default
    private Integer songCount = 0;
}
