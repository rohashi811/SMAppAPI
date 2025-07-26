const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

// GET /api/v0/payment - 支払い一覧取得
router.get('/', PaymentController.getAllPayments);

// GET /api/v0/payment/summary - 財務サマリー取得
router.get('/summary', PaymentController.getFinancialSummary);

// GET /api/v0/payment/stats - 支払い統計情報取得
router.get('/stats', PaymentController.getPaymentStats);

// GET /api/v0/payment/categories - カテゴリ一覧取得
router.get('/categories', PaymentController.getCategories);

// GET /api/v0/payment/:id - 特定の支払い取得
router.get('/:id', PaymentController.getPaymentById);

// POST /api/v0/payment - 支払い作成
router.post('/', PaymentController.createPayment);

// PUT /api/v0/payment/:id - 支払い更新
router.put('/:id', PaymentController.updatePayment);

// DELETE /api/v0/payment/:id - 支払い削除
router.delete('/:id', PaymentController.deletePayment);

module.exports = router; 