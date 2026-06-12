package com.aitovoice.voice.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

@Service
public class AiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String provider;
    private final String openaiKey;
    private final String openaiModel;
    private final String claudeKey;
    private final String claudeModel;

    public AiClient(
            ObjectMapper objectMapper,
            @Value("${ai.provider}") String provider,
            @Value("${ai.openai.api-key:}") String openaiKey,
            @Value("${ai.openai.model:}") String openaiModel,
            @Value("${ai.claude.api-key:}") String claudeKey,
            @Value("${ai.claude.model:}") String claudeModel) {
        this.objectMapper = objectMapper;
        this.provider = provider;
        this.openaiKey = openaiKey;
        this.openaiModel = openaiModel;
        this.claudeKey = claudeKey;
        this.claudeModel = claudeModel;
        this.httpClient = HttpClient.newHttpClient();
    }

    public String chat(List<Map<String, String>> messages) {
        return switch (provider) {
            case "openai" -> callOpenAi(messages);
            case "claude" -> callClaude(messages);
            default -> throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "不支持的 AI 提供者: " + provider);
        };
    }

    @SuppressWarnings("unchecked")
    private String callOpenAi(List<Map<String, String>> messages) {
        try {
            var body = objectMapper.writeValueAsString(Map.of(
                    "model", openaiModel,
                    "messages", messages,
                    "max_tokens", 1000
            ));

            var request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Authorization", "Bearer " + openaiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            var result = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            var choices = (List<?>) result.get("choices");
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

    @SuppressWarnings("unchecked")
    private String callClaude(List<Map<String, String>> messages) {
        try {
            var body = objectMapper.writeValueAsString(Map.of(
                    "model", claudeModel,
                    "max_tokens", 1000,
                    "messages", messages
            ));

            var request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("x-api-key", claudeKey)
                    .header("anthropic-version", "2023-06-01")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            var result = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            var content = (List<?>) result.get("content");
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