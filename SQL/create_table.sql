-- 学校情報を記録するテーブル
CREATE TABLE Schools (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('language', 'secondary', 'college', 'university') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_schools_category ON Schools(category);
CREATE INDEX idx_schools_name ON Schools(name);

-- エージェント情報を記録するテーブル
CREATE TABLE Agencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_agencies_name ON Agencies(name);

-- グループ情報を記録するテーブル
CREATE TABLE StudentGroups (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_student_groups_name ON StudentGroups(name);

-- 学生情報を記録するテーブル
CREATE TABLE Students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    arrival_date DATE NOT NULL,
    leaving_date DATE,
    duration INT,
    gender ENUM('male', 'female', 'other') NOT NULL,
    school_id INT,
    agency_id INT,
    group_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES Schools(id) ON DELETE SET NULL,
    FOREIGN KEY (agency_id) REFERENCES Agencies(id) ON DELETE SET NULL,
    FOREIGN KEY (group_id) REFERENCES StudentGroups(id) ON DELETE SET NULL
);

-- インデックスの作成
CREATE INDEX idx_students_name ON Students(last_name, first_name);
CREATE INDEX idx_students_arrival_date ON Students(arrival_date);
CREATE INDEX idx_students_leaving_date ON Students(leaving_date);
CREATE INDEX idx_students_gender ON Students(gender);
CREATE INDEX idx_students_school_id ON Students(school_id);
CREATE INDEX idx_students_agency_id ON Students(agency_id);
CREATE INDEX idx_students_student_group_id ON Students(group_id);

-- 学生詳細情報を記録するテーブル
CREATE TABLE Student_details (
    student_id INT NOT NULL,
    jp_name VARCHAR(255),
    date_of_birth DATE,
    phone_number VARCHAR(15) CHECK (phone_number REGEXP '^[+]?[0-9-() ]+$'),
    email VARCHAR(255) CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    flight_number VARCHAR(10),
    arrival_time DATETIME,
    visa ENUM('ETA', 'Student', 'WH'),
    allergies TEXT,
    smoke BOOLEAN DEFAULT FALSE,
    pet BOOLEAN DEFAULT FALSE,
    kid BOOLEAN DEFAULT FALSE,
    meal TEXT,
    emergency_contact VARCHAR(255),
    emergency_contact_relation VARCHAR(50),
    emergency_phone VARCHAR(15) CHECK (emergency_phone REGEXP '^[+]?[0-9-() ]+$'),
    passport_number VARCHAR(20),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE CASCADE
);

-- インデックスの作成
CREATE INDEX idx_student_details_student_id ON Student_details(student_id);
CREATE INDEX idx_student_details_jp_name ON Student_details(jp_name);
CREATE INDEX idx_student_details_email ON Student_details(email);
CREATE INDEX idx_student_details_visa ON Student_details(visa);
CREATE INDEX idx_student_details_arrival_time ON Student_details(arrival_time);

-- ホスト情報を記録するテーブル
CREATE TABLE Host (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) CHECK (phone REGEXP '^[+]?[0-9-() ]+$'),
    address TEXT NOT NULL,
    status ENUM('Great', 'Ok', 'NG') NOT NULL DEFAULT 'Ok',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_host_name ON Host(last_name, first_name);
CREATE INDEX idx_host_phone ON Host(phone);

-- ホスト詳細情報を記録するテーブル
CREATE TABLE Host_details (
    host_id INT NOT NULL,
    email VARCHAR(255) CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    num_of_room INT DEFAULT 1,
    pet BOOLEAN DEFAULT FALSE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES Host(id) ON DELETE CASCADE
);

-- インデックスの作成
CREATE INDEX idx_host_details_host_id ON Host_details(host_id);
CREATE INDEX idx_host_details_email ON Host_details(email);
CREATE INDEX idx_host_details_num_of_room ON Host_details(num_of_room);
-- ホストファミリー情報を記録するテーブル
CREATE TABLE Host_family (
    host_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    phone VARCHAR(15) CHECK (phone REGEXP '^[+]?[0-9-() ]+$'),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES Host(id) ON DELETE CASCADE
);

-- インデックスの作成
CREATE INDEX idx_host_family_host_id ON Host_family(host_id);
CREATE INDEX idx_host_family_name ON Host_family(name);
CREATE INDEX idx_host_family_relation ON Host_family(relation);

-- 受け入れスケジュールを記録するテーブル
CREATE TABLE Acceptance_schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    host_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_rook BOOLEAN DEFAULT TRUE,
    is_extendable BOOLEAN DEFAULT FALSE,
    student_id INT,
    gender ENUM('male', 'female', 'other'),
    nationality VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES Host(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES Students(id) ON DELETE SET NULL,
    CHECK (start_date <= end_date) -- 必要に応じて有効化
);

-- is_rookがTRUEの場合、student_id, genderはStudentsテーブルから取得し、nationalityは'Japan'に設定する
-- 例: INSERT INTO Acceptance_schedule (host_id, start_date, end_date, is_rook, is_extendable, student_id, gender, nationality)
--     SELECT 1, '2024-07-01', '2024-07-31', TRUE, FALSE, s.id, s.gender, 'Japan' FROM Students s WHERE s.id = 123;

CREATE INDEX idx_acceptance_schedule_host_id ON Acceptance_schedule(host_id);
CREATE INDEX idx_acceptance_schedule_student_id ON Acceptance_schedule(student_id);
CREATE INDEX idx_acceptance_schedule_start_date ON Acceptance_schedule(start_date);
CREATE INDEX idx_acceptance_schedule_end_date ON Acceptance_schedule(end_date);



