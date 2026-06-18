package com.aitovoice.voice.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.ErrorCode;
import com.aitovoice.config.AiConfig;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
public class AiClient {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final AiConfig aiConfig;
    private final String provider;

    public AiClient(
            @Qualifier("aiHttpClient") HttpClient httpClient,
            ObjectMapper objectMapper,
            AiConfig aiConfig,
            @Value("${ai.provider}") String provider) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.aiConfig = aiConfig;
        this.provider = provider;
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
                    "model", aiConfig.getOpenaiModel(),
                    "messages", messages,
                    "max_tokens", 1000
            ));

            var request = HttpRequest.newBuilder()
                    .uri(URI.create(aiConfig.getOpenaiApiUrl()))
                    .header("Authorization", "Bearer " + aiConfig.getOpenaiApiKey())
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() / 100 != 2) {
                throw new BusinessException(ErrorCode.AI_SERVICE_ERROR,
                        "OpenAI 返回错误状态码: " + response.statusCode());
            }

            var result = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            var choices = (List<?>) result.get("choices");
            if (choices != null && !choices.isEmpty()) {
                var choice = (Map<?, ?>) choices.get(0);
                var msg = (Map<?, ?>) choice.get("message");
                return (String) msg.get("content");
            }
            return "AI 暂时无法回复";
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "OpenAI 调用失败: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String callClaude(List<Map<String, String>> messages) {
        try {
            var body = objectMapper.writeValueAsString(Map.of(
                    "model", aiConfig.getClaudeModel(),
                    "max_tokens", 1000,
                    "messages", messages
            ));

            var request = HttpRequest.newBuilder()
                    .uri(URI.create(aiConfig.getClaudeApiUrl()))
                    .header("x-api-key", aiConfig.getClaudeApiKey())
                    .header("anthropic-version", "2023-06-01")
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            var response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() / 100 != 2) {
                throw new BusinessException(ErrorCode.AI_SERVICE_ERROR,
                        "Claude 返回错误状态码: " + response.statusCode());
            }

            var result = objectMapper.readValue(response.body(), new TypeReference<Map<String, Object>>() {});

            var content = (List<?>) result.get("content");
            if (content != null && !content.isEmpty()) {
                var block = (Map<?, ?>) content.get(0);
                return (String) block.get("text");
            }
            return "AI 暂时无法回复";
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.AI_SERVICE_ERROR, "Claude 调用失败: " + e.getMessage());
        }
    }
}
