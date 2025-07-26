const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/payment';

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

// テスト用の支払いデータ
const testIncomeData = {
  type: 'income',
  amount: 50000.00,
  currency: 'JPY',
  description: 'テスト収入',
  category: 'テストカテゴリ',
  payment_method: 'bank_transfer',
  status: 'completed',
  payment_date: '2024-01-15',
  due_date: '2024-01-20',
  reference_number: 'TEST-INC-001',
  notes: 'テスト用の収入データ'
};

const testExpenseData = {
  type: 'expense',
  amount: 15000.00,
  currency: 'JPY',
  description: 'テスト支出',
  category: 'テストカテゴリ',
  payment_method: 'credit_card',
  status: 'completed',
  payment_date: '2024-01-15',
  due_date: '2024-01-20',
  reference_number: 'TEST-EXP-001',
  notes: 'テスト用の支出データ'
};

let createdPaymentId = null;

// GET /api/v0/payment - 支払い一覧取得テスト
async function testGetAllPayments() {
  try {
    console.log('\n--- GET /api/v0/payment テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/payment - 支払い一覧取得',
        true,
        '支払い一覧が正常に取得されました',
        {
          count: response.data.data.length,
          pagination: response.data.pagination
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/payment - 支払い一覧取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/payment - 支払い一覧取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// POST /api/v0/payment - 収入作成テスト
async function testCreateIncome() {
  try {
    console.log('\n--- POST /api/v0/payment (収入) テスト開始 ---');
    
    const response = await axios.post(`${BASE_URL}`, testIncomeData);
    
    if (response.status === 201 && response.data.success) {
      createdPaymentId = response.data.data.id;
      recordTestResult(
        'POST /api/v0/payment - 収入作成',
        true,
        '収入が正常に作成されました',
        {
          id: response.data.data.id,
          type: response.data.data.type,
          amount: response.data.data.amount
        }
      );
    } else {
      recordTestResult(
        'POST /api/v0/payment - 収入作成',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'POST /api/v0/payment - 収入作成',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// POST /api/v0/payment - 支出作成テスト
async function testCreateExpense() {
  try {
    console.log('\n--- POST /api/v0/payment (支出) テスト開始 ---');
    
    const response = await axios.post(`${BASE_URL}`, testExpenseData);
    
    if (response.status === 201 && response.data.success) {
      recordTestResult(
        'POST /api/v0/payment - 支出作成',
        true,
        '支出が正常に作成されました',
        {
          id: response.data.data.id,
          type: response.data.data.type,
          amount: response.data.data.amount
        }
      );
    } else {
      recordTestResult(
        'POST /api/v0/payment - 支出作成',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'POST /api/v0/payment - 支出作成',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/payment/:id - 特定の支払い取得テスト
async function testGetPaymentById() {
  try {
    console.log('\n--- GET /api/v0/payment/:id テスト開始 ---');
    
    if (!createdPaymentId) {
      recordTestResult(
        'GET /api/v0/payment/:id - 特定の支払い取得',
        false,
        '作成された支払いIDがありません'
      );
      return;
    }
    
    const response = await axios.get(`${BASE_URL}/${createdPaymentId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/payment/:id - 特定の支払い取得',
        true,
        '特定の支払いが正常に取得されました',
        {
          id: response.data.data.id,
          type: response.data.data.type,
          amount: response.data.data.amount
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/payment/:id - 特定の支払い取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/payment/:id - 特定の支払い取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// PUT /api/v0/payment/:id - 支払い更新テスト
async function testUpdatePayment() {
  try {
    console.log('\n--- PUT /api/v0/payment/:id テスト開始 ---');
    
    if (!createdPaymentId) {
      recordTestResult(
        'PUT /api/v0/payment/:id - 支払い更新',
        false,
        '作成された支払いIDがありません'
      );
      return;
    }
    
    const updateData = {
      description: '更新されたテスト収入',
      amount: 60000.00,
      notes: '更新されたテスト用の収入データ'
    };
    
    const response = await axios.put(`${BASE_URL}/${createdPaymentId}`, updateData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/v0/payment/:id - 支払い更新',
        true,
        '支払いが正常に更新されました',
        {
          id: response.data.data.id,
          description: response.data.data.description,
          amount: response.data.data.amount
        }
      );
    } else {
      recordTestResult(
        'PUT /api/v0/payment/:id - 支払い更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/v0/payment/:id - 支払い更新',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/payment/summary - 財務サマリー取得テスト
async function testGetFinancialSummary() {
  try {
    console.log('\n--- GET /api/v0/payment/summary テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/summary`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/payment/summary - 財務サマリー取得',
        true,
        '財務サマリーが正常に取得されました',
        response.data.data.summary
      );
    } else {
      recordTestResult(
        'GET /api/v0/payment/summary - 財務サマリー取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/payment/summary - 財務サマリー取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/payment/stats - 支払い統計情報取得テスト
async function testGetPaymentStats() {
  try {
    console.log('\n--- GET /api/v0/payment/stats テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/stats`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/payment/stats - 支払い統計情報取得',
        true,
        '支払い統計情報が正常に取得されました',
        response.data.data
      );
    } else {
      recordTestResult(
        'GET /api/v0/payment/stats - 支払い統計情報取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/payment/stats - 支払い統計情報取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// GET /api/v0/payment/categories - カテゴリ一覧取得テスト
async function testGetCategories() {
  try {
    console.log('\n--- GET /api/v0/payment/categories テスト開始 ---');
    
    const response = await axios.get(`${BASE_URL}/categories`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'GET /api/v0/payment/categories - カテゴリ一覧取得',
        true,
        'カテゴリ一覧が正常に取得されました',
        {
          categories: response.data.data
        }
      );
    } else {
      recordTestResult(
        'GET /api/v0/payment/categories - カテゴリ一覧取得',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'GET /api/v0/payment/categories - カテゴリ一覧取得',
      false,
      `エラー: ${error.message}`,
      error.response?.data
    );
  }
}

// DELETE /api/v0/payment/:id - 支払い削除テスト
async function testDeletePayment() {
  try {
    console.log('\n--- DELETE /api/v0/payment/:id テスト開始 ---');
    
    if (!createdPaymentId) {
      recordTestResult(
        'DELETE /api/v0/payment/:id - 支払い削除',
        false,
        '作成された支払いIDがありません'
      );
      return;
    }
    
    const response = await axios.delete(`${BASE_URL}/${createdPaymentId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'DELETE /api/v0/payment/:id - 支払い削除',
        true,
        '支払いが正常に削除されました',
        response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/v0/payment/:id - 支払い削除',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'DELETE /api/v0/payment/:id - 支払い削除',
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
          'GET /api/v0/payment/:id (エラーテスト) - 存在しないID',
          true,
          '適切な404エラーが返されました',
          error.response.data
        );
      } else {
        recordTestResult(
          'GET /api/v0/payment/:id (エラーテスト) - 存在しないID',
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
          'POST /api/v0/payment (エラーテスト) - 無効なデータ',
          true,
          '適切なバリデーションエラーが返されました',
          error.response.data
        );
      } else {
        recordTestResult(
          'POST /api/v0/payment (エラーテスト) - 無効なデータ',
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
  console.log('=== Payment CRUD API テスト開始 ===');
  console.log(`テスト対象URL: ${BASE_URL}`);
  console.log(`開始時刻: ${new Date().toISOString()}`);
  
  try {
    await testGetAllPayments();
    await testCreateIncome();
    await testCreateExpense();
    await testGetPaymentById();
    await testUpdatePayment();
    await testGetFinancialSummary();
    await testGetPaymentStats();
    await testGetCategories();
    await testErrorCases();
    await testDeletePayment();
    
    console.log(`\nテスト終了時刻: ${new Date().toISOString()}`);
    printTestSummary();
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生:', error);
  }
  
  console.log('=== Payment CRUD API テスト終了 ===');
}

// スクリプトが直接実行された場合のみテストを実行
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testResults
}; 