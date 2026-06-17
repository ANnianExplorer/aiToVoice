package com.aitovoice.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;
import java.time.Duration;

@Getter
@Configuration
public class AiConfig {

    @Value("${ai.openai.api-key:}")
    private String openaiApiKey;

    @Value("${ai.claude.api-key:}")
    private String claudeApiKey;

    @Value("${ai.openai.api-url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${ai.claude.api-url:https://api.anthropic.com/v1/messages}")
    private String claudeApiUrl;

    @Value("${ai.openai.model:gpt-4}")
    private String openaiModel;

    @Value("${ai.claude.model:claude-sonnet-4-6}")
    private String claudeModel;

    @Bean
    public HttpClient aiHttpClient() {
        return HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }
}
