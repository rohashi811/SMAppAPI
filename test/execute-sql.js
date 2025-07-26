const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// データベース接続設定
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'or2003811',
  database: 'smapp_db',
  port: 3306
};

async function executeSQLFile(filePath) {
  try {
    console.log(`=== SQLファイル実行開始: ${filePath} ===`);
    
    // SQLファイルを読み込み
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    const statements = sqlContent.split(';').filter(stmt => stmt.trim());
    
    // データベースに接続
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ データベース接続成功！');
    
    // 各SQLステートメントを実行
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        try {
          console.log(`\n実行中 (${i + 1}/${statements.length}): ${statement.substring(0, 50)}...`);
          await connection.execute(statement);
          console.log(`✅ ステートメント ${i + 1} 実行成功`);
        } catch (error) {
          console.log(`❌ ステートメント ${i + 1} 実行失敗: ${error.message}`);
        }
      }
    }
    
    await connection.end();
    console.log('\n✅ SQLファイル実行完了');
    
  } catch (error) {
    console.error('❌ SQLファイル実行エラー:', error.message);
  }
}

// メイン実行
if (require.main === module) {
  const sqlFile = process.argv[2] || path.join(__dirname, '..', 'SQL', 'add_duration_column.sql');
  executeSQLFile(sqlFile).catch(console.error);
}

module.exports = { executeSQLFile }; 