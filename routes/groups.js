const express = require('express');
const router = express.Router();
const GroupController = require('../controllers/groupController');

// GET /api/group - 全グループ一覧取得（検索・ページネーション対応）
router.get('/', GroupController.getAllGroups);

// GET /api/group/stats - グループ統計情報取得
router.get('/stats', GroupController.getGroupStats);

// GET /api/group/:id - 特定のグループ詳細取得
router.get('/:id', GroupController.getGroupById);

// POST /api/group - 新規グループ作成
router.post('/', GroupController.createGroup);

// PUT /api/group/:id - グループ情報更新
router.put('/:id', GroupController.updateGroup);

// DELETE /api/group/:id - グループ削除
router.delete('/:id', GroupController.deleteGroup);

module.exports = router; 