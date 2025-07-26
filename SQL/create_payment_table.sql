-- Paymentテーブルの作成
CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type ENUM('income', 'expense') NOT NULL COMMENT '支払いタイプ（収入/支出）',
  amount DECIMAL(10,2) NOT NULL COMMENT '金額',
  currency VARCHAR(3) DEFAULT 'JPY' COMMENT '通貨',
  description TEXT COMMENT '支払い説明',
  category VARCHAR(100) COMMENT 'カテゴリ',
  payment_method ENUM('cash', 'bank_transfer', 'credit_card', 'debit_card', 'check', 'other') COMMENT '支払い方法',
  status ENUM('pending', 'completed', 'cancelled', 'failed') DEFAULT 'pending' COMMENT '支払いステータス',
  payment_date DATE NOT NULL COMMENT '支払い日',
  due_date DATE COMMENT '支払期限',
  company_id INT UNSIGNED COMMENT '関連会社ID',
  student_id INT COMMENT '関連学生ID',
  host_id INT COMMENT '関連ホストID',
  reference_number VARCHAR(100) COMMENT '参照番号',
  notes TEXT COMMENT '備考',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_type (type),
  INDEX idx_status (status),
  INDEX idx_payment_date (payment_date),
  INDEX idx_category (category),
  INDEX idx_company_id (company_id),
  INDEX idx_student_id (student_id),
  INDEX idx_host_id (host_id),
  
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  FOREIGN KEY (host_id) REFERENCES host(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支払い管理テーブル';

-- サンプルデータの挿入
INSERT INTO payments (type, amount, currency, description, category, payment_method, status, payment_date, due_date, company_id, student_id, host_id, reference_number, notes) VALUES
-- 収入データ
('income', 50000.00, 'JPY', '学生からの滞在費', '滞在費', 'bank_transfer', 'completed', '2024-01-15', '2024-01-10', 1, 1, 1, 'INC-2024-001', '1月分の滞在費'),
('income', 75000.00, 'JPY', 'エージェンシーからの紹介料', '紹介料', 'bank_transfer', 'completed', '2024-01-20', '2024-01-15', 2, 2, 2, 'INC-2024-002', '新規学生紹介料'),
('income', 30000.00, 'JPY', '学校からの手数料', '手数料', 'bank_transfer', 'pending', '2024-02-01', '2024-01-31', 3, 3, 3, 'INC-2024-003', '2月分手数料'),

-- 支出データ
('expense', 15000.00, 'JPY', 'ホストへの支払い', 'ホスト支払い', 'bank_transfer', 'completed', '2024-01-15', '2024-01-10', 1, 1, 1, 'EXP-2024-001', '1月分ホスト支払い'),
('expense', 5000.00, 'JPY', '事務用品購入', '事務費', 'credit_card', 'completed', '2024-01-18', NULL, NULL, NULL, NULL, 'EXP-2024-002', 'オフィス用品'),
('expense', 20000.00, 'JPY', '広告費', '広告費', 'bank_transfer', 'pending', '2024-02-01', '2024-01-31', NULL, NULL, NULL, 'EXP-2024-003', 'Web広告費'); 