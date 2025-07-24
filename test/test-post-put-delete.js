const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/student';

// テスト用の学生データ
const testStudentData = {
  first_name: 'テスト',
  last_name: '太郎',
  arrival_date: '2024-01-15',
  leaving_date: '2024-06-15',
  gender: 'M',
  school_id: 1,
  agency_id: 1,
  group_id: 1,
  student_detail: {
    jp_name: 'テスト タロウ',
    date_of_birth: '2000-01-01',
    phone_number: '090-1234-5678',
    email: 'test@example.com',
    flight_number: 'NH123',
    arrival_time: '14:30',
    visa: '学生ビザ',
    allergies: 'なし',
    smoke: false,
    pet: false,
    kid: false,
    meal: '通常食',
    emergency_contact: 'テスト 花子',
    emergency_contact_relation: '母',
    emergency_phone: '090-8765-4321',
    passport_number: 'AB1234567',
    note: 'テスト用の学生データです'
  }
};

// 更新用の学生データ
const updateStudentData = {
  first_name: '更新',
  last_name: '次郎',
  arrival_date: '2024-02-01',
  leaving_date: '2024-07-01',
  gender: 'M',
  school_id: 2,
  agency_id: 2,
  group_id: 2,
  student_detail: {
    jp_name: 'コウシン ジロウ',
    date_of_birth: '2001-02-02',
    phone_number: '090-9876-5432',
    email: 'update@example.com',
    flight_number: 'NH456',
    arrival_time: '15:30',
    visa: '学生ビザ',
    allergies: '花粉症',
    smoke: false,
    pet: true,
    kid: false,
    meal: 'ベジタリアン',
    emergency_contact: '更新 花子',
    emergency_contact_relation: '母',
    emergency_phone: '090-1111-2222',
    passport_number: 'CD9876543',
    note: '更新されたテスト用の学生データです'
  }
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
  console.log('テスト結果サマリー');
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

// POST テスト - 新規学生作成
async function testCreateStudent() {
  try {
    console.log('\n--- POST /api/student テスト開始 ---');
    
    const response = await axios.post(BASE_URL, testStudentData);
    
    if (response.status === 201 && response.data.success) {
      recordTestResult(
        'POST /api/student - 新規学生作成',
        true,
        '学生が正常に作成されました',
        {
          student_id: response.data.data.id,
          name: `${response.data.data.first_name} ${response.data.data.last_name}`
        }
      );
      return response.data.data.id; // 作成された学生のIDを返す
    } else {
      recordTestResult(
        'POST /api/student - 新規学生作成',
        false,
        '予期しないレスポンス形式',
        response.data
      );
      return null;
    }
  } catch (error) {
    recordTestResult(
      'POST /api/student - 新規学生作成',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
    return null;
  }
}

// POST テスト - バリデーションエラー
async function testCreateStudentValidation() {
  try {
    console.log('\n--- POST /api/student バリデーションテスト開始 ---');
    
    // 必須フィールドを欠いたデータ
    const invalidData = {
      first_name: 'テスト',
      // last_name を省略
      // arrival_date を省略
      gender: 'M'
    };
    
    const response = await axios.post(BASE_URL, invalidData);
    
    // バリデーションエラーが発生することを期待
    recordTestResult(
      'POST /api/student - バリデーションエラー',
      false,
      'バリデーションエラーが発生しませんでした（期待される動作）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 400) {
      recordTestResult(
        'POST /api/student - バリデーションエラー',
        true,
        'バリデーションエラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'POST /api/student - バリデーションエラー',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// PUT テスト - 学生情報更新
async function testUpdateStudent(studentId) {
  if (!studentId) {
    recordTestResult(
      'PUT /api/student/:id - 学生情報更新',
      false,
      '更新対象の学生IDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/student/:id テスト開始 ---');
    
    const response = await axios.put(`${BASE_URL}/${studentId}`, updateStudentData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/student/:id - 学生情報更新',
        true,
        '学生情報が正常に更新されました',
        {
          student_id: response.data.data.id,
          updated_name: `${response.data.data.first_name} ${response.data.data.last_name}`,
          updated_arrival_date: response.data.data.arrival_date
        }
      );
    } else {
      recordTestResult(
        'PUT /api/student/:id - 学生情報更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/student/:id - 学生情報更新',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// PUT テスト - 存在しない学生の更新
async function testUpdateNonExistentStudent() {
  try {
    console.log('\n--- PUT /api/student/:id 存在しない学生テスト開始 ---');
    
    const nonExistentId = 99999;
    const response = await axios.put(`${BASE_URL}/${nonExistentId}`, updateStudentData);
    
    recordTestResult(
      'PUT /api/student/:id - 存在しない学生の更新',
      false,
      '存在しない学生の更新が成功してしまいました（期待される動作ではありません）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 404) {
      recordTestResult(
        'PUT /api/student/:id - 存在しない学生の更新',
        true,
        '存在しない学生の更新で404エラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'PUT /api/student/:id - 存在しない学生の更新',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// DELETE テスト - 学生削除
async function testDeleteStudent(studentId) {
  if (!studentId) {
    recordTestResult(
      'DELETE /api/student/:id - 学生削除',
      false,
      '削除対象の学生IDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- DELETE /api/student/:id テスト開始 ---');
    
    const response = await axios.delete(`${BASE_URL}/${studentId}`);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'DELETE /api/student/:id - 学生削除',
        true,
        '学生が正常に削除されました',
        response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/student/:id - 学生削除',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'DELETE /api/student/:id - 学生削除',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// DELETE テスト - 存在しない学生の削除
async function testDeleteNonExistentStudent() {
  try {
    console.log('\n--- DELETE /api/student/:id 存在しない学生テスト開始 ---');
    
    const nonExistentId = 99999;
    const response = await axios.delete(`${BASE_URL}/${nonExistentId}`);
    
    recordTestResult(
      'DELETE /api/student/:id - 存在しない学生の削除',
      false,
      '存在しない学生の削除が成功してしまいました（期待される動作ではありません）',
      response.data
    );
  } catch (error) {
    if (error.response?.status === 404) {
      recordTestResult(
        'DELETE /api/student/:id - 存在しない学生の削除',
        true,
        '存在しない学生の削除で404エラーが正常に発生しました',
        error.response.data
      );
    } else {
      recordTestResult(
        'DELETE /api/student/:id - 存在しない学生の削除',
        false,
        `予期しないエラー: ${error.message}`,
        error.response?.data
      );
    }
  }
}

// PUT テスト - 学生詳細情報更新
async function testUpdateStudentDetail(studentId) {
  if (!studentId) {
    recordTestResult(
      'PUT /api/student/:id/detail - 学生詳細情報更新',
      false,
      '更新対象の学生IDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/student/:id/detail テスト開始 ---');
    
    const detailUpdateData = {
      jp_name: '詳細更新 タロウ',
      phone_number: '090-5555-6666',
      email: 'detail-update@example.com',
      note: '詳細情報が更新されました'
    };
    
    const response = await axios.put(`${BASE_URL}/${studentId}/detail`, detailUpdateData);
    
    if (response.status === 200 && response.data.success) {
      recordTestResult(
        'PUT /api/student/:id/detail - 学生詳細情報更新',
        true,
        '学生詳細情報が正常に更新されました',
        {
          student_id: studentId,
          updated_fields: Object.keys(detailUpdateData)
        }
      );
    } else {
      recordTestResult(
        'PUT /api/student/:id/detail - 学生詳細情報更新',
        false,
        '予期しないレスポンス形式',
        response.data
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/student/:id/detail - 学生詳細情報更新',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data
    );
  }
}

// メインのテスト実行関数
async function runAllTests() {
  console.log('🚀 POST, PUT, DELETE メソッドのテストを開始します...');
  console.log(`📡 テスト対象URL: ${BASE_URL}`);
  
  try {
    // 1. POST テスト - 新規学生作成
    const createdStudentId = await testCreateStudent();
    
    // 2. POST テスト - バリデーションエラー
    await testCreateStudentValidation();
    
    // 3. PUT テスト - 学生情報更新
    await testUpdateStudent(createdStudentId);
    
    // 4. PUT テスト - 存在しない学生の更新
    await testUpdateNonExistentStudent();
    
    // 5. PUT テスト - 学生詳細情報更新
    await testUpdateStudentDetail(createdStudentId);
    
    // 6. DELETE テスト - 学生削除
    await testDeleteStudent(createdStudentId);
    
    // 7. DELETE テスト - 存在しない学生の削除
    await testDeleteNonExistentStudent();
    
  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error.message);
  }
  
  // テスト結果を表示
  displayTestResults();
}

// テスト実行
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testCreateStudent,
  testUpdateStudent,
  testDeleteStudent,
  testCreateStudentValidation,
  testUpdateNonExistentStudent,
  testDeleteNonExistentStudent,
  testUpdateStudentDetail
}; 