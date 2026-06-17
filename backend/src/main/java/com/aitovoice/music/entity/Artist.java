package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "artists")
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE artists SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Artist extends BaseEntity {
    @Column(nullable = false, length = 100)
    private String name;
    @Column(name = "avatar_url")
    private String avatarUrl;
    @Column(length = 1000)
    private String bio;
    @Enumerated(EnumType.STRING)
    @Column(name = "source_type", length = 20)
    private SourceType sourceType;
    @Column(name = "source_id", length = 100)
    private String sourceId;

    public enum SourceType { LOCAL, NETEASE }
}
