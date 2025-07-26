const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/company';

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

// テスト用の会社データ
const testCompanyData = {
  name: 'テスト株式会社',
  address: '東京都新宿区テスト1-2-3',
  phone: '03-1234-5678',
  email: 'test@example.com',
  website: 'https://www.test-company.co.jp',
  industry: 'IT・ソフトウェア',
  size: 'medium',
  description: 'テスト用の会社です。',
  status: 'active'
};

let createdCompanyId = null;

// GET /api/v0/company - 会社一覧取得テスト
async function testGetAllCompanies() {
  try {
    console.log('\n--- GET /api/v0/company テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/company - 会社一覧取得',
        true,
        '会社一覧が正常に取得されました',
        {
          count: response.data.data.length,
          pagination: response.data.pagination
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/company - 会社一覧取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/company - 会社一覧取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// POST /api/v0/company - 会社作成テスト
async function testCreateCompany() {
  try {
    console.log('\n--- POST /api/v0/company テスト開始 ---');
    
    const response = await axios.post(`${BASE_URL}`, testCompanyData);
    
    if (response.status === 201 && response.data.success) {
      createdCompanyId = response.data.data.id;
      recordTestResult(
        'POST /api/v0/company - 会社作成',
        true,
        '会社が正常に作成されました',
        {
          id: response.data.data.id,
          name: response.data.data.name
        }
      );
    } else {
      recordTestResult(
        'POST /api/v0/company - 会社作成',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'POST /api/v0/company - 会社作成',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/company/:id - 特定の会社取得テスト
async function testGetCompanyById() {
  try {
    console.log('\n--- GET /api/v0/company/:id テスト開始 ---');
    
    if (!createdCompanyId) {
      recordTestResult(
        'GET /api/v0/company/:id - 特定の会社取得',
        false,
        '作成された会社IDがありません'
      );
      return;
    }
    
    const response = await axios.get(`${BASE_URL}/${createdCompanyId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/company/:id - 特定の会社取得',
        true,
        '特定の会社が正常に取得されました',
        {
          id: response.data.data.id,
          name: response.data.data.name
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/company/:id - 特定の会社取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/company/:id - 特定の会社取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// PUT /api/v0/company/:id - 会社更新テスト
async function testUpdateCompany() {
  try {
    console.log('\n--- PUT /api/v0/company/:id テスト開始 ---');
    
    if (!createdCompanyId) {
      recordTestResult(
        'PUT /api/v0/company/:id - 会社更新',
        false,
        '作成された会社IDがありません'
      );
      return;
    }
    
    const updateData = {
      name: '更新されたテスト株式会社',
      description: '更新されたテスト用の会社です。'
    };
    
    const response = await axios.put(`${BASE_URL}/${createdCompanyId}`, updateData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/v0/company/:id - 会社更新',
        true,
        '会社が正常に更新されました',
        {
          id: response.data.data.id,
          name: response.data.data.name,
          description: response.data.data.description
        }
      );
    } else {
      recordTestResult(
        'PUT /api/v0/company/:id - 会社更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/v0/company/:id - 会社更新',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/company/stats - 会社統計情報取得テスト
async function testGetCompanyStats() {
  try {
    console.log('\n--- GET /api/v0/company/stats テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/stats`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/company/stats - 会社統計情報取得',
        true,
        '会社統計情報が正常に取得されました',
        response.data.data
      );
    } else {
      recordTestResult(
        'GET /api/v0/company/stats - 会社統計情報取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/company/stats - 会社統計情報取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/company/industries - 業界一覧取得テスト
async function testGetIndustries() {
  try {
    console.log('\n--- GET /api/v0/company/industries テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/industries`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/company/industries - 業界一覧取得',
        true,
        '業界一覧が正常に取得されました',
        {
          industries: response.data.data
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/company/industries - 業界一覧取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/company/industries - 業界一覧取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// DELETE /api/v0/company/:id - 会社削除テスト
async function testDeleteCompany() {
  try {
    console.log('\n--- DELETE /api/v0/company/:id テスト開始 ---');
    
    if (!createdCompanyId) {
      recordTestResult(
        'DELETE /api/v0/company/:id - 会社削除',
        false,
        '作成された会社IDがありません'
      );
      return;
    }
    
    const response = await axios.delete(`${BASE_URL}/${createdCompanyId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'DELETE /api/v0/company/:id - 会社削除',
        true,
        '会社が正常に削除されました',
        response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/v0/company/:id - 会社削除',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'DELETE /api/v0/company/:id - 会社削除',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// エラーテスト
async function testErrorCases() {
  try {
    console.log('\n--- エラーテスト開始 ---');
    
    // 無効なIDでの取得テスト
    try {
      await axios.get(`${BASE_URL}/99999`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        recordTestResult(
          'GET /api/v0/company/:id (エラーテスト) - 存在しないID',
          true,
          '適切な404エラーが返されました',
          error.response.data
        );
      } else {
        recordTestResult(
          'GET /api/v0/company/:id (エラーテスト) - 存在しないID',
          false,
          '予期しないエラーレスポンス',
          error.response?.data
        );
      }
    }
    
    // 無効なデータでの作成テスト
    try {
      await axios.post(`${BASE_URL}`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        recordTestResult(
          'POST /api/v0/company (エラーテスト) - 無効なデータ',
          true,
          '適切なバリデーションエラーが返されました',
          error.response.data
        );
      } else {
        recordTestResult(
          'POST /api/v0/company (エラーテスト) - 無効なデータ',
          false,
          '予期しないエラーレスポンス',
          error.response?.data
        );
      }
    }
    
  } catch (error) {
    recordTestResult(
      'エラーテスト',
      false,
      `エラーテスト実行中にエラーが発生: ${error.message}`
    );
  }
}

// テスト結果サマリーを表示
function printTestSummary() {
  console.log('\n=== テスト結果サマリー ===');
  const totalTests = testResults.length;
  const successfulTests = testResults.filter(result => result.success).length;
  const failedTests = totalTests - successfulTests;
  
  console.log(`総テスト数: ${totalTests}`);
  console.log(`成功: ${successfulTests}`);
  console.log(`失敗: ${failedTests}`);
  console.log(`成功率: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
  
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

// 全テストを実行
async function runAllTests() {
  console.log('=== Company CRUD API テスト開始 ===');
  console.log(`テスト対象URL: ${BASE_URL}`);
  console.log(`開始時刻: ${new Date().toISOString()}`);
  
  try {
    await testGetAllCompanies();
    await testCreateCompany();
    await testGetCompanyById();
    await testUpdateCompany();
    await testGetCompanyStats();
    await testGetIndustries();
    await testErrorCases();
    await testDeleteCompany();
    
    console.log(`\nテスト終了時刻: ${new Date().toISOString()}`);
    printTestSummary();
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生:', error);
  }
  
  console.log('=== Company CRUD API テスト終了 ===');
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults
}; 