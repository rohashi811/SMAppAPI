CREATE TABLE `Schools`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `category` ENUM('Language','Secondary', 'College', 'University', 'Graduate')
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Agencies`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Groups`(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Students`(  
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `arrival_date` DATE NOT NULL,
    `leaving_date` DATE,
    `duration_of_stay` INT 
        AS (
            CASE
                WHEN `leaving_date` IS NULL THEN NULL
                ELSE DATEDIFF(`leaving_date`, `arrival_date`)
            END
        ) STORED,
    `group_id` INT,
    `gender` ENUM('Male','Female','Other') NOT NULL,
    `agency_id` INT,
    `school_id` INT,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX (`agency_id`),
    INDEX (`school_id`),
    CONSTRAINT `fk_students_agency`
        FOREIGN KEY (`agency_id`) REFERENCES `Agencies`(`id`)
            ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_students_school`
        FOREIGN KEY (`school_id`) REFERENCES `Schools`(`id`)
            ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT `fk_students_group`
        FOREIGN KEY (`group_id`) REFERENCES `Groups`(`id`)
            ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Student_Details` (
  `student_id` INT NOT NULL,
  `jp_name` VARCHAR(100),
  `date_of_birth` DATE,
  `phone_number` VARCHAR(20),
  `email` VARCHAR(100),
  `flight_number` VARCHAR(50),
  `arrival_time` TIME,
  `visa` ENUM('ETA','Student','WH'),
  `allergies` TEXT,
  `smoke` BOOLEAN DEFAULT FALSE,
  `pet` BOOLEAN DEFAULT FALSE,
  `kid` BOOLEAN DEFAULT FALSE,
  `meal` INT,
  `note` TEXT,
  PRIMARY KEY (`student_id`),
  CONSTRAINT `fk_student_details_student`
    FOREIGN KEY (`student_id`) REFERENCES `Students`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Homestay` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Homestay_Details` (
  `homestay_id` INT NOT NULL,
  `email` VARCHAR(100),
  `num_of_room` INT,
  `housemates` TEXT,
  `pet` BOOLEAN DEFAULT FALSE,
  `note` TEXT,
  PRIMARY KEY (`homestay_id`),
  CONSTRAINT `fk_homestay_details_homestay`
    FOREIGN KEY (`homestay_id`) REFERENCES `Homestay`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Homestay_Family` (
  `homestay_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `relationship` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20),
  `date_of_birth` DATE,
  PRIMARY KEY (`homestay_id`),
  CONSTRAINT `fk_homestay_family_homestay`
    FOREIGN KEY (`homestay_id`) REFERENCES `Homestay`(`id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Student_Homestay` (
  `student_id` INT NOT NULL,
  `homestay_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `duration` INT 
    AS (DATEDIFF(`end_date`, `start_date`))
    STORED,
  PRIMARY KEY (`student_id`, `homestay_id`, `start_date`),
  INDEX (`homestay_id`),
  CONSTRAINT `fk_sh_student`
    FOREIGN KEY (`student_id`) REFERENCES `Students`(`id`)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
  CONSTRAINT `fk_sh_homestay`
    FOREIGN KEY (`homestay_id`) REFERENCES `Homestay`(`id`)
      ON UPDATE CASCADE
      ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;