package com.aitovoice.common.util;

import java.nio.file.Path;

public final class FilePathSanitizer {

    private FilePathSanitizer() {}

    public static String sanitize(String basePath, String userInput) {
        if (userInput == null || userInput.isBlank()) {
            throw new IllegalArgumentException("Path must not be empty");
        }
        Path base = Path.of(basePath).toAbsolutePath().normalize();
        Path resolved = base.resolve(userInput).toAbsolutePath().normalize();
        if (!resolved.startsWith(base)) {
            throw new IllegalArgumentException("Path traversal detected");
        }
        return resolved.toString();
    }
}
