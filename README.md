# SMAppAPI

学生管理システムのNode.js RESTful API

## 概要

このプロジェクトは、学生管理システムのバックエンドAPIです。Node.js、Express.js、Sequelize ORM、MySQLを使用して構築されており、学生、ホスト、エージェンシー、学校、グループの管理機能を提供します。

## 主な機能

- **学生管理**: 学生のCRUD操作
- **ホスト管理**: ホストファミリーの管理
- **滞在スケジュール管理**: 学生の滞在スケジュール管理
- **滞在者数確認**: 特定の日付の滞在者数確認
- **エージェンシー管理**: エージェンシー情報の管理
- **学校管理**: 学校情報の管理
- **グループ管理**: グループ情報の管理

## 技術スタック

- **Node.js**: JavaScriptランタイム
- **Express.js**: Webアプリケーションフレームワーク
- **Sequelize ORM**: MySQLデータベースORM
- **MySQL**: リレーショナルデータベース
- **dotenv**: 環境変数管理

## 必要条件

- Node.js 16.0以上
- MySQL 8.0以上
- npm または yarn

## セットアップ

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **環境変数の設定**
   `.env`ファイルを作成し、以下の設定を追加：
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=your_password
   DB_NAME=smapp_db
   ```

3. **データベースのセットアップ**
   ```bash
   # MySQLでデータベースを作成
   CREATE DATABASE smapp_db;
   
   # SQLスクリプトを実行
   node test/execute-sql.js
   ```

4. **サーバーの起動**
   ```bash
   npm start
   ```

## プロジェクト構造

```
SMAppAPI/
├── app.js                    # メインアプリケーションファイル
├── package.json              # プロジェクト設定
├── .env                      # 環境変数
├── .sequelizerc              # Sequelize設定
├── .gitignore               # Git除外設定
├── README.md                # プロジェクト説明
├── bin/                     # サーバー起動スクリプト
│   └── www
├── controllers/             # コントローラー
│   ├── hostController.js
│   ├── studentController.js
│   ├── agencyController.js
│   ├── schoolController.js
│   └── groupController.js
├── routes/                  # ルート定義
│   ├── index.js
│   ├── hosts.js
│   ├── students.js
│   ├── agencies.js
│   ├── schools.js
│   └── groups.js
├── sequelize/               # Sequelize設定とモデル
│   ├── config/
│   │   └── config.js
│   └── models/
│       ├── index.js
│       ├── host.js
│       ├── host_detail.js
│       ├── host_family.js
│       ├── students.js
│       ├── student_details.js
│       ├── acceptance_schedule.js
│       ├── agencies.js
│       ├── schools.js
│       └── groups.js
├── public/                  # 静的ファイル
│   ├── index.html
│   └── stylesheets/
│       └── style.css
├── SQL/                     # データベーススクリプト
│   ├── create_table.sql
│   ├── insert_data.sql
│   ├── delete_data.sql
│   ├── views.sql
│   ├── triggers.sql
│   └── executed/            # 実行済みSQLスクリプト
│       └── add_duration_column.sql
└── test/                    # テストファイル
    ├── test-occupancy-api.js
    ├── test-host-crud.js
    ├── test-student-crud.js
    ├── test-agency-crud.js
    ├── test-school-crud.js
    ├── test-group-crud.js
    ├── test-post-put-delete.js
    ├── test-detailed-results.js
    ├── test-db-connection.js
    ├── execute-sql.js
    ├── README.md
    ├── package.json
    └── TEST_RESULTS_SUMMARY.md
```

## APIエンドポイント

### ホスト管理
- `GET /api/v0/host` - ホスト一覧取得
- `GET /api/v0/host/:id` - ホスト詳細取得
- `POST /api/v0/host` - ホスト作成
- `PUT /api/v0/host/:id` - ホスト更新
- `DELETE /api/v0/host/:id` - ホスト削除

### 滞在者数確認（新機能）
- `GET /api/v0/host/occupancy?date=YYYY-MM-DD` - 特定の日付の滞在者数取得
- `GET /api/v0/host/occupancy?date=YYYY-MM-DD&host_id=1` - 特定ホストの特定日付の滞在者数取得
- `GET /api/v0/host/occupancy/range?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD` - 日付範囲での滞在者数取得

### 滞在スケジュール管理（新機能）
- `GET /api/v0/host/schedules` - 滞在スケジュール一覧取得
- `POST /api/v0/host/schedules` - 滞在スケジュール作成
- `GET /api/v0/host/schedules/:id` - 特定の滞在スケジュール取得
- `PUT /api/v0/host/schedules/:id` - 滞在スケジュール更新
- `DELETE /api/v0/host/schedules/:id` - 滞在スケジュール削除

### 学生管理
- `GET /api/v0/student` - 学生一覧取得
- `GET /api/v0/student/:id` - 学生詳細取得
- `POST /api/v0/student` - 学生作成
- `PUT /api/v0/student/:id` - 学生更新
- `DELETE /api/v0/student/:id` - 学生削除

### エージェンシー管理
- `GET /api/v0/agency` - エージェンシー一覧取得
- `GET /api/v0/agency/:id` - エージェンシー詳細取得
- `POST /api/v0/agency` - エージェンシー作成
- `PUT /api/v0/agency/:id` - エージェンシー更新
- `DELETE /api/v0/agency/:id` - エージェンシー削除

### 学校管理
- `GET /api/v0/school` - 学校一覧取得
- `GET /api/v0/school/:id` - 学校詳細取得
- `POST /api/v0/school` - 学校作成
- `PUT /api/v0/school/:id` - 学校更新
- `DELETE /api/v0/school/:id` - 学校削除

### グループ管理
- `GET /api/v0/group` - グループ一覧取得
- `GET /api/v0/group/:id` - グループ詳細取得
- `POST /api/v0/group` - グループ作成
- `PUT /api/v0/group/:id` - グループ更新
- `DELETE /api/v0/group/:id` - グループ削除

### 会社管理
- `GET /api/v0/company` - 会社一覧取得
- `GET /api/v0/company/:id` - 特定の会社取得
- `POST /api/v0/company` - 会社作成
- `PUT /api/v0/company/:id` - 会社更新
- `DELETE /api/v0/company/:id` - 会社削除
- `GET /api/v0/company/stats` - 会社統計情報取得
- `GET /api/v0/company/industries` - 業界一覧取得

### 支払い管理（新機能）
- `GET /api/v0/payment` - 支払い一覧取得
- `GET /api/v0/payment/:id` - 特定の支払い取得
- `POST /api/v0/payment` - 支払い作成
- `PUT /api/v0/payment/:id` - 支払い更新
- `DELETE /api/v0/payment/:id` - 支払い削除
- `GET /api/v0/payment/summary` - 財務サマリー取得
- `GET /api/v0/payment/stats` - 支払い統計情報取得
- `GET /api/v0/payment/categories` - カテゴリ一覧取得

## テスト

### 滞在者数確認APIのテスト
```bash
node test/test-occupancy-api.js
```

### データベース接続テスト
```bash
node test/test-db-connection.js
```

### その他のCRUDテスト
```bash
node test/test-host-crud.js
node test/test-student-crud.js
node test/test-agency-crud.js
node test/test-school-crud.js
node test/test-group-crud.js
node test/test-company-crud.js
node test/test-payment-crud.js
```

## 開発

### 開発サーバーの起動
```bash
npm run dev
```

### 本番サーバーの起動
```bash
npm start
```

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。 