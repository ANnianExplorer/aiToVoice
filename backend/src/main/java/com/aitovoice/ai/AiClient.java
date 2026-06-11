package com.aitovoice.ai;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AiClient {

    private final WebClient webClient;
    private final String provider;
    private final String openaiKey;
    private final String openaiModel;
    private final String claudeKey;
    private final String claudeModel;

    public AiClient(
            @Value("${ai.provider}") String provider,
            @Value("${ai.openai.api-key:}") String openaiKey,
            @Value("${ai.openai.model:}") String openaiModel,
            @Value("${ai.claude.api-key:}") String claudeKey,
            @Value("${ai.claude.model:}") String claudeModel) {
        this.provider = provider;
        this.openaiKey = openaiKey;
        this.openaiModel = openaiModel;
        this.claudeKey = claudeKey;
        this.claudeModel = claudeModel;
        this.webClient = WebClient.builder().build();
    }

    public String chat(List<Map<String, String>> messages) {
        return switch (provider) {
            case "openai" -> callOpenAi(messages);
            case "claude" -> callClaude(messages);
            default -> throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "不支持的 AI 提供者: " + provider);
        };
    }

    private String callOpenAi(List<Map<String, String>> messages) {
        try {
            var response = webClient.post()
                    .uri("https://api.openai.com/v1/chat/completions")
                    .header("Authorization", "Bearer " + openaiKey)
                    .bodyValue(Map.of(
                            "model", openaiModel,
                            "messages", messages,
                            "max_tokens", 1000
                    ))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            var choices = (List<?>) response.get("choices");
            if (choices != null && !choices.isEmpty()) {
                var choice = (Map<?, ?>) choices.get(0);
                var msg = (Map<?, ?>) choice.get("message");
                return (String) msg.get("content");
            }
            return "AI 暂时无法回复";
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "OpenAI 调用失败: " + e.getMessage());
        }
    }

    private String callClaude(List<Map<String, String>> messages) {
        try {
            var response = webClient.post()
                    .uri("https://api.anthropic.com/v1/messages")
                    .header("x-api-key", claudeKey)
                    .header("anthropic-version", "2023-06-01")
                    .bodyValue(Map.of(
                            "model", claudeModel,
                            "max_tokens", 1000,
                            "messages", messages
                    ))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            var content = (List<?>) response.get("content");
            if (content != null && !content.isEmpty()) {
                var block = (Map<?, ?>) content.get(0);
                return (String) block.get("text");
            }
            return "AI 暂时无法回复";
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "Claude 调用失败: " + e.getMessage());
        }
    }
}
