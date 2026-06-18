package com.aitovoice.common;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    AUTH_INVALID_CREDENTIALS(401, "用户名或密码错误"),
    AUTH_TOKEN_EXPIRED(401, "Token 已过期"),
    AUTH_TOKEN_INVALID(401, "Token 无效"),
    AUTH_UNAUTHORIZED(401, "未授权"),
    USER_NOT_FOUND(404, "用户不存在"),
    USER_ALREADY_EXISTS(409, "用户已存在"),
    USER_EMAIL_EXISTS(409, "邮箱已被注册"),
    SONG_NOT_FOUND(404, "歌曲不存在"),
    ALBUM_NOT_FOUND(404, "专辑不存在"),
    ARTIST_NOT_FOUND(404, "歌手不存在"),
    GENRE_NOT_FOUND(404, "流派不存在"),
    FILE_UPLOAD_FAILED(500, "文件上传失败"),
    FILE_NOT_FOUND(404, "文件不存在"),
    UNSUPPORTED_AUDIO_FORMAT(400, "不支持的音频格式"),
    PLAYLIST_NOT_FOUND(404, "歌单不存在"),
    PLAYLIST_ACCESS_DENIED(403, "无权访问该歌单"),
    SONG_ALREADY_IN_PLAYLIST(409, "歌曲已在歌单中"),
    COMMENT_NOT_FOUND(404, "评论不存在"),
    CANNOT_FOLLOW_SELF(400, "不能关注自己"),
    ALREADY_FOLLOWING(409, "已经关注该用户"),
    VOICE_RECORD_NOT_FOUND(404, "录音记录不存在"),
    EXERCISE_NOT_FOUND(404, "练习任务不存在"),
    AUDIO_ANALYSIS_FAILED(500, "音频分析失败"),
    AI_SESSION_NOT_FOUND(404, "AI 会话不存在"),
    AI_SESSION_ACCESS_DENIED(403, "无权访问该 AI 会话"),
    AI_SERVICE_ERROR(502, "AI 服务异常"),
    COMMENT_ACCESS_DENIED(403, "无权删除该评论"),
    VALIDATION_ERROR(400, "参数校验失败"),
    INTERNAL_ERROR(500, "服务器内部错误"),
    RATE_LIMITED(429, "请求过于频繁");

    private final int code;
    private final String message;
}
