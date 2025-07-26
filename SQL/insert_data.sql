-- ========================================
-- サンプルデータ挿入
-- ========================================

-- Schoolsテーブルにサンプルデータ挿入
INSERT INTO Schools (name, category) VALUES
('ABC Language School', 'language'),
('XYZ International School', 'secondary'),
('Global College', 'college'),
('International University', 'university'),
('English Academy', 'language'),
('Business College', 'college');

-- Agenciesテーブルにサンプルデータ挿入
INSERT INTO Agencies (name) VALUES
('Study Abroad Japan'),
('Global Education Services'),
('International Student Agency'),
('Education First'),
('Student Exchange Program'),
('Academic Partners');

-- StudentGroupsテーブルにサンプルデータ挿入
INSERT INTO StudentGroups (name) VALUES
('Summer 2024 Group A'),
('Summer 2024 Group B'),
('Winter 2024 Group A'),
('Spring 2025 Group A'),
('Long-term Students'),
('Short-term Students');

-- Hostテーブルにサンプルデータ挿入
INSERT INTO Host (first_name, last_name, phone, address, status) VALUES
('John', 'Smith', '+1-555-0123', '123 Main St, Toronto, ON', 'Great'),
('Mary', 'Johnson', '+1-555-0124', '456 Oak Ave, Vancouver, BC', 'Ok'),
('David', 'Brown', '+1-555-0125', '789 Pine Rd, Montreal, QC', 'Great'),
('Sarah', 'Wilson', '+1-555-0126', '321 Elm St, Calgary, AB', 'Ok'),
('Michael', 'Davis', '+1-555-0127', '654 Maple Dr, Ottawa, ON', 'NG'),
('Lisa', 'Miller', '+1-555-0128', '987 Cedar Ln, Edmonton, AB', 'Great');

-- Host_detailsテーブルにサンプルデータ挿入
INSERT INTO Host_details (host_id, email, num_of_room, pet, note) VALUES
(1, 'john.smith@email.com', 2, TRUE, 'Has a friendly dog'),
(2, 'mary.johnson@email.com', 1, FALSE, 'No pets, non-smoking'),
(3, 'david.brown@email.com', 3, TRUE, 'Has a cat and dog'),
(4, 'sarah.wilson@email.com', 2, FALSE, 'Vegetarian household'),
(5, 'michael.davis@email.com', 1, FALSE, 'Smoking allowed'),
(6, 'lisa.miller@email.com', 2, TRUE, 'Has a small dog');

-- Host_familyテーブルにサンプルデータ挿入
INSERT INTO Host_family (host_id, name, relation, phone, date_of_birth) VALUES
(1, 'Emma Smith', 'Daughter', '+1-555-0129', '2005-03-15'),
(1, 'James Smith', 'Son', '+1-555-0130', '2007-08-22'),
(2, 'Robert Johnson', 'Husband', '+1-555-0131', '1975-11-10'),
(3, 'Jennifer Brown', 'Wife', '+1-555-0132', '1980-04-05'),
(3, 'Alex Brown', 'Son', '+1-555-0133', '2010-12-03'),
(4, 'Thomas Wilson', 'Husband', '+1-555-0134', '1978-09-18'),
(6, 'Peter Miller', 'Husband', '+1-555-0135', '1972-06-25'),
(6, 'Sophie Miller', 'Daughter', '+1-555-0136', '2008-01-30');

-- Studentsテーブルにサンプルデータ挿入
INSERT INTO Students (first_name, last_name, arrival_date, leaving_date, gender, school_id, agency_id, group_id) VALUES
('Yuki', 'Tanaka', '2024-07-01', '2024-08-31', 'female', 1, 1, 1),
('Kenji', 'Sato', '2024-07-01', '2024-08-31', 'male', 1, 1, 1),
('Aiko', 'Yamamoto', '2024-07-15', '2024-09-15', 'female', 2, 2, 2),
('Taro', 'Nakamura', '2024-08-01', '2024-10-31', 'male', 3, 3, 3),
('Mika', 'Watanabe', '2024-09-01', '2025-03-31', 'female', 4, 4, 5),
('Hiroshi', 'Ito', '2024-10-01', '2025-06-30', 'male', 5, 5, 5),
('Yumi', 'Kobayashi', '2024-11-01', '2025-01-31', 'female', 1, 6, 6),
('Kazuki', 'Suzuki', '2024-12-01', '2025-02-28', 'male', 2, 1, 6);

