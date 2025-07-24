const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v0/group';

// テスト用のデータ
let testGroupId;

// テスト結果の記録
const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

// テスト結果を記録する関数
function recordTest(testName, success, error = null) {
  const result = {
    test: testName,
    success,
    error: error ? error.message : null,
    timestamp: new Date().toISOString()
  };
  
  testResults.tests.push(result);
  
  if (success) {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    console.log(`❌ ${testName}: ${error?.message || 'Unknown error'}`);
  }
}

// テスト実行前の待機
async function wait(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// テスト実行
async function runTests() {
  console.log('🚀 グループCRUD操作テストを開始します...\n');

  try {
    // 1. 統計情報取得テスト
    console.log('📊 統計情報取得テスト...');
    try {
      const statsResponse = await axios.get(`${BASE_URL}/stats`);
      if (statsResponse.status === 200 && statsResponse.data.success) {
        recordTest('GET /stats - 統計情報取得', true);
        console.log('   統計情報:', statsResponse.data.data);
      } else {
        recordTest('GET /stats - 統計情報取得', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET /stats - 統計情報取得', false, error);
    }
    await wait();

    // 2. 全グループ一覧取得テスト
    console.log('\n📋 全グループ一覧取得テスト...');
    try {
      const listResponse = await axios.get(`${BASE_URL}`);
      if (listResponse.status === 200 && listResponse.data.success) {
        recordTest('GET / - 全グループ一覧取得', true);
        console.log(`   取得件数: ${listResponse.data.data.length}`);
        console.log(`   ページネーション: ${JSON.stringify(listResponse.data.pagination)}`);
      } else {
        recordTest('GET / - 全グループ一覧取得', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET / - 全グループ一覧取得', false, error);
    }
    await wait();

    // 3. 新規グループ作成テスト
    console.log('\n➕ 新規グループ作成テスト...');
    try {
      const createData = {
        name: 'テストグループA'
      };
      const createResponse = await axios.post(`${BASE_URL}`, createData);
      if (createResponse.status === 201 && createResponse.data.success) {
        testGroupId = createResponse.data.data.id;
        recordTest('POST / - 新規グループ作成', true);
        console.log(`   作成されたグループID: ${testGroupId}`);
        console.log(`   グループ名: ${createResponse.data.data.name}`);
      } else {
        recordTest('POST / - 新規グループ作成', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('POST / - 新規グループ作成', false, error);
    }
    await wait();

    // 4. 重複グループ名作成テスト（エラーケース）
    console.log('\n⚠️ 重複グループ名作成テスト...');
    try {
      const duplicateData = {
        name: 'テストグループA'
      };
      await axios.post(`${BASE_URL}`, duplicateData);
      recordTest('POST / - 重複グループ名作成（エラー）', false, new Error('Should have failed'));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        recordTest('POST / - 重複グループ名作成（エラー）', true);
        console.log(`   期待されるエラー: ${error.response.data.message}`);
      } else {
        recordTest('POST / - 重複グループ名作成（エラー）', false, error);
      }
    }
    await wait();

    // 5. 特定グループ詳細取得テスト
    console.log('\n🔍 特定グループ詳細取得テスト...');
    try {
      const detailResponse = await axios.get(`${BASE_URL}/${testGroupId}`);
      if (detailResponse.status === 200 && detailResponse.data.success) {
        recordTest('GET /:id - 特定グループ詳細取得', true);
        console.log(`   グループ名: ${detailResponse.data.data.name}`);
        console.log(`   学生数: ${detailResponse.data.data.student_count}`);
      } else {
        recordTest('GET /:id - 特定グループ詳細取得', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET /:id - 特定グループ詳細取得', false, error);
    }
    await wait();

    // 6. 存在しないグループ取得テスト（エラーケース）
    console.log('\n❌ 存在しないグループ取得テスト...');
    try {
      await axios.get(`${BASE_URL}/99999`);
      recordTest('GET /:id - 存在しないグループ取得（エラー）', false, new Error('Should have failed'));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        recordTest('GET /:id - 存在しないグループ取得（エラー）', true);
        console.log(`   期待されるエラー: ${error.response.data.message}`);
      } else {
        recordTest('GET /:id - 存在しないグループ取得（エラー）', false, error);
      }
    }
    await wait();

    // 7. グループ情報更新テスト
    console.log('\n✏️ グループ情報更新テスト...');
    try {
      const updateData = {
        name: 'テストグループA（更新）'
      };
      const updateResponse = await axios.put(`${BASE_URL}/${testGroupId}`, updateData);
      if (updateResponse.status === 200 && updateResponse.data.success) {
        recordTest('PUT /:id - グループ情報更新', true);
        console.log(`   更新後のグループ名: ${updateResponse.data.data.name}`);
      } else {
        recordTest('PUT /:id - グループ情報更新', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('PUT /:id - グループ情報更新', false, error);
    }
    await wait();

    // 8. 存在しないグループ更新テスト（エラーケース）
    console.log('\n❌ 存在しないグループ更新テスト...');
    try {
      const updateData = {
        name: '存在しないグループ'
      };
      await axios.put(`${BASE_URL}/99999`, updateData);
      recordTest('PUT /:id - 存在しないグループ更新（エラー）', false, new Error('Should have failed'));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        recordTest('PUT /:id - 存在しないグループ更新（エラー）', true);
        console.log(`   期待されるエラー: ${error.response.data.message}`);
      } else {
        recordTest('PUT /:id - 存在しないグループ更新（エラー）', false, error);
      }
    }
    await wait();

    // 9. 検索機能テスト
    console.log('\n🔍 検索機能テスト...');
    try {
      const searchResponse = await axios.get(`${BASE_URL}?search=テスト`);
      if (searchResponse.status === 200 && searchResponse.data.success) {
        recordTest('GET /?search= - 検索機能', true);
        console.log(`   検索結果件数: ${searchResponse.data.data.length}`);
      } else {
        recordTest('GET /?search= - 検索機能', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET /?search= - 検索機能', false, error);
    }
    await wait();

    // 10. ページネーション機能テスト
    console.log('\n📄 ページネーション機能テスト...');
    try {
      const pageResponse = await axios.get(`${BASE_URL}?page=1&limit=5`);
      if (pageResponse.status === 200 && pageResponse.data.success) {
        recordTest('GET /?page=&limit= - ページネーション機能', true);
        console.log(`   現在ページ: ${pageResponse.data.pagination.currentPage}`);
        console.log(`   総ページ数: ${pageResponse.data.pagination.totalPages}`);
        console.log(`   取得件数: ${pageResponse.data.data.length}`);
      } else {
        recordTest('GET /?page=&limit= - ページネーション機能', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET /?page=&limit= - ページネーション機能', false, error);
    }
    await wait();

    // 11. ソート機能テスト
    console.log('\n📊 ソート機能テスト...');
    try {
      const sortResponse = await axios.get(`${BASE_URL}?sort_by=name&sort_order=ASC`);
      if (sortResponse.status === 200 && sortResponse.data.success) {
        recordTest('GET /?sort_by=&sort_order= - ソート機能', true);
        console.log(`   ソート結果件数: ${sortResponse.data.data.length}`);
      } else {
        recordTest('GET /?sort_by=&sort_order= - ソート機能', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('GET /?sort_by=&sort_order= - ソート機能', false, error);
    }
    await wait();

    // 12. グループ削除テスト
    console.log('\n🗑️ グループ削除テスト...');
    try {
      const deleteResponse = await axios.delete(`${BASE_URL}/${testGroupId}`);
      if (deleteResponse.status === 200 && deleteResponse.data.success) {
        recordTest('DELETE /:id - グループ削除', true);
        console.log(`   削除メッセージ: ${deleteResponse.data.message}`);
      } else {
        recordTest('DELETE /:id - グループ削除', false, new Error('Invalid response'));
      }
    } catch (error) {
      recordTest('DELETE /:id - グループ削除', false, error);
    }
    await wait();

    // 13. 削除後のグループ取得テスト（エラーケース）
    console.log('\n❌ 削除後のグループ取得テスト...');
    try {
      await axios.get(`${BASE_URL}/${testGroupId}`);
      recordTest('GET /:id - 削除後のグループ取得（エラー）', false, new Error('Should have failed'));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        recordTest('GET /:id - 削除後のグループ取得（エラー）', true);
        console.log(`   期待されるエラー: ${error.response.data.message}`);
      } else {
        recordTest('GET /:id - 削除後のグループ取得（エラー）', false, error);
      }
    }
    await wait();

    // 14. 存在しないグループ削除テスト（エラーケース）
    console.log('\n❌ 存在しないグループ削除テスト...');
    try {
      await axios.delete(`${BASE_URL}/99999`);
      recordTest('DELETE /:id - 存在しないグループ削除（エラー）', false, new Error('Should have failed'));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        recordTest('DELETE /:id - 存在しないグループ削除（エラー）', true);
        console.log(`   期待されるエラー: ${error.response.data.message}`);
      } else {
        recordTest('DELETE /:id - 存在しないグループ削除（エラー）', false, error);
      }
    }

  } catch (error) {
    console.error('テスト実行中にエラーが発生しました:', error.message);
  }

  // テスト結果サマリー
  console.log('\n' + '='.repeat(60));
  console.log('📊 テスト結果サマリー');
  console.log('='.repeat(60));
  console.log(`✅ 成功: ${testResults.passed}`);
  console.log(`❌ 失敗: ${testResults.failed}`);
  console.log(`📈 成功率: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ 失敗したテスト:');
    testResults.tests
      .filter(test => !test.success)
      .forEach(test => {
        console.log(`   - ${test.test}: ${test.error}`);
      });
  }

  console.log('\n🎉 グループCRUD操作テストが完了しました！');
}

// テスト実行
runTests().catch(console.error); 