-- 将 source_type 列从 ENUM 改为 VARCHAR，支持动态扩展音乐源
-- 运行方式：mysql -u root -p aitovoice < fix_enum_columns.sql

ALTER TABLE artists MODIFY COLUMN source_type VARCHAR(20) DEFAULT 'LOCAL';
ALTER TABLE songs MODIFY COLUMN source_type VARCHAR(20) DEFAULT 'LOCAL';
