package com.aitovoice.common;

public final class Constants {

    private Constants() {}

    public static final String AUTH_HEADER = "Authorization";
    public static final String AUTH_PREFIX = "Bearer ";
    public static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    public static final String[] ALLOWED_AUDIO_EXTENSIONS = {
            ".mp3", ".flac", ".wav", ".aac", ".ogg", ".m4a", ".wma"
    };

    public static final String[] ALLOWED_IMAGE_EXTENSIONS = {
            ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };
}
