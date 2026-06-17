package com.aitovoice.common.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import java.nio.file.Path;
import static org.junit.jupiter.api.Assertions.*;

class FilePathSanitizerTest {

    @TempDir
    Path tempDir;

    @Test
    void normalPath_returnsCanonicalPath() {
        String result = FilePathSanitizer.sanitize(tempDir.toString(), "subdir/file.mp3");
        assertTrue(result.startsWith(tempDir.toString()));
    }

    @Test
    void dotDotTraversal_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), "../../etc/passwd"));
    }

    @Test
    void deepDotDotTraversal_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), "subdir/../../../etc/passwd"));
    }

    @Test
    void nullInput_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), null));
    }

    @Test
    void emptyInput_throwsException() {
        assertThrows(IllegalArgumentException.class,
            () -> FilePathSanitizer.sanitize(tempDir.toString(), ""));
    }
}
