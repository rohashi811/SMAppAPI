const express = require('express');
const router = express.Router();
const HostController = require('../controllers/hostController');

// GET /api/host - 全ホスト一覧取得（検索・ページネーション対応）
router.get('/', HostController.getAllHosts);

// GET /api/host/stats - ホスト統計情報取得
router.get('/stats', HostController.getHostStats);

// GET /api/host/:id - 特定のホスト詳細取得
router.get('/:id', HostController.getHostById);

// POST /api/host - 新規ホスト作成
router.post('/', HostController.createHost);

// PUT /api/host/:id - ホスト情報更新
router.put('/:id', HostController.updateHost);

// DELETE /api/host/:id - ホスト削除
router.delete('/:id', HostController.deleteHost);

// GET /api/host/:id/detail - ホスト詳細情報のみ取得
router.get('/:id/detail', HostController.getHostDetail);

// PUT /api/host/:id/detail - ホスト詳細情報更新
router.put('/:id/detail', HostController.updateHostDetail);

// GET /api/host/:id/family - ホストファミリー情報取得
router.get('/:id/family', HostController.getHostFamily);

// PUT /api/host/:id/family - ホストファミリー情報更新
router.put('/:id/family', HostController.updateHostFamily);

module.exports = router; 