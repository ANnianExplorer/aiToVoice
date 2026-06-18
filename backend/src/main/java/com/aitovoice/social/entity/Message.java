package com.aitovoice.social.entity;

import com.aitovoice.common.BaseEntity;
import com.aitovoice.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_messages_sender_receiver", columnList = "sender_id, receiver_id"),
        @Index(name = "idx_messages_user", columnList = "sender_id, deleted_at, created_at")
})
@Where(clause = "deleted_at IS NULL")
@SQLDelete(sql = "UPDATE messages SET deleted_at = NOW() WHERE id = ?")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
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
