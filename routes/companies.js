const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');

// GET /api/v0/company - 会社一覧取得
router.get('/', CompanyController.getAllCompanies);

// GET /api/v0/company/stats - 会社統計情報取得
router.get('/stats', CompanyController.getCompanyStats);

// GET /api/v0/company/industries - 業界一覧取得
router.get('/industries', CompanyController.getIndustries);

// GET /api/v0/company/:id - 特定の会社取得
router.get('/:id', CompanyController.getCompanyById);

// POST /api/v0/company - 会社作成
router.post('/', CompanyController.createCompany);

// PUT /api/v0/company/:id - 会社更新
router.put('/:id', CompanyController.updateCompany);

// DELETE /api/v0/company/:id - 会社削除
router.delete('/:id', CompanyController.deleteCompany);

module.exports = router; 