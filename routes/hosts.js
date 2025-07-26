const express = require('express');
const router = express.Router();
const HostController = require('../controllers/hostController');

// GET /api/host - 全ホスト一覧取得（検索・ページネーション対応）
router.get('/', HostController.getAllHosts);

// GET /api/host/stats - ホスト統計情報取得
router.get('/stats', HostController.getHostStats);

// GET /api/host/occupancy - 特定の日付の滞在者数取得
router.get('/occupancy', HostController.getOccupancyByDate);

// GET /api/host/occupancy/range - 日付範囲での滞在者数取得
router.get('/occupancy/range', HostController.getOccupancyByDateRange);

// GET /api/host/schedules - 滞在スケジュール一覧取得
router.get('/schedules', HostController.getAcceptanceSchedules);

// POST /api/host/schedules - 滞在スケジュール作成
router.post('/schedules', HostController.createAcceptanceSchedule);

// GET /api/host/schedules/:id - 特定の滞在スケジュール取得
router.get('/schedules/:id', HostController.getAcceptanceScheduleById);

// PUT /api/host/schedules/:id - 滞在スケジュール更新
router.put('/schedules/:id', HostController.updateAcceptanceSchedule);

// DELETE /api/host/schedules/:id - 滞在スケジュール削除
router.delete('/schedules/:id', HostController.deleteAcceptanceSchedule);

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