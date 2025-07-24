const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/host';

// テスト用のホストデータ
const testHostData = {
  first_name: 'テスト',
  last_name: 'ホスト',
  phone: '090-1234-5678',
  address: '東京都渋谷区テスト1-2-3',
  status: 'Ok',
  host_detail: {
    email: 'test.host@example.com',
    num_of_room: 2,
    pet: false,
    note: 'テスト用のホストデータです'
  },
  host_family: [
    {
      name: 'テスト 花子',
      relation: '妻',
      phone: '090-8765-4321',
      date_of_birth: '1980-05-15'
    },
    {
      name: 'テスト 太郎',
      relation: '息子',
      phone: null,
      date_of_birth: '2010-08-20'
    }
  ]
};

// 更新用のホストデータ
const updateHostData = {
  first_name: '更新',
  last_name: 'ホスト',
  phone: '090-9876-5432',
  address: '東京都新宿区更新4-5-6',
  status: 'Great',
  host_detail: {
    email: 'update.host@example.com',
    num_of_room: 3,
    pet: true,
    note: '更新されたテスト用のホストデータです'
  },
  host_family: [
    {
      name: '更新 花子',
      relation: '妻',
      phone: '090-1111-2222',
      date_of_birth: '1982-03-10'
    }
  ]
};

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

// テスト結果を表示する関数
function displayTestResults() {
  console.log('\n' + '='.repeat(60));
  console.log('ホストCRUDテスト結果サマリー');
  console.log('='.repeat(60));
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  
  console.log(`総テスト数: ${testResults.length}`);
  console.log(`成功: ${passed}`);
  console.log(`失敗: ${failed}`);
  console.log(`成功率: ${((passed / testResults.length) * 100).toFixed(1)}%`);
  
  console.log('\n詳細結果:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✓' : '✗';
    console.log(`${index + 1}. [${status}] ${result.test}`);
    if (!result.success) {
      console.log(`   エラー: ${result.message}`);
    }
  });
}

// POST テスト - 新規ホスト作成
async function testCreateHost() {
  try {
    console.log('\n--- POST /api/host テスト開始 ---');
    
    const response = await axios.post(BASE_URL, testHostData);
    
    if (response.status === 201 && response.data.success) {
      recordTestResult(
        'POST /api/host - 新規ホスト作成',
        true,
        'ホストが正常に作成されました',
        {
          host_id: response.data.data.id,
          name: `${response.data.data.first_name} ${response.data.data.last_name}`,
          has_detail: !!response.data.data.HostDetail,
          family_count: response.data.data.HostFamily ? response.data.data.HostFamily.length : 0
        }
      );
      return response.data.data.id; // 作成されたホストのIDを返す
    } else {
      recordTestResult(
        'POST /api/host - 新規ホスト作成',
        false,
        '予期しないレスポンス形式',
        response.data
      );
      return null;
    }
  } catch (error) {
    recordTestResult(
      'POST /api/host - 新規ホスト作成',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
    return null;
  }
}

// POST テスト - バリデーションエラー
async function testCreateHostValidation() {
  try {
    console.log('\n--- POST /api/host バリデーションテスト開始 ---');
    
    // 必須フィールドを欠いたデータ
    const invalidData = {
      first_name: 'テスト',
      // last_name を省略
      // address を省略
      phone: '090-1234-5678'
    };
    
    const response = await axios.post(BASE_URL, invalidData);
    
    // バリデーションエラーが発生することを期待
    recordTestResult(
      'POST /api/host - バリデーションエラー',
      false,
      'バリデーションエラーが発生しませんでした（期待される動作）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 400) {
      recordTestResult(
        'POST /api/host - バリデーションエラー',
        true,
        'バリデーションエラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'POST /api/host - バリデーションエラー',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// PUT テスト - ホスト情報更新
async function testUpdateHost(hostId) {
  if (!hostId) {
    recordTestResult(
      'PUT /api/host/:id - ホスト情報更新',
      false,
      '更新対象のホストIDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/host/:id テスト開始 ---');
    
    const response = await axios.put(`${BASE_URL}/${hostId}`, updateHostData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/host/:id - ホスト情報更新',
        true,
        'ホスト情報が正常に更新されました',
        {
          host_id: response.data.data.id,
          updated_name: `${response.data.data.first_name} ${response.data.data.last_name}`,
          updated_status: response.data.data.status,
          updated_address: response.data.data.address,
          family_count: response.data.data.HostFamily ? response.data.data.HostFamily.length : 0
        }
      );
    } else {
      recordTestResult(
        'PUT /api/host/:id - ホスト情報更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/host/:id - ホスト情報更新',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// PUT テスト - 存在しないホストの更新
async function testUpdateNonExistentHost() {
  try {
    console.log('\n--- PUT /api/host/:id 存在しないホストテスト開始 ---');
    
    const nonExistentId = 99999;
    const response = await axios.put(`${BASE_URL}/${nonExistentId}`, updateHostData);
    
    recordTestResult(
      'PUT /api/host/:id - 存在しないホストの更新',
      false,
      '存在しないホストの更新が成功してしまいました（期待される動作ではありません）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 404) {
      recordTestResult(
        'PUT /api/host/:id - 存在しないホストの更新',
        true,
        '存在しないホストの更新で404エラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'PUT /api/host/:id - 存在しないホストの更新',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// DELETE テスト - ホスト削除
async function testDeleteHost(hostId) {
  if (!hostId) {
    recordTestResult(
      'DELETE /api/host/:id - ホスト削除',
      false,
      '削除対象のホストIDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- DELETE /api/host/:id テスト開始 ---');
    
    const response = await axios.delete(`${BASE_URL}/${hostId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'DELETE /api/host/:id - ホスト削除',
        true,
        'ホストが正常に削除されました',
        response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/host/:id - ホスト削除',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'DELETE /api/host/:id - ホスト削除',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// DELETE テスト - 存在しないホストの削除
async function testDeleteNonExistentHost() {
  try {
    console.log('\n--- DELETE /api/host/:id 存在しないホストテスト開始 ---');
    
    const nonExistentId = 99999;
    const response = await axios.delete(`${BASE_URL}/${nonExistentId}`);
    
    recordTestResult(
      'DELETE /api/host/:id - 存在しないホストの削除',
      false,
      '存在しないホストの削除が成功してしまいました（期待される動作ではありません）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 404) {
      recordTestResult(
        'DELETE /api/host/:id - 存在しないホストの削除',
        true,
        '存在しないホストの削除で404エラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/host/:id - 存在しないホストの削除',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// PUT テスト - ホスト詳細情報更新
async function testUpdateHostDetail(hostId) {
  if (!hostId) {
    recordTestResult(
      'PUT /api/host/:id/detail - ホスト詳細情報更新',
      false,
      '更新対象のホストIDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/host/:id/detail テスト開始 ---');
    
    const detailUpdateData = {
      email: 'detail-update@example.com',
      num_of_room: 4,
      pet: true,
      note: '詳細情報が更新されました'
    };
    
    const response = await axios.put(`${BASE_URL}/${hostId}/detail`, detailUpdateData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/host/:id/detail - ホスト詳細情報更新',
        true,
        'ホスト詳細情報が正常に更新されました',
        {
          host_id: hostId,
          updated_fields: Object.keys(detailUpdateData)
        }
      );
    } else {
      recordTestResult(
        'PUT /api/host/:id/detail - ホスト詳細情報更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/host/:id/detail - ホスト詳細情報更新',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// PUT テスト - ホストファミリー情報更新
async function testUpdateHostFamily(hostId) {
  if (!hostId) {
    recordTestResult(
      'PUT /api/host/:id/family - ホストファミリー情報更新',
      false,
      '更新対象のホストIDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/host/:id/family テスト開始 ---');
    
    const familyUpdateData = [
      {
        name: 'ファミリー更新 花子',
        relation: '妻',
        phone: '090-3333-4444',
        date_of_birth: '1985-12-25'
      },
      {
        name: 'ファミリー更新 次郎',
        relation: '息子',
        phone: null,
        date_of_birth: '2015-06-10'
      }
    ];
    
    const response = await axios.put(`${BASE_URL}/${hostId}/family`, familyUpdateData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/host/:id/family - ホストファミリー情報更新',
        true,
        'ホストファミリー情報が正常に更新されました',
        {
          host_id: hostId,
          family_count: response.data.data.length
        }
      );
    } else {
      recordTestResult(
        'PUT /api/host/:id/family - ホストファミリー情報更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/host/:id/family - ホストファミリー情報更新',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// GET テスト - ホスト統計情報取得
async function testGetHostStats() {
  try {
    console.log('\n--- GET /api/host/stats テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/stats`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/host/stats - ホスト統計情報取得',
        true,
        'ホスト統計情報が正常に取得されました',
        {
          total_hosts: response.data.data.totalHosts,
          has_status_stats: !!response.data.data.statusStats,
          has_pet_stats: !!response.data.data.petStats,
          has_room_stats: !!response.data.data.roomStats
        }
      );
    } else {
      recordTestResult(
        'GET /api/host/stats - ホスト統計情報取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/host/stats - ホスト統計情報取得',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// メインのテスト実行関数
async function runHostTests() {
  console.log('🏠 ホストCRUD操作のテストを開始します...');
  console.log(`📡 テスト対象URL: ${BASE_URL}`);
  
  try {
    // 1. POST テスト - 新規ホスト作成
    const createdHostId = await testCreateHost();
    
    // 2. POST テスト - バリデーションエラー
    await testCreateHostValidation();
    
    // 3. PUT テスト - ホスト情報更新
    await testUpdateHost(createdHostId);
    
    // 4. PUT テスト - 存在しないホストの更新
    await testUpdateNonExistentHost();
    
    // 5. PUT テスト - ホスト詳細情報更新
    await testUpdateHostDetail(createdHostId);
    
    // 6. PUT テスト - ホストファミリー情報更新
    await testUpdateHostFamily(createdHostId);
    
    // 7. GET テスト - ホスト統計情報取得
    await testGetHostStats();
    
    // 8. DELETE テスト - ホスト削除
    await testDeleteHost(createdHostId);
    
    // 9. DELETE テスト - 存在しないホストの削除
    await testDeleteNonExistentHost();
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error.message);
  }
  
  // テスト結果を表示
  displayTestResults();
}

// テスト実行
if (require.main === module) {
  runHostTests().catch(console.error);
}

module.exports = {
  runHostTests,
  testCreateHost,
  testUpdateHost,
  testDeleteHost,
  testCreateHostValidation,
  testUpdateNonExistentHost,
  testDeleteNonExistentHost,
  testUpdateHostDetail,
  testUpdateHostFamily,
  testGetHostStats
}; 