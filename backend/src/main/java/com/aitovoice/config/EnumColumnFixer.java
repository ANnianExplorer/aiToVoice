package com.aitovoice.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Statement;

/**
 * 修复 MySQL ENUM 列为 VARCHAR，支持动态音乐源扩展
 * 在 MusicDataInitializer 之前运行
 */
@Slf4j
@Component
@Order(1) // 在 DataInitializer(0) 和 MusicDataInitializer(2) 之间
@RequiredArgsConstructor
public class EnumColumnFixer implements ApplicationRunner {

    private final DataSource dataSource;

    @Override
    public void run(ApplicationArguments args) {
        try (var conn = dataSource.getConnection();
             var stmt = conn.createStatement()) {

            // artists.source_type: ENUM → VARCHAR
            try {
                stmt.execute("ALTER TABLE artists MODIFY COLUMN source_type VARCHAR(20) DEFAULT 'LOCAL'");
                log.info("Fixed artists.source_type to VARCHAR");
            } catch (Exception e) {
                // 可能已经是 VARCHAR，忽略
                log.debug("artists.source_type already OK: {}", e.getMessage());
            }

            // songs.source_type: ENUM → VARCHAR
            try {
                stmt.execute("ALTER TABLE songs MODIFY COLUMN source_type VARCHAR(20) DEFAULT 'LOCAL'");
                log.info("Fixed songs.source_type to VARCHAR");
            } catch (Exception e) {
                log.debug("songs.source_type already OK: {}", e.getMessage());
            }

        } catch (Exception e) {
            log.warn("EnumColumnFixer failed (non-critical): {}", e.getMessage());
        }
    }
}
