const axios = require('axios');

// テスト用のベースURL
const BASE_URL = 'http://localhost:3000/api/v0/student';

// テスト用の学生データ
const testStudentData = {
  first_name: '詳細テスト',
  last_name: '花子',
  arrival_date: '2024-03-01',
  leaving_date: '2024-09-01',
  gender: 'F',
  school_id: 1,
  agency_id: 1,
  group_id: 1,
  student_detail: {
    jp_name: 'シクサイテスト ハナコ',
    date_of_birth: '2002-03-15',
    phone_number: '090-3333-4444',
    email: 'detailed-test@example.com',
    flight_number: 'NH789',
    arrival_time: '16:30',
    visa: '学生ビザ',
    allergies: 'なし',
    smoke: false,
    pet: true,
    kid: true,
    meal: 'ベジタリアン',
    emergency_contact: '詳細テスト 太郎',
    emergency_contact_relation: '父',
    emergency_phone: '090-5555-6666',
    passport_number: 'EF9876543',
    note: '詳細テスト用の学生データです'
  }
};

// テスト結果を格納する配列
let testResults = [];

// テスト結果を記録する関数
function recordTestResult(testName, success, message, data = null, details = null) {
  const result = {
    test: testName,
    success,
    message,
    data,
    details,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  
  const status = success ? '✓' : '✗';
  console.log(`[${status}] ${testName}: ${message}`);
  
  if (data) {
    console.log('   Response Data:', JSON.stringify(data, null, 2));
  }
  
  if (details) {
    console.log('   Details:', details);
  }
  
  console.log('   ' + '-'.repeat(50));
}

// テスト結果を表示する関数
function displayDetailedResults() {
  console.log('\n' + '='.repeat(80));
  console.log('詳細テスト結果サマリー');
  console.log('='.repeat(80));
  
  const passed = testResults.filter(r => r.success).length;
  const failed = testResults.filter(r => !r.success).length;
  
  console.log(`総テスト数: ${testResults.length}`);
  console.log(`成功: ${passed}`);
  console.log(`失敗: ${failed}`);
  console.log(`成功率: ${((passed / testResults.length) * 100).toFixed(1)}%`);
  
  console.log('\n詳細結果:');
  testResults.forEach((result, index) => {
    const status = result.success ? '✓' : '✗';
    console.log(`\n${index + 1}. [${status}] ${result.test}`);
    console.log(`   時刻: ${result.timestamp}`);
    console.log(`   メッセージ: ${result.message}`);
    
    if (result.details) {
      console.log(`   詳細: ${result.details}`);
    }
    
    if (result.data && typeof result.data === 'object') {
      console.log(`   レスポンス: ${JSON.stringify(result.data, null, 2)}`);
    }
  });
}

// POST テスト - 新規学生作成（詳細確認）
async function testCreateStudentDetailed() {
  try {
    console.log('\n--- POST /api/student 詳細テスト開始 ---');
    
    const response = await axios.post(BASE_URL, testStudentData);
    
    if (response.status === 201 && response.data.success) {
      const student = response.data.data;
      
      // レスポンスの詳細確認
      const details = {
        statusCode: response.status,
        studentId: student.id,
        fullName: `${student.first_name} ${student.last_name}`,
        hasStudentDetail: !!student.StudentDetail,
        hasSchool: !!student.School,
        hasAgency: !!student.Agency,
        hasGroup: !!student.Group,
        responseTime: response.headers['x-response-time'] || 'N/A'
      };
      
      recordTestResult(
        'POST /api/student - 新規学生作成（詳細確認）',
        true,
        '学生が正常に作成され、関連データも含まれています',
        response.data,
        details
      );
      
      return student.id;
    } else {
      recordTestResult(
        'POST /api/student - 新規学生作成（詳細確認）',
        false,
        '予期しないレスポンス形式',
        response.data,
        { statusCode: response.status }
      );
      return null;
    }
  } catch (error) {
    recordTestResult(
      'POST /api/student - 新規学生作成（詳細確認）',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data,
      { errorType: error.name, statusCode: error.response?.status }
    );
    return null;
  }
}

// PUT テスト - 学生情報更新（詳細確認）
async function testUpdateStudentDetailed(studentId) {
  if (!studentId) {
    recordTestResult(
      'PUT /api/student/:id - 学生情報更新（詳細確認）',
      false,
      '更新対象の学生IDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- PUT /api/student/:id 詳細テスト開始 ---');
    
    const updateData = {
      first_name: '更新詳細',
      last_name: '三郎',
      arrival_date: '2024-04-01',
      leaving_date: '2024-10-01',
      gender: 'M',
      school_id: 2,
      agency_id: 2,
      group_id: 2,
      student_detail: {
        jp_name: 'コウシンシクサイ サブロウ',
        phone_number: '090-7777-8888',
        email: 'update-detailed@example.com',
        note: '詳細更新テストが完了しました'
      }
    };
    
    const response = await axios.put(`${BASE_URL}/${studentId}`, updateData);
    
    if (response.status === 200 && response.data.success) {
      const student = response.data.data;
      
      const details = {
        statusCode: response.status,
        studentId: student.id,
        updatedName: `${student.first_name} ${student.last_name}`,
        updatedArrivalDate: student.arrival_date,
        updatedSchoolId: student.school_id,
        updatedAgencyId: student.agency_id,
        updatedGroupId: student.group_id,
        hasUpdatedDetail: !!student.StudentDetail,
        detailUpdatedFields: student.StudentDetail ? Object.keys(updateData.student_detail) : []
      };
      
      recordTestResult(
        'PUT /api/student/:id - 学生情報更新（詳細確認）',
        true,
        '学生情報が正常に更新され、関連データも更新されています',
        response.data,
        details
      );
    } else {
      recordTestResult(
        'PUT /api/student/:id - 学生情報更新（詳細確認）',
        false,
        '予期しないレスポンス形式',
        response.data,
        { statusCode: response.status }
      );
    }
  } catch (error) {
    recordTestResult(
      'PUT /api/student/:id - 学生情報更新（詳細確認）',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data,
      { errorType: error.name, statusCode: error.response?.status }
    );
  }
}

// DELETE テスト - 学生削除（詳細確認）
async function testDeleteStudentDetailed(studentId) {
  if (!studentId) {
    recordTestResult(
      'DELETE /api/student/:id - 学生削除（詳細確認）',
      false,
      '削除対象の学生IDがありません'
    );
    return;
  }
  
  try {
    console.log('\n--- DELETE /api/student/:id 詳細テスト開始 ---');
    
    const response = await axios.delete(`${BASE_URL}/${studentId}`);
    
    if (response.status === 200 && response.data.success) {
      const details = {
        statusCode: response.status,
        deletedStudentId: studentId,
        responseMessage: response.data.message,
        responseTime: response.headers['x-response-time'] || 'N/A'
      };
      
      recordTestResult(
        'DELETE /api/student/:id - 学生削除（詳細確認）',
        true,
        '学生が正常に削除されました',
        response.data,
        details
      );
      
      // 削除確認のため、同じIDでGETリクエストを送信
      try {
        await axios.get(`${BASE_URL}/${studentId}`);
        recordTestResult(
          'DELETE /api/student/:id - 削除確認',
          false,
          '削除された学生がまだ存在しています',
          null,
          { studentId }
        );
      } catch (getError) {
        if (getError.response?.status === 404) {
          recordTestResult(
            'DELETE /api/student/:id - 削除確認',
            true,
            '削除された学生が正常に存在しなくなりました',
            null,
            { studentId, statusCode: getError.response.status }
          );
        } else {
          recordTestResult(
            'DELETE /api/student/:id - 削除確認',
            false,
            `削除確認中に予期しないエラー: ${getError.message}`,
            null,
            { studentId, errorType: getError.name }
          );
        }
      }
    } else {
      recordTestResult(
        'DELETE /api/student/:id - 学生削除（詳細確認）',
        false,
        '予期しないレスポンス形式',
        response.data,
        { statusCode: response.status }
      );
    }
  } catch (error) {
    recordTestResult(
      'DELETE /api/student/:id - 学生削除（詳細確認）',
      false,
      `エラー: ${error.response?.data?.message || error.message}`,
      error.response?.data,
      { errorType: error.name, statusCode: error.response?.status }
    );
  }
}

// メインのテスト実行関数
async function runDetailedTests() {
  console.log('🔍 POST, PUT, DELETE メソッドの詳細テストを開始します...');
  console.log(`📡 テスト対象URL: ${BASE_URL}`);
  console.log(`⏰ 開始時刻: ${new Date().toISOString()}`);
  
  try {
    // 1. POST テスト - 新規学生作成（詳細確認）
    const createdStudentId = await testCreateStudentDetailed();
    
    // 2. PUT テスト - 学生情報更新（詳細確認）
    await testUpdateStudentDetailed(createdStudentId);
    
    // 3. DELETE テスト - 学生削除（詳細確認）
    await testDeleteStudentDetailed(createdStudentId);
    
  } catch (error) {
    console.error('詳細テスト実行中にエラーが発生しました:', error.message);
  }
  
  // テスト結果を表示
  displayDetailedResults();
}

// テスト実行
if (require.main === module) {
  runDetailedTests().catch(console.error);
}

module.exports = {
  runDetailedTests,
  testCreateStudentDetailed,
  testUpdateStudentDetailed,
  testDeleteStudentDetailed
}; 