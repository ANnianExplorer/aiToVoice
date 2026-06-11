package com.aitovoice.music.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "song_tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@IdClass(SongTagId.class)
public class SongTag {
    @Id
    @Column(name = "song_id")
    private Long songId;
    @Id
    @Column(name = "tag_id")
    private Long tagId;
}
