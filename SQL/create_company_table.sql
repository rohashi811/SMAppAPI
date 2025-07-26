-- Companyテーブルの作成
CREATE TABLE IF NOT EXISTS companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL COMMENT '会社名',
  address TEXT COMMENT '住所',
  phone VARCHAR(50) COMMENT '電話番号',
  email VARCHAR(255) COMMENT 'メールアドレス',
  website VARCHAR(255) COMMENT 'ウェブサイトURL',
  industry VARCHAR(100) COMMENT '業界',
  size ENUM('small', 'medium', 'large') COMMENT '会社規模',
  description TEXT COMMENT '会社説明',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active' COMMENT 'ステータス',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name),
  INDEX idx_status (status),
  INDEX idx_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会社情報テーブル';

-- サンプルデータの挿入
INSERT INTO companies (name, address, phone, email, website, industry, size, description, status) VALUES
('株式会社サンプルA', '東京都渋谷区1-2-3', '03-1234-5678', 'info@sample-a.co.jp', 'https://www.sample-a.co.jp', 'IT・ソフトウェア', 'medium', 'ITソリューションを提供する会社です。', 'active'),
('株式会社サンプルB', '大阪府大阪市4-5-6', '06-8765-4321', 'contact@sample-b.co.jp', 'https://www.sample-b.co.jp', '製造業', 'large', '自動車部品の製造・販売を行っています。', 'active'),
('株式会社サンプルC', '福岡県福岡市7-8-9', '092-1111-2222', 'info@sample-c.co.jp', 'https://www.sample-c.co.jp', '小売業', 'small', '地域密着型の小売店を運営しています。', 'active'); 