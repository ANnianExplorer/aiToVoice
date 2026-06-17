package com.aitovoice.social.service;

import com.aitovoice.social.dto.MessageDto;
import com.aitovoice.social.dto.SendMessageRequest;
import com.aitovoice.social.entity.Message;
import com.aitovoice.social.repository.MessageRepository;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    @Transactional
    public MessageDto send(Long senderId, Long receiverId, SendMessageRequest request) {
        var msg = Message.builder()
                .sender(User.builder().id(senderId).build())
                .receiver(User.builder().id(receiverId).build())
                .content(request.content())
                .msgType(request.msgType() != null ? Message.MsgType.valueOf(request.msgType()) : Message.MsgType.TEXT)
                .refId(request.refId())
                .build();
        messageRepository.save(msg);
        return toDto(msg);
    }

    @Transactional(readOnly = true)
    public List<MessageDto> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2).stream()
                .map(this::toDto).toList();
    }

    private MessageDto toDto(Message m) {
        return new MessageDto(
                m.getId(), m.getSender().getId(), m.getReceiver().getId(),
                m.getContent(), m.getMsgType().name(), m.getRefId(),
                m.getIsRead(), m.getCreatedAt());
    }
}
