-- 学生詳細情報ビュー
CREATE VIEW v_student_full AS
SELECT 
    s.id,
    s.first_name,
    s.last_name,
    sd.jp_name,
    sd.date_of_birth,
    sd.phone_number,
    sd.email,
    s.arrival_date,
    s.leaving_date,
    s.duration,
    s.gender,
    sd.flight_number,
    sd.arrival_time,
    sd.visa,
    sd.allergies,
    sd.smoke,
    sd.pet,
    sd.kid,
    sd.meal,
    sd.emergency_contact,
    sd.emergency_contact_relation,
    sd.emergency_phone,
    sd.passport_number,
    sd.note,
    sch.name as school_name,
    sch.category as school_category,
    ag.name as agency_name,
    g.name as group_name,
    s.created_at,
    s.updated_at
FROM Students s
LEFT JOIN Student_details sd ON s.id = sd.student_id
LEFT JOIN Schools sch ON s.school_id = sch.id
LEFT JOIN Agencies ag ON s.agency_id = ag.id
LEFT JOIN StudentGroups g ON s.group_id = g.id;

-- ホスト詳細情報ビュー
CREATE VIEW v_host_full AS
SELECT 
    h.id,
    h.first_name,
    h.last_name,
    h.phone,
    h.address,
    h.status,
    hd.email,
    hd.num_of_room,
    hd.pet,
    hd.note,
    COUNT(hf.host_id) as family_members,
    GROUP_CONCAT(
        CONCAT(hf.name, ' (', hf.relation, ')') 
        SEPARATOR ', '
    ) as family_info,
    h.created_at,
    h.updated_at
FROM Host h
LEFT JOIN Host_details hd ON h.id = hd.host_id
LEFT JOIN Host_family hf ON h.id = hf.host_id
GROUP BY h.id;

INSERT INTO `Schools` (`id`, `name`, `category`, `created_at`, `updated_at`) VALUES
    (1, 'School 1', 'Public', NOW(), NOW()),
    (2, 'School 2', 'Public', NOW(), NOW()),
    (3, 'School 3', 'Public', NOW(), NOW()),
    (4, 'School 4', 'Public', NOW(), NOW()),
    (5, 'School 5', 'Public', NOW(), NOW());

INSERT INTO `Agencies` (`id`, `name`, `created_at`, `updated_at`) VALUES
    (1, 'Agency 1', NOW(), NOW()),
    (2, 'Agency 2', NOW(), NOW()),
    (3, 'Agency 3', NOW(), NOW()),
    (4, 'Agency 4', NOW(), NOW()),
    (5, 'Agency 5', NOW(), NOW());

INSERT INTO `StudentGroups` (`id`, `name`, `created_at`, `updated_at`) VALUES
    (1, 'Group 1', NOW(), NOW()),
    (2, 'Group 2', NOW(), NOW()),
    (3, 'Group 3', NOW(), NOW()),
    (4, 'Group 4', NOW(), NOW()),
    (5, 'Group 5', NOW(), NOW());

INSERT INTO `Students` (`id`, `first_name`, `last_name`, `group_id`, `created_at`, `updated_at`) VALUES
    (1, 'John', 'Doe', 1, NOW(), NOW()),
    (2, 'Jane', 'Smith', 1, NOW(), NOW()),
    (3, 'Jim', 'Beam', 1, NOW(), NOW()),
    (4, 'Jill', 'Johnson', 1, NOW(), NOW()),
    (5, 'Jack', 'Daniels', 1, NOW(), NOW());

INSERT INTO `Student_details` (`student_id`, `jp_name`, `date_of_birth`, `phone_number`, `email`, `flight_number`, `arrival_time`, `visa`, `allergies`, `smoke`, `pet`, `kid`, `meal`, `emergency_contact`, `emergency_contact_relation`, `emergency_phone`, `passport_number`, `note`) VALUES
    (1, 'John Doe', '1990-01-01', '1234567890', 'john.doe@example.com', '1234567890', '2023-01-01 10:00:00', 'B2', 'None', 'No', 'No', 'No', 'None', 'John Doe', 'Father', '1234567890', '1234567890', 'None'),
    (2, 'Jane Smith', '1992-02-02', '1234567891', 'jane.smith@example.com', '1234567891', '2023-01-02 11:00:00', 'B2', 'None', 'No', 'No', 'No', 'None', 'Jane Smith', 'Mother', '1234567891', '1234567891', 'None'),
    (3, 'Jim Beam', '1994-03-03', '1234567892', 'jim.beam@example.com', '1234567892', '2023-01-03 12:00:00', 'B2', 'None', 'No', 'No', 'No', 'None', 'Jim Beam', 'Father', '1234567892', '1234567892', 'None'),
    (4, 'Jill Johnson', '1996-04-04', '1234567893', 'jill.johnson@example.com', '1234567893', '2023-01-04 13:00:00', 'B2', 'None', 'No', 'No', 'No', 'None', 'Jill Johnson', 'Mother', '1234567893', '1234567893', 'None'),
    (5, 'Jack Daniels', '1998-05-05', '1234567894', 'jack.daniels@example.com', '1234567894', '2023-01-05 14:00:00', 'B2', 'None', 'No', 'No', 'No', 'None', 'Jack Daniels', 'Father', '1234567894', '1234567894', 'None');

INSERT INTO `Host` (`id`, `first_name`, `last_name`, `phone`, `address`, `status`, `created_at`, `updated_at`) VALUES
    (1, 'John', 'Doe', '1234567890', '1234567890', 'Active', NOW(), NOW()),
    (2, 'Jane', 'Smith', '1234567891', '1234567891', 'Active', NOW(), NOW()),
    (3, 'Jim', 'Beam', '1234567892', '1234567892', 'Active', NOW(), NOW()),
    (4, 'Jill', 'Johnson', '1234567893', '1234567893', 'Active', NOW(), NOW()),
    (5, 'Jack', 'Daniels', '1234567894', '1234567894', 'Active', NOW(), NOW());

INSERT INTO `Host_details` (`host_id`, `email`, `num_of_room`, `pet`, `note`) VALUES
    (1, 'john.doe@example.com', 1, 'No', 'None'),
    (2, 'jane.smith@example.com', 1, 'No', 'None'),
    (3, 'jim.beam@example.com', 1, 'No', 'None'),
    (4, 'jill.johnson@example.com', 1, 'No', 'None'),
    (5, 'jack.daniels@example.com', 1, 'No', 'None');

INSERT INTO `Host_family` (`host_id`, `name`, `relation`, `created_at`, `updated_at`) VALUES
    (1, 'John Doe', 'Father', NOW(), NOW()),
    (2, 'Jane Smith', 'Mother', NOW(), NOW()),
    (3, 'Jim Beam', 'Father', NOW(), NOW()),
    (4, 'Jill Johnson', 'Mother', NOW(), NOW()),
    (5, 'Jack Daniels', 'Father', NOW(), NOW());


SELECT * FROM v_student_full;
SELECT * FROM v_host_full;