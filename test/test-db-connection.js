const mysql = require('mysql2/promise');

// データベース接続設定
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'or2003811',
  database: 'smapp_db',
  port: 3306
};

async function testDatabaseConnection() {
  console.log('=== データベース接続テスト開始 ===');
  
  try {
    // データベースに接続
    console.log('データベースに接続中...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ データベース接続成功！');

    // テーブルの存在確認
    console.log('\nテーブルの存在確認中...');
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('✅ テーブル一覧:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Acceptance_scheduleテーブルの構造確認
    console.log('\nAcceptance_scheduleテーブルの構造確認中...');
    const [columns] = await connection.execute('DESCRIBE Acceptance_schedule');
    console.log('✅ Acceptance_scheduleテーブル構造:');
    columns.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} ${column.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    // サンプルデータの確認
    console.log('\nサンプルデータの確認中...');
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM Acceptance_schedule');
    console.log(`✅ Acceptance_scheduleテーブルのレコード数: ${rows[0].count}`);

    if (rows[0].count > 0) {
      const [sampleData] = await connection.execute('SELECT * FROM Acceptance_schedule LIMIT 3');
      console.log('✅ サンプルデータ:');
      sampleData.forEach((row, index) => {
        console.log(`  ${index + 1}. ID: ${row.id}, ホストID: ${row.host_id}, 開始日: ${row.start_date}, 終了日: ${row.end_date}`);
      });
    }

    // 接続を閉じる
    await connection.end();
    console.log('\n✅ データベース接続テスト完了');

  } catch (error) {
    console.error('❌ データベース接続エラー:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 解決方法:');
      console.log('1. MySQLのrootユーザーのパスワードを確認してください');
      console.log('2. または、新しいユーザーを作成してください:');
      console.log('   CREATE USER "smapp_user"@"localhost" IDENTIFIED BY "password";');
      console.log('   GRANT ALL PRIVILEGES ON smapp_db.* TO "smapp_user"@"localhost";');
      console.log('   FLUSH PRIVILEGES;');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 解決方法:');
      console.log('1. MySQLサーバーが起動しているか確認してください');
      console.log('2. ポート3306が利用可能か確認してください');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 解決方法:');
      console.log('1. データベース "smapp_db" が存在するか確認してください');
      console.log('2. データベースが存在しない場合は作成してください:');
      console.log('   CREATE DATABASE smapp_db;');
    }
  }
}

// テスト実行
if (require.main === module) {
  testDatabaseConnection().catch(console.error);
}

module.exports = { testDatabaseConnection }; 