-- ========================================
-- 全データ削除スクリプト
-- ========================================

-- 外部キー制約を一時的に無効化（削除を安全にするため）
SET FOREIGN_KEY_CHECKS = 0;

-- データ削除（外部キー制約の順序を考慮）
-- 1. 子テーブルから削除
DELETE FROM Acceptance_schedule;
DELETE FROM Student_details;
DELETE FROM Host_family;
DELETE FROM Host_details;

-- 2. 親テーブルから削除
DELETE FROM Students;
DELETE FROM Host;
DELETE FROM StudentGroups;
DELETE FROM Agencies;
DELETE FROM Schools;

-- 外部キー制約を再有効化
SET FOREIGN_KEY_CHECKS = 1;

-- 自動増分カウンターをリセット
ALTER TABLE Acceptance_schedule AUTO_INCREMENT = 1;
ALTER TABLE Students AUTO_INCREMENT = 1;
ALTER TABLE Student_details AUTO_INCREMENT = 1;
ALTER TABLE Host AUTO_INCREMENT = 1;
ALTER TABLE Host_details AUTO_INCREMENT = 1;
ALTER TABLE Host_family AUTO_INCREMENT = 1;
ALTER TABLE StudentGroups AUTO_INCREMENT = 1;
ALTER TABLE Agencies AUTO_INCREMENT = 1;
ALTER TABLE Schools AUTO_INCREMENT = 1;

-- 削除完了メッセージ
SELECT 'All data has been deleted successfully!' as status;

-- 各テーブルのレコード数を確認
SELECT 'Schools' as table_name, COUNT(*) as record_count FROM Schools
UNION ALL
SELECT 'Agencies', COUNT(*) FROM Agencies
UNION ALL
SELECT 'StudentGroups', COUNT(*) FROM StudentGroups
UNION ALL
SELECT 'Host', COUNT(*) FROM Host
UNION ALL
SELECT 'Host_details', COUNT(*) FROM Host_details
UNION ALL
SELECT 'Host_family', COUNT(*) FROM Host_family
UNION ALL
SELECT 'Students', COUNT(*) FROM Students
UNION ALL
SELECT 'Student_details', COUNT(*) FROM Student_details
UNION ALL
SELECT 'Acceptance_schedule', COUNT(*) FROM Acceptance_schedule; 