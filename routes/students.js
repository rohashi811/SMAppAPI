const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');

// GET /api/student - 全学生一覧取得（検索・ページネーション対応）
router.get('/', StudentController.getAllStudents);

// GET /api/student/:id - 特定の学生詳細取得
router.get('/:id', StudentController.getStudentById);

// POST /api/student - 新規学生作成
router.post('/', StudentController.createStudent);

// PUT /api/student/:id - 学生情報更新
router.put('/:id', StudentController.updateStudent);

// DELETE /api/student/:id - 学生削除
router.delete('/:id', StudentController.deleteStudent);

// GET /api/student/:id/detail - 学生詳細情報のみ取得
router.get('/:id/detail', StudentController.getStudentDetail);

// PUT /api/student/:id/detail - 学生詳細情報更新
router.put('/:id/detail', StudentController.updateStudentDetail);

// GET /api/student/stats - 学生統計情報取得
router.get('/stats', StudentController.getStudentStats);

module.exports = router; 