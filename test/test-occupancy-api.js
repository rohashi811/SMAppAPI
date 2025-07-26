const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/host';
const STUDENT_URL = 'http://localhost:3000/api/v0/student';

// テスト結果を格納する配列
let testResults = [];

// テスト結果を記録する関数
function recordTestResult(testName, success, message, data = null) {
  const result = {
    test: testName,
    success,
    message,
    data,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  console.log(`[${success ? '✓' : '✗'}] ${testName}: ${message}`);
  if (data) {
    console.log('   Data:', JSON.stringify(data, null, 2));
  }
}

// テスト用のホストデータを作成
async function createTestHosts() {
  try {
    console.log('\n--- テスト用ホストデータ作成開始 ---');
    
    const testHosts = [
      {
        first_name: '田中',
        last_name: '太郎',
        phone: '090-1234-5678',
        address: '東京都渋谷区テスト1-2-3',
        status: 'Ok',
        host_detail: {
          email: 'tanaka.taro@example.com',
          num_of_room: 2,
          pet: false,
          note: 'テスト用ホスト1'
        }
      },
      {
        first_name: '佐藤',
        last_name: '花子',
        phone: '090-8765-4321',
        address: '東京都新宿区テスト4-5-6',
        status: 'Great',
        host_detail: {
          email: 'sato.hanako@example.com',
          num_of_room: 3,
          pet: true,
          note: 'テスト用ホスト2'
        }
      }
    ];

    const createdHosts = [];
    for (const hostData of testHosts) {
      try {
        const response = await axios.post(`${BASE_URL}`, hostData);
        if (response.status === 201 && response.data.success) {
          createdHosts.push(response.data.data);
          console.log(`ホスト作成成功: ${hostData.first_name} ${hostData.last_name}`);
        }
      } catch (error) {
        console.log(`ホスト作成スキップ: ${hostData.first_name} ${hostData.last_name} (既に存在する可能性)`);
      }
    }

    recordTestResult(
      'テストホストデータ準備',
      true,
      'テスト用ホストデータの準備完了',
      { created_hosts: createdHosts.length }
    );

    return createdHosts;
  } catch (error) {
    recordTestResult(
      'テストホストデータ準備',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
    return [];
  }
}

// テスト用の学生データを作成
async function createTestStudents() {
  try {
    console.log('\n--- テスト用学生データ作成開始 ---');
    
    const testStudents = [
      {
        first_name: 'John',
        last_name: 'Smith',
        gender: 'male',
        arrival_date: '2024-01-10',
        leaving_date: '2024-01-20',
        school_id: 1,
        agency_id: 1,
        group_id: 1
      },
      {
        first_name: 'Jane',
        last_name: 'Doe',
        gender: 'female',
        arrival_date: '2024-01-15',
        leaving_date: '2024-01-25',
        school_id: 1,
        agency_id: 1,
        group_id: 1
      },
      {
        first_name: 'Mike',
        last_name: 'Johnson',
        gender: 'male',
        arrival_date: '2024-01-12',
        leaving_date: '2024-01-18',
        school_id: 1,
        agency_id: 1,
        group_id: 1
      }
    ];

    const createdStudents = [];
    for (const studentData of testStudents) {
      try {
        const response = await axios.post(`${STUDENT_URL}`, studentData);
        if (response.status === 201 && response.data.success) {
          createdStudents.push(response.data.data);
          console.log(`学生作成成功: ${studentData.first_name} ${studentData.last_name}`);
        }
      } catch (error) {
        console.log(`学生作成スキップ: ${studentData.first_name} ${studentData.last_name} (既に存在する可能性)`);
      }
    }

    recordTestResult(
      'テスト学生データ準備',
      true,
      'テスト用学生データの準備完了',
      { created_students: createdStudents.length }
    );

    return createdStudents;
  } catch (error) {
    recordTestResult(
      'テスト学生データ準備',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
    return [];
  }
}

// テスト用の滞在スケジュールデータを作成
async function createTestSchedules(hosts, students) {
  try {
    console.log('\n--- テスト用スケジュールデータ作成開始 ---');
    
    if (hosts.length === 0 || students.length === 0) {
      recordTestResult(
        'テストスケジュールデータ準備',
        false,
        'ホストまたは学生データが不足しています'
      );
      return [];
    }

    const testSchedules = [
      {
        host_id: hosts[0].id,
        start_date: '2024-01-10',
        end_date: '2024-01-20',
        is_rook: true,
        student_id: students[0].id,
        gender: 'male',
        nationality: 'Japan'
      },
      {
        host_id: hosts[0].id,
        start_date: '2024-01-15',
        end_date: '2024-01-25',
        is_rook: true,
        student_id: students[1].id,
        gender: 'female',
        nationality: 'Japan'
      },
      {
        host_id: hosts[1].id,
        start_date: '2024-01-12',
        end_date: '2024-01-18',
        is_rook: true,
        student_id: students[2].id,
        gender: 'male',
        nationality: 'Japan'
      }
    ];

    const createdSchedules = [];
    for (const scheduleData of testSchedules) {
      try {
        const response = await axios.post(`${BASE_URL}/schedules`, scheduleData);
        if (response.status === 201 && response.data.success) {
          createdSchedules.push(response.data.data);
          console.log(`スケジュール作成成功: ホスト${scheduleData.host_id} - 学生${scheduleData.student_id}`);
        }
      } catch (error) {
        console.log(`スケジュール作成スキップ: ホスト${scheduleData.host_id} - 学生${scheduleData.student_id} (既に存在する可能性)`);
      }
    }

    recordTestResult(
      'テストスケジュールデータ準備',
      true,
      'テスト用スケジュールデータの準備完了',
      { created_schedules: createdSchedules.length }
    );

    return createdSchedules;
  } catch (error) {
    recordTestResult(
      'テストスケジュールデータ準備',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
    return [];
  }
}

// GET テスト - 特定の日付の滞在者数取得（全ホスト）
async function testGetOccupancyByDate() {
  try {
    console.log('\n--- GET /api/host/occupancy テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy?date=2024-01-15`);
    
    if (response.status === 200 && response.data.success) {
      const data = response.data.data;
      recordTestResult(
        'GET /api/host/occupancy - 特定の日付の滞在者数取得',
        true,
        `指定日付の滞在者数が正常に取得されました。総滞在者数: ${data.total_occupancy}, ホスト数: ${data.host_count}`,
        {
          date: data.date,
          total_occupancy: data.total_occupancy,
          host_count: data.host_count,
          has_occupancy_by_host: !!data.occupancy_by_host
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy - 特定の日付の滞在者数取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/host/occupancy - 特定の日付の滞在者数取得',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// GET テスト - 特定のホストの特定日付の滞在者数取得
async function testGetOccupancyByDateForSpecificHost(hostId = 1) {
  try {
    console.log('\n--- GET /api/host/occupancy (特定ホスト) テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy?date=2024-01-15&host_id=${hostId}`);
    
    if (response.status === 200 && response.data.success) {
      const data = response.data.data;
      recordTestResult(
        'GET /api/host/occupancy (特定ホスト) - 特定ホストの滞在者数取得',
        true,
        `指定ホストの滞在者数が正常に取得されました。滞在者数: ${data.occupancy_count}`,
        {
          date: data.date,
          host_id: data.host_id,
          host_name: data.host_name,
          occupancy_count: data.occupancy_count,
          schedules_count: data.schedules ? data.schedules.length : 0
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy (特定ホスト) - 特定ホストの滞在者数取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/host/occupancy (特定ホスト) - 特定ホストの滞在者数取得',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// GET テスト - 日付範囲での滞在者数取得
async function testGetOccupancyByDateRange() {
  try {
    console.log('\n--- GET /api/host/occupancy/range テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy/range?start_date=2024-01-10&end_date=2024-01-25`);
    
    if (response.status === 200 && response.data.success) {
      const data = response.data.data;
      recordTestResult(
        'GET /api/host/occupancy/range - 日付範囲での滞在者数取得',
        true,
        `指定期間の滞在者数が正常に取得されました。期間: ${data.period.start_date} ～ ${data.period.end_date}`,
        {
          period: data.period,
          daily_occupancy_count: data.daily_occupancy ? data.daily_occupancy.length : 0,
          host_summary_count: data.host_summary ? data.host_summary.length : 0,
          has_daily_data: !!data.daily_occupancy,
          has_host_summary: !!data.host_summary
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy/range - 日付範囲での滞在者数取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/host/occupancy/range - 日付範囲での滞在者数取得',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// GET テスト - 特定のホストの日付範囲での滞在者数取得
async function testGetOccupancyByDateRangeForSpecificHost(hostId = 1) {
  try {
    console.log('\n--- GET /api/host/occupancy/range (特定ホスト) テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy/range?start_date=2024-01-10&end_date=2024-01-25&host_id=${hostId}`);
    
    if (response.status === 200 && response.data.success) {
      const data = response.data.data;
      recordTestResult(
        'GET /api/host/occupancy/range (特定ホスト) - 特定ホストの期間滞在者数取得',
        true,
        `指定ホストの期間滞在者数が正常に取得されました`,
        {
          period: data.period,
          daily_occupancy_count: data.daily_occupancy ? data.daily_occupancy.length : 0,
          host_summary_count: data.host_summary ? data.host_summary.length : 0,
          has_daily_data: !!data.daily_occupancy,
          has_host_summary: !!data.host_summary
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy/range (特定ホスト) - 特定ホストの期間滞在者数取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/host/occupancy/range (特定ホスト) - 特定ホストの期間滞在者数取得',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// エラーテスト - 日付パラメータなし
async function testGetOccupancyWithoutDate() {
  try {
    console.log('\n--- GET /api/host/occupancy (エラーテスト) テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy`);
    
    // エラーが期待される
    recordTestResult(
      'GET /api/host/occupancy (エラーテスト) - 日付パラメータなし',
      false,
      'エラーが発生しませんでした（エラーが期待される）',
      response.data
    );
  } catch (error) {
    if (error.response && error.response.status === 400) {
      recordTestResult(
        'GET /api/host/occupancy (エラーテスト) - 日付パラメータなし',
        true,
        '適切なエラーレスポンスが返されました',
        {
          status: error.response.status,
          message: error.response.data.message
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy (エラーテスト) - 日付パラメータなし',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// エラーテスト - 無効な日付形式
async function testGetOccupancyWithInvalidDate() {
  try {
    console.log('\n--- GET /api/host/occupancy (無効日付) テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy?date=invalid-date`);
    
    // エラーが期待される
    recordTestResult(
      'GET /api/host/occupancy (エラーテスト) - 無効な日付形式',
      false,
      'エラーが発生しませんでした（エラーが期待される）',
      response.data
    );
  } catch (error) {
    if (error.response && error.response.status === 400) {
      recordTestResult(
        'GET /api/host/occupancy (エラーテスト) - 無効な日付形式',
        true,
        '適切なエラーレスポンスが返されました',
        {
          status: error.response.status,
          message: error.response.data.message
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy (エラーテスト) - 無効な日付形式',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// エラーテスト - 日付範囲の無効な順序
async function testGetOccupancyWithInvalidDateRange() {
  try {
    console.log('\n--- GET /api/host/occupancy/range (無効範囲) テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/occupancy/range?start_date=2024-01-25&end_date=2024-01-10`);
    
    // エラーが期待される
    recordTestResult(
      'GET /api/host/occupancy/range (エラーテスト) - 無効な日付範囲',
      false,
      'エラーが発生しませんでした（エラーが期待される）',
      response.data
    );
  } catch (error) {
    if (error.response && error.response.status === 400) {
      recordTestResult(
        'GET /api/host/occupancy/range (エラーテスト) - 無効な日付範囲',
        true,
        '適切なエラーレスポンスが返されました',
        {
          status: error.response.status,
          message: error.response.data.message
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/occupancy/range (エラーテスト) - 無効な日付範囲',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// テスト結果サマリーを出力
function printTestSummary() {
  console.log('\n=== テスト結果サマリー ===');
  const totalTests = testResults.length;
  const passedTests = testResults.filter(result => result.success).length;
  const failedTests = totalTests - passedTests;

  console.log(`総テスト数: ${totalTests}`);
  console.log(`成功: ${passedTests}`);
  console.log(`失敗: ${failedTests}`);
  console.log(`成功率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests > 0) {
    console.log('\n失敗したテスト:');
    testResults
      .filter(result => !result.success)
      .forEach(result => {
        console.log(`- ${result.test}: ${result.message}`);
      });
  }

  console.log('\n詳細なテスト結果:');
  testResults.forEach(result => {
    console.log(`[${result.success ? '✓' : '✗'}] ${result.test}`);
    console.log(`   時刻: ${result.timestamp}`);
    console.log(`   メッセージ: ${result.message}`);
    if (result.data) {
      console.log(`   データ: ${JSON.stringify(result.data)}`);
    }
    console.log('');
  });
}

// メインのテスト実行関数
async function runAllTests() {
  console.log('=== 滞在者数確認API テスト開始 ===');
  console.log(`テスト対象URL: ${BASE_URL}`);
  console.log(`開始時刻: ${new Date().toISOString()}`);

  try {
    // テストデータの準備
    const hosts = await createTestHosts();
    const students = await createTestStudents();
    const schedules = await createTestSchedules(hosts, students);

    // 正常系テスト
    await testGetOccupancyByDate();
    if (hosts.length > 0) {
      await testGetOccupancyByDateForSpecificHost(hosts[0].id);
    }
    await testGetOccupancyByDateRange();
    if (hosts.length > 0) {
      await testGetOccupancyByDateRangeForSpecificHost(hosts[0].id);
    }

    // エラー系テスト
    await testGetOccupancyWithoutDate();
    await testGetOccupancyWithInvalidDate();
    await testGetOccupancyWithInvalidDateRange();

  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error);
  }

  // テスト結果サマリーを出力
  printTestSummary();

  console.log(`\nテスト終了時刻: ${new Date().toISOString()}`);
  console.log('=== 滞在者数確認API テスト終了 ===');
}

// テスト実行
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults
}; 