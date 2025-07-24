# 学生・ホスト・グループ・エージェンシー・学校管理API テストスイート

このフォルダには、学生管理API、ホスト管理API、グループ管理API、エージェンシー管理API、学校管理APIのCRUD操作のテストファイルが含まれています。

## ファイル構成

```
test/
├── README.md                    # このファイル
├── package.json                 # テスト用のnpmスクリプト
├── test-post-put-delete.js      # 学生基本テスト（POST、PUT、DELETE）
├── test-detailed-results.js     # 学生詳細テスト（レスポンス詳細確認）
├── test-host-crud.js            # ホストCRUDテスト
├── test-group-crud.js           # グループCRUDテスト
├── test-agency-crud.js          # エージェンシーCRUDテスト
├── test-school-crud.js          # 学校CRUDテスト
└── TEST_RESULTS_SUMMARY.md      # テスト結果サマリー
```

## 前提条件

1. **サーバーの起動**
   ```bash
   npm start
   ```

2. **依存関係のインストール**
   ```bash
   npm install axios
   ```

## テストの実行

### npmスクリプトを使用した実行
```bash
# 全テスト実行
npm run test:all

# 個別テスト実行
npm run test:basic          # 学生基本テスト
npm run test:detailed       # 学生詳細テスト
npm run test:host           # ホストCRUDテスト
npm run test:group          # グループCRUDテスト
npm run test:agency         # エージェンシーCRUDテスト
npm run test:school         # 学校CRUDテスト
```

### 直接実行

### 学生基本テストの実行
```bash
node test/test-post-put-delete.js
```

### 学生詳細テストの実行
```bash
node test/test-detailed-results.js
```

### ホストCRUDテストの実行
```bash
node test/test-host-crud.js
```

### グループCRUDテストの実行
```bash
node test/test-group-crud.js
```

### エージェンシーCRUDテストの実行
```bash
node test/test-agency-crud.js
```

### 学校CRUDテストの実行
```bash
node test/test-school-crud.js
```

## テスト内容

### 学生基本テスト (`test-post-put-delete.js`)
- POST /api/v0/student - 新規学生作成
- POST /api/v0/student - バリデーションエラー
- PUT /api/v0/student/:id - 学生情報更新
- PUT /api/v0/student/:id - 存在しない学生の更新
- PUT /api/v0/student/:id/detail - 学生詳細情報更新
- DELETE /api/v0/student/:id - 学生削除
- DELETE /api/v0/student/:id - 存在しない学生の削除

### 学生詳細テスト (`test-detailed-results.js`)
- POST /api/v0/student - 新規学生作成（詳細確認）
- PUT /api/v0/student/:id - 学生情報更新（詳細確認）
- DELETE /api/v0/student/:id - 学生削除（詳細確認）
- DELETE /api/v0/student/:id - 削除確認

### ホストCRUDテスト (`test-host-crud.js`)
- POST /api/v0/host - 新規ホスト作成
- POST /api/v0/host - バリデーションエラー
- PUT /api/v0/host/:id - ホスト情報更新
- PUT /api/v0/host/:id - 存在しないホストの更新
- PUT /api/v0/host/:id/detail - ホスト詳細情報更新
- PUT /api/v0/host/:id/family - ホストファミリー情報更新
- GET /api/v0/host/stats - ホスト統計情報取得
- DELETE /api/v0/host/:id - ホスト削除
- DELETE /api/v0/host/:id - 存在しないホストの削除

### グループCRUDテスト (`test-group-crud.js`)
- GET /api/v0/group/stats - グループ統計情報取得
- GET /api/v0/group - 全グループ一覧取得
- POST /api/v0/group - 新規グループ作成
- POST /api/v0/group - 重複グループ名作成（エラー）
- GET /api/v0/group/:id - 特定グループ詳細取得
- GET /api/v0/group/:id - 存在しないグループ取得（エラー）
- PUT /api/v0/group/:id - グループ情報更新
- PUT /api/v0/group/:id - 存在しないグループ更新（エラー）
- GET /api/v0/group?search= - 検索機能
- GET /api/v0/group?page=&limit= - ページネーション機能
- GET /api/v0/group?sort_by=&sort_order= - ソート機能
- DELETE /api/v0/group/:id - グループ削除
- GET /api/v0/group/:id - 削除後のグループ取得（エラー）
- DELETE /api/v0/group/:id - 存在しないグループ削除（エラー）

### エージェンシーCRUDテスト (`test-agency-crud.js`)
- GET /api/v0/agency/stats - エージェンシー統計情報取得
- GET /api/v0/agency - 全エージェンシー一覧取得
- POST /api/v0/agency - 新規エージェンシー作成
- POST /api/v0/agency - 重複エージェンシー名作成（エラー）
- GET /api/v0/agency/:id - 特定エージェンシー詳細取得
- GET /api/v0/agency/:id - 存在しないエージェンシー取得（エラー）
- PUT /api/v0/agency/:id - エージェンシー情報更新
- PUT /api/v0/agency/:id - 存在しないエージェンシー更新（エラー）
- GET /api/v0/agency?search= - 検索機能
- GET /api/v0/agency?page=&limit= - ページネーション機能
- GET /api/v0/agency?sort_by=&sort_order= - ソート機能
- DELETE /api/v0/agency/:id - エージェンシー削除
- GET /api/v0/agency/:id - 削除後のエージェンシー取得（エラー）
- DELETE /api/v0/agency/:id - 存在しないエージェンシー削除（エラー）

### 学校CRUDテスト (`test-school-crud.js`)
- GET /api/v0/school/stats - 学校統計情報取得
- GET /api/v0/school - 全学校一覧取得
- POST /api/v0/school - 新規学校作成
- POST /api/v0/school - 重複学校名作成（エラー）
- POST /api/v0/school - 無効なカテゴリ作成（エラー）
- POST /api/v0/school - 必須フィールド不足作成（エラー）
- GET /api/v0/school/:id - 特定学校詳細取得
- GET /api/v0/school/:id - 存在しない学校取得（エラー）
- PUT /api/v0/school/:id - 学校情報更新
- PUT /api/v0/school/:id - 存在しない学校更新（エラー）
- GET /api/v0/school?search= - 検索機能
- GET /api/v0/school?category= - カテゴリフィルター機能
- GET /api/v0/school?page=&limit= - ページネーション機能
- GET /api/v0/school?sort_by=&sort_order= - ソート機能
- DELETE /api/v0/school/:id - 学校削除
- GET /api/v0/school/:id - 削除後の学校取得（エラー）
- DELETE /api/v0/school/:id - 存在しない学校削除（エラー）

## テスト結果

最新のテスト結果は `TEST_RESULTS_SUMMARY.md` を参照してください。

### 成功基準
- **学生基本テスト**: 7/7 テスト成功 (100%)
- **学生詳細テスト**: 4/4 テスト成功 (100%)
- **ホストCRUDテスト**: 9/9 テスト成功 (100%)
- **グループCRUDテスト**: 14/14 テスト成功 (100%)
- **エージェンシーCRUDテスト**: 14/14 テスト成功 (100%)
- **学校CRUDテスト**: 17/17 テスト成功 (100%)

## トラブルシューティング

### よくある問題

1. **サーバーが起動していない**
   ```
   エラー: Request failed with status code 404
   ```
   → `npm start` でサーバーを起動してください

2. **axiosがインストールされていない**
   ```
   エラー: Cannot find module 'axios'
   ```
   → `npm install axios` を実行してください

3. **データベース接続エラー**
   ```
   エラー: データベース接続に失敗しました
   ```
   → データベース設定を確認してください

## テストデータ

テストでは以下のデータが使用されます：

### 学生作成テストデータ
- 名前: テスト 太郎
- 到着日: 2024-01-15
- 出発日: 2024-06-15
- 性別: M
- 学校ID: 1
- エージェンシーID: 1
- グループID: 1

### 学生更新テストデータ
- 名前: 更新 次郎
- 到着日: 2024-02-01
- 出発日: 2024-07-01
- 学校ID: 2
- エージェンシーID: 2
- グループID: 2

### ホスト作成テストデータ
- 名前: テスト ホスト
- 電話: 090-1234-5678
- 住所: 東京都渋谷区テスト1-2-3
- ステータス: Ok
- メール: test.host@example.com
- 部屋数: 2
- ペット: なし
- ファミリー: 妻、息子

### ホスト更新テストデータ
- 名前: 更新 ホスト
- 電話: 090-9876-5432
- 住所: 東京都新宿区更新4-5-6
- ステータス: Great
- メール: update.host@example.com
- 部屋数: 3
- ペット: あり
- ファミリー: 妻

### グループ作成テストデータ
- 名前: テストグループA

### グループ更新テストデータ
- 名前: テストグループA（更新）

### エージェンシー作成テストデータ
- 名前: テストエージェンシーA

### エージェンシー更新テストデータ
- 名前: テストエージェンシーA（更新）

### 学校作成テストデータ
- 名前: テスト学校A
- カテゴリ: language

### 学校更新テストデータ
- 名前: テスト学校A（更新）
- カテゴリ: university

## 注意事項

- テスト実行前にサーバーが起動していることを確認してください
- テストは実際のデータベースにデータを作成・更新・削除します
- 本番環境では実行しないでください
- テストデータは自動的にクリーンアップされます（削除テストにより） 