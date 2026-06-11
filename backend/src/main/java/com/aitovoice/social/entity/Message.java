package com.aitovoice.social.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Message extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Enumerated(EnumType.STRING)
    @Column(name = "msg_type", length = 20)
    @Builder.Default
    private MsgType msgType = MsgType.TEXT;
    @Column(name = "ref_id")
    private Long refId;
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    public enum MsgType { TEXT, SONG, PLAYLIST }
}
