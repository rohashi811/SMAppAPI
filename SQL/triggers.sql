-- ========================================
-- 最適化されたトリガー定義
-- ========================================

-- Studentsテーブル用：duration自動計算（INSERT/UPDATE統合）
DELIMITER //
CREATE TRIGGER calculate_student_duration
BEFORE INSERT ON Students
FOR EACH ROW
BEGIN
    SET NEW.duration = CASE 
        WHEN NEW.leaving_date IS NOT NULL 
        THEN DATEDIFF(NEW.leaving_date, NEW.arrival_date)
        ELSE NULL 
    END;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER calculate_student_duration_update
BEFORE UPDATE ON Students
FOR EACH ROW
BEGIN
    SET NEW.duration = CASE 
        WHEN NEW.leaving_date IS NOT NULL 
        THEN DATEDIFF(NEW.leaving_date, NEW.arrival_date)
        ELSE NULL 
    END;
END//
DELIMITER ;

-- Acceptance_scheduleテーブル用：包括的バリデーション（INSERT）
DELIMITER //
CREATE TRIGGER validate_acceptance_schedule_insert
BEFORE INSERT ON Acceptance_schedule
FOR EACH ROW
BEGIN
    DECLARE student_gender ENUM('male', 'female', 'other');
    DECLARE overlap_count INT DEFAULT 0;
    
    -- 日付妥当性チェック
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be before end date';
    END IF;
    
    IF NEW.start_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date cannot be in the past';
    END IF;
    
    -- スケジュール重複チェック（同じホストの重複期間）
    SELECT COUNT(*) INTO overlap_count
    FROM Acceptance_schedule 
    WHERE host_id = NEW.host_id 
    AND id != NEW.id  -- 新規挿入時は0
    AND (
        (start_date <= NEW.end_date AND end_date >= NEW.start_date)
        OR (NEW.start_date <= end_date AND NEW.end_date >= start_date)
    );
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Schedule overlap detected for this host';
    END IF;
    
    -- is_rook = TRUEの場合のデータ整合性チェック
    IF NEW.is_rook = TRUE THEN
        IF NEW.student_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Student ID is required when is_rook is TRUE';
        END IF;
        
        -- 学生情報の自動取得
        SELECT gender INTO student_gender 
        FROM Students 
        WHERE id = NEW.student_id;
        
        IF student_gender IS NOT NULL THEN
            SET NEW.gender = student_gender;
        END IF;
        
        SET NEW.nationality = 'Japan';
    END IF;
    
    -- duration自動計算
    SET NEW.duration = CASE 
        WHEN NEW.end_date IS NOT NULL AND NEW.start_date IS NOT NULL 
        THEN DATEDIFF(NEW.end_date, NEW.start_date)
        ELSE NULL 
    END;
END//
DELIMITER ;

-- Acceptance_scheduleテーブル用：包括的バリデーション（UPDATE）
DELIMITER //
CREATE TRIGGER validate_acceptance_schedule_update
BEFORE UPDATE ON Acceptance_schedule
FOR EACH ROW
BEGIN
    DECLARE student_gender ENUM('male', 'female', 'other');
    DECLARE overlap_count INT DEFAULT 0;
    
    -- 日付妥当性チェック
    IF NEW.start_date >= NEW.end_date THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date must be before end date';
    END IF;
    
    IF NEW.start_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Start date cannot be in the past';
    END IF;
    
    -- スケジュール重複チェック（同じホストの重複期間、自分以外）
    SELECT COUNT(*) INTO overlap_count
    FROM Acceptance_schedule 
    WHERE host_id = NEW.host_id 
    AND id != NEW.id
    AND (
        (start_date <= NEW.end_date AND end_date >= NEW.start_date)
        OR (NEW.start_date <= end_date AND NEW.end_date >= start_date)
    );
    
    IF overlap_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Schedule overlap detected for this host';
    END IF;
    
    -- is_rook = TRUEの場合のデータ整合性チェック
    IF NEW.is_rook = TRUE THEN
        IF NEW.student_id IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Student ID is required when is_rook is TRUE';
        END IF;
        
        -- 学生情報の自動取得
        SELECT gender INTO student_gender 
        FROM Students 
        WHERE id = NEW.student_id;
        
        IF student_gender IS NOT NULL THEN
            SET NEW.gender = student_gender;
        END IF;
        
        SET NEW.nationality = 'Japan';
    END IF;
    
    -- duration自動計算
    SET NEW.duration = CASE 
        WHEN NEW.end_date IS NOT NULL AND NEW.start_date IS NOT NULL 
        THEN DATEDIFF(NEW.end_date, NEW.start_date)
        ELSE NULL 
    END;
END//
DELIMITER ;

-- Host_familyテーブル用：年齢計算トリガー
DELIMITER //
CREATE TRIGGER calculate_host_family_age
BEFORE INSERT ON Host_family
FOR EACH ROW
BEGIN
    -- 生年月日の妥当性チェック
    IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Date of birth cannot be in the future';
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER calculate_host_family_age_update
BEFORE UPDATE ON Host_family
FOR EACH ROW
BEGIN
    -- 生年月日の妥当性チェック
    IF NEW.date_of_birth IS NOT NULL AND NEW.date_of_birth > CURDATE() THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Date of birth cannot be in the future';
    END IF;
END//
DELIMITER ;

-- Student_detailsテーブル用：データ整合性チェック
DELIMITER //
CREATE TRIGGER validate_student_details
BEFORE INSERT ON Student_details
FOR EACH ROW
BEGIN
    -- 生年月日の妥当性チェック
    IF NEW.date_of_birth IS NOT NULL THEN
        IF NEW.date_of_birth > CURDATE() THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Date of birth cannot be in the future';
        END IF;
        
        IF NEW.date_of_birth < '1900-01-01' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Date of birth is too far in the past';
        END IF;
    END IF;
    
    -- 到着時刻の妥当性チェック
    IF NEW.arrival_time IS NOT NULL AND NEW.arrival_time < NOW() - INTERVAL 1 YEAR THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Arrival time cannot be more than 1 year in the past';
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER validate_student_details_update
BEFORE UPDATE ON Student_details
FOR EACH ROW
BEGIN
    -- 生年月日の妥当性チェック
    IF NEW.date_of_birth IS NOT NULL THEN
        IF NEW.date_of_birth > CURDATE() THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Date of birth cannot be in the future';
        END IF;
        
        IF NEW.date_of_birth < '1900-01-01' THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Date of birth is too far in the past';
        END IF;
    END IF;
    
    -- 到着時刻の妥当性チェック
    IF NEW.arrival_time IS NOT NULL AND NEW.arrival_time < NOW() - INTERVAL 1 YEAR THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Arrival time cannot be more than 1 year in the past';
    END IF;
END//
DELIMITER ; 