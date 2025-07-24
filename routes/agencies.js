const express = require('express');
const router = express.Router();
const AgencyController = require('../controllers/agencyController');

// GET /api/agency - 全エージェンシー一覧取得（検索・ページネーション対応）
router.get('/', AgencyController.getAllAgencies);

// GET /api/agency/stats - エージェンシー統計情報取得
router.get('/stats', AgencyController.getAgencyStats);

// GET /api/agency/:id - 特定のエージェンシー詳細取得
router.get('/:id', AgencyController.getAgencyById);

// POST /api/agency - 新規エージェンシー作成
router.post('/', AgencyController.createAgency);

// PUT /api/agency/:id - エージェンシー情報更新
router.put('/:id', AgencyController.updateAgency);

// DELETE /api/agency/:id - エージェンシー削除
router.delete('/:id', AgencyController.deleteAgency);

module.exports = router; 