package com.aitovoice.file;

import com.aitovoice.common.ApiResponse;
import com.aitovoice.common.BusinessException;
import com.aitovoice.common.Constants;
import com.aitovoice.common.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorage;

    @GetMapping("/audio/{subDir}/{filename}")
    public ResponseEntity<Resource> getAudio(
            @PathVariable String subDir,
            @PathVariable String filename) {
        var path = fileStorage.getFilePath(subDir + "/" + filename);
        try {
            var resource = new UrlResource(path.toUri());
            var contentType = Files.probeContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "audio/mpeg")
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=3600")
                    .body(resource);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @GetMapping("/cover/{subDir}/{filename}")
    public ResponseEntity<Resource> getCover(
            @PathVariable String subDir,
            @PathVariable String filename) {
        var path = fileStorage.getFilePath(subDir + "/" + filename);
        try {
            var resource = new UrlResource(path.toUri());
            var contentType = Files.probeContentType(path);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "image/jpeg")
                    .body(resource);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @PostMapping("/upload")
    public ApiResponse<String> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type) {
        var subDir = switch (type) {
            case "audio" -> "audio";
            case "cover" -> "covers";
            case "avatar" -> "avatars";
            default -> throw new BusinessException(ErrorCode.VALIDATION_ERROR, "不支持的上传类型");
        };
        var extensions = type.equals("audio")
                ? Constants.ALLOWED_AUDIO_EXTENSIONS
                : Constants.ALLOWED_IMAGE_EXTENSIONS;
        var path = fileStorage.store(file, subDir, extensions);
        return ApiResponse.success(path);
    }
}
