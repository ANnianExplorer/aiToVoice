package com.aitovoice.recommend.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.music.entity.Song;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "recommendations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recommendation extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @Column(nullable = false)
    private Double score;
    @Column(length = 500)
    private String reason;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Algorithm algorithm;
    @Column(name = "is_clicked")
    @Builder.Default
    private Boolean isClicked = false;

    public enum Algorithm { COLLAB_FILTER, CONTENT_BASED, TRENDING }
}