-- Student_detailsテーブルにサンプルデータ挿入
INSERT INTO Student_details (student_id, jp_name, date_of_birth, phone_number, email, flight_number, arrival_time, visa, allergies, smoke, pet, kid, meal, emergency_contact, emergency_contact_relation, emergency_phone, passport_number, note) VALUES
(1, '田中 雪', '2005-04-10', '090-1234-5678', 'yuki.tanaka@email.com', 'AC001', '2024-07-01 14:30:00', 'Student', 'Peanuts', FALSE, FALSE, FALSE, 'No restrictions', '田中 太郎', 'Father', '090-1234-5679', 'TR1234567', 'First time abroad'),
(2, '佐藤 健二', '2004-08-15', '090-1234-5680', 'kenji.sato@email.com', 'AC002', '2024-07-01 15:45:00', 'Student', NULL, FALSE, FALSE, FALSE, 'Vegetarian', '佐藤 美子', 'Mother', '090-1234-5681', 'TR1234568', 'Loves sports'),
(3, '山本 愛子', '2003-12-20', '090-1234-5682', 'aiko.yamamoto@email.com', 'AC003', '2024-07-15 10:20:00', 'Student', 'Shellfish', FALSE, FALSE, FALSE, 'No restrictions', '山本 一郎', 'Father', '090-1234-5683', 'TR1234569', 'Art student'),
(4, '中村 太郎', '2002-06-05', '090-1234-5684', 'taro.nakamura@email.com', 'AC004', '2024-08-01 16:15:00', 'Student', NULL, FALSE, FALSE, FALSE, 'No restrictions', '中村 花子', 'Mother', '090-1234-5685', 'TR1234570', 'Business major'),
(5, '渡辺 美香', '2001-03-12', '090-1234-5686', 'mika.watanabe@email.com', 'AC005', '2024-09-01 12:00:00', 'Student', 'Dairy', FALSE, FALSE, FALSE, 'Lactose intolerant', '渡辺 正男', 'Father', '090-1234-5687', 'TR1234571', 'Long-term study'),
(6, '伊藤 博志', '2000-11-08', '090-1234-5688', 'hiroshi.ito@email.com', 'AC006', '2024-10-01 13:30:00', 'Student', NULL, FALSE, FALSE, FALSE, 'No restrictions', '伊藤 恵子', 'Mother', '090-1234-5689', 'TR1234572', 'Engineering student'),
(7, '小林 由美', '2004-01-25', '090-1234-5690', 'yumi.kobayashi@email.com', 'AC007', '2024-11-01 11:45:00', 'Student', 'Gluten', FALSE, FALSE, FALSE, 'Gluten-free', '小林 健一', 'Father', '090-1234-5691', 'TR1234573', 'Short-term program'),
(8, '鈴木 和樹', '2003-07-18', '090-1234-5692', 'kazuki.suzuki@email.com', 'AC008', '2024-12-01 14:20:00', 'Student', NULL, FALSE, FALSE, FALSE, 'No restrictions', '鈴木 雅子', 'Mother', '090-1234-5693', 'TR1234574', 'Winter program');

-- Acceptance_scheduleテーブルにサンプルデータ挿入
INSERT INTO Acceptance_schedule (host_id, start_date, end_date, is_rook, is_extendable, student_id, gender, nationality) VALUES
(1, '2024-07-01', '2024-08-31', TRUE, FALSE, 1, 'female', 'Japan'),
(2, '2024-07-01', '2024-08-31', TRUE, FALSE, 2, 'male', 'Japan'),
(3, '2024-07-15', '2024-09-15', TRUE, FALSE, 3, 'female', 'Japan'),
(4, '2024-08-01', '2024-10-31', TRUE, FALSE, 4, 'male', 'Japan'),
(6, '2024-09-01', '2025-03-31', TRUE, TRUE, 5, 'female', 'Japan'),
(1, '2024-10-01', '2025-06-30', TRUE, TRUE, 6, 'male', 'Japan'),
(2, '2024-11-01', '2025-01-31', TRUE, FALSE, 7, 'female', 'Japan'),
(3, '2024-12-01', '2025-02-28', TRUE, FALSE, 8, 'male', 'Japan');

-- データ挿入完了メッセージ
SELECT 'Sample data insertion completed successfully!' as status; 