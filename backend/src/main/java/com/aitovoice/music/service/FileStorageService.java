package com.aitovoice.music.service;

import com.aitovoice.common.BusinessException;
import com.aitovoice.common.Constants;
import com.aitovoice.common.ErrorCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path uploadDir;

    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String store(MultipartFile file, String subDir, String[] allowedExtensions) {
        validateFile(file, allowedExtensions);
        var ext = getExtension(file.getOriginalFilename());
        var filename = UUID.randomUUID() + ext;
        var targetDir = uploadDir.resolve(subDir);

        try {
            Files.createDirectories(targetDir);
            Files.copy(file.getInputStream(), targetDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + filename;
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件存储失败");
        }
    }

    public String getUploadDir() {
        return uploadDir.toString();
    }

    public Path getFilePath(String relativePath) {
        var path = uploadDir.resolve(relativePath).normalize();
        if (!Files.exists(path)) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
        return path;
    }

    private void validateFile(MultipartFile file, String[] allowedExtensions) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件为空");
        }
        if (file.getSize() > Constants.MAX_FILE_SIZE) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED, "文件超过 50MB 限制");
        }
        var ext = getExtension(file.getOriginalFilename()).toLowerCase();
        var allowed = java.util.Arrays.stream(allowedExtensions)
                .anyMatch(e -> e.equalsIgnoreCase(ext));
        if (!allowed) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_AUDIO_FORMAT);
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf("."));
    }
}
