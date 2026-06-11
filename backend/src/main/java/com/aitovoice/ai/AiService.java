package com.aitovoice.ai;

import com.aitovoice.ai.dto.*;
import com.aitovoice.ai.entity.AiMessage;
import com.aitovoice.ai.entity.AiSession;
import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    private final AiSessionRepository sessionRepository;
    private final AiMessageRepository messageRepository;
    private final AiClient aiClient;

    private static final String VOICE_COACH_SYSTEM = """
            你是一位专业的声乐教练和音乐老师。你的职责是：
            1. 分析用户的演唱录音，给出具体的发声建议
            2. 根据用户水平制定个性化的练习计划
            3. 解答音乐和声乐相关的问题
            4. 鼓励用户坚持练习，保持积极态度

            请用温和专业的语气回复，给出具体可操作的建议。
            """;

    private static final String GENERAL_SYSTEM = """
            你是一位音乐知识丰富的 AI 助手。你可以：
            1. 推荐歌曲和歌单
            2. 讲解音乐理论知识
            3. 分析歌曲的演唱技巧
            4. 提供音乐学习建议
            """;

    @Transactional
    public AiSessionDto createSession(Long userId, CreateSessionRequest request) {
        var type = request.sessionType() != null
                ? AiSession.SessionType.valueOf(request.sessionType())
                : AiSession.SessionType.GENERAL;
        var title = request.title() != null ? request.title()
                : (type == AiSession.SessionType.VOICE_COACH ? "声乐教练对话" : "音乐助手对话");

        var session = AiSession.builder()
                .user(User.builder().id(userId).build())
                .title(title)
                .sessionType(type)
                .build();
        sessionRepository.save(session);
        return toSessionDto(session);
    }

    public List<AiSessionDto> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdAndDeletedAtIsNullOrderByCreatedAtDesc(userId).stream()
                .map(this::toSessionDto).toList();
    }

    public List<AiMessageDto> getSessionMessages(Long sessionId) {
        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(this::toMessageDto).toList();
    }

    @Transactional
    public AiMessageDto sendMessage(Long sessionId, Long userId, SendMessageRequest request) {
        var session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.AI_SESSION_NOT_FOUND));
        if (!session.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.PLAYLIST_ACCESS_DENIED);
        }

        // Save user message
        var userMsg = AiMessage.builder()
                .session(session)
                .role(AiMessage.MessageRole.USER)
                .content(request.content())
                .build();
        messageRepository.save(userMsg);

        // Build conversation context
        var systemPrompt = session.getSessionType() == AiSession.SessionType.VOICE_COACH
                ? VOICE_COACH_SYSTEM : GENERAL_SYSTEM;
        var messages = new ArrayList<Map<String, String>>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        var history = messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        for (var msg : history) {
            messages.add(Map.of(
                    "role", msg.getRole() == AiMessage.MessageRole.USER ? "user" : "assistant",
                    "content", msg.getContent()
            ));
        }

        // Get AI response
        var aiResponse = aiClient.chat(messages);

        // Save AI message
        var aiMsg = AiMessage.builder()
                .session(session)
                .role(AiMessage.MessageRole.ASSISTANT)
                .content(aiResponse)
                .msgType(AiMessage.MessageType.TEXT)
                .build();
        messageRepository.save(aiMsg);

        return toMessageDto(aiMsg);
    }

    private AiSessionDto toSessionDto(AiSession s) {
        return new AiSessionDto(s.getId(), s.getTitle(), s.getSessionType().name(),
                s.getSummary(), s.getCreatedAt());
    }

    private AiMessageDto toMessageDto(AiMessage m) {
        return new AiMessageDto(m.getId(), m.getRole().name(), m.getContent(),
                m.getMsgType().name(), m.getMetadata(), m.getCreatedAt());
    }
}
