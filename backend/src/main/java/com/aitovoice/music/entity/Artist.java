package com.aitovoice.music.entity;

import com.aitovoice.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "artists")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
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
