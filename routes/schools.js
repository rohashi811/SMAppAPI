const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/schoolController');

// GET /api/school - 全学校一覧取得（検索・ページネーション対応）
router.get('/', SchoolController.getAllSchools);

// GET /api/school/stats - 学校統計情報取得
router.get('/stats', SchoolController.getSchoolStats);

// GET /api/school/:id - 特定の学校詳細取得
router.get('/:id', SchoolController.getSchoolById);

// POST /api/school - 新規学校作成
router.post('/', SchoolController.createSchool);

// PUT /api/school/:id - 学校情報更新
router.put('/:id', SchoolController.updateSchool);

// DELETE /api/school/:id - 学校削除
router.delete('/:id', SchoolController.deleteSchool);

module.exports = router; 