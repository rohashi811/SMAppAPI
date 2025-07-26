-- Acceptance_scheduleテーブルにdurationカラムを追加
ALTER TABLE Acceptance_schedule 
ADD COLUMN duration INT NULL 
AFTER nationality;

-- 既存のデータに対してdurationを計算して更新
UPDATE Acceptance_schedule 
SET duration = DATEDIFF(end_date, start_date) 
WHERE duration IS NULL; 