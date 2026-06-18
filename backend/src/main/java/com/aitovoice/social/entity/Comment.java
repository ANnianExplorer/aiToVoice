package com.aitovoice.social.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.music.entity.Song;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "comments")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE comments SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Comment extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;
    @Column(length = 2000)
    private String content;
    @Column(name = "likes_count")
    @Builder.Default
    private Long likesCount = 0L;
}
