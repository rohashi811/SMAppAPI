DELIMITER $$

CREATE TRIGGER `trg_accom_rook_insert`
BEFORE INSERT ON `Host_Accommodations`
FOR EACH ROW
BEGIN
  IF NEW.is_rook = 1 THEN
    SET NEW.nationality = 'JP';
    IF NEW.student_id IS NOT NULL THEN
      SET NEW.gender = (
        SELECT gender
        FROM Students
        WHERE id = NEW.student_id
        LIMIT 1
      );
    END IF;
  END IF;
END;
$$

CREATE TRIGGER `trg_accom_rook_update`
BEFORE UPDATE ON `Host_Accommodations`
FOR EACH ROW
BEGIN
  IF NEW.is_rook = 1 THEN
    SET NEW.nationality = 'JP';
    IF NEW.student_id IS NOT NULL THEN
      SET NEW.gender = (
        SELECT gender
        FROM Students
        WHERE id = NEW.student_id
        LIMIT 1
      );
    END IF;
  END IF;
END;
$$

DELIMITER ;
