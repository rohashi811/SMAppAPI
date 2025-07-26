const { Payment, Company, Student, Host } = require('../sequelize/models');
const { Op } = require('sequelize');

class PaymentController {
  // 支払い一覧取得
  static async getAllPayments(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        type, 
        status, 
        category, 
        payment_method,
        start_date,
        end_date,
        company_id,
        student_id,
        host_id,
        search
      } = req.query;
      
      const offset = (page - 1) * limit;

      // 検索条件の構築
      const whereClause = {};
      
      if (type) {
        whereClause.type = type;
      }

      if (status) {
        whereClause.status = status;
      }

      if (category) {
        whereClause.category = category;
      }

      if (payment_method) {
        whereClause.payment_method = payment_method;
      }

      if (start_date && end_date) {
        whereClause.payment_date = {
          [Op.between]: [start_date, end_date]
        };
      } else if (start_date) {
        whereClause.payment_date = {
          [Op.gte]: start_date
        };
      } else if (end_date) {
        whereClause.payment_date = {
          [Op.lte]: end_date
        };
      }

      if (company_id) {
        whereClause.company_id = company_id;
      }

      if (student_id) {
        whereClause.student_id = student_id;
      }

      if (host_id) {
        whereClause.host_id = host_id;
      }

      if (search) {
        whereClause[Op.or] = [
          { description: { [Op.like]: `%${search}%` } },
          { category: { [Op.like]: `%${search}%` } },
          { reference_number: { [Op.like]: `%${search}%` } },
          { notes: { [Op.like]: `%${search}%` } }
        ];
      }

      const payments = await Payment.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Host,
            as: 'host',
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['payment_date', 'DESC'], ['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: payments.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(payments.count / limit),
          total_items: payments.count,
          items_per_page: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({
        success: false,
        message: '支払い一覧の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定の支払い取得
  static async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      
      const payment = await Payment.findByPk(id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Host,
            as: 'host',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: '指定された支払いが見つかりません'
        });
      }

      res.json({
        success: true,
        data: payment
      });
    } catch (error) {
      console.error('Error fetching payment:', error);
      res.status(500).json({
        success: false,
        message: '支払い情報の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 支払い作成
  static async createPayment(req, res) {
    try {
      const paymentData = req.body;

      // バリデーション
      if (!paymentData.type || !paymentData.amount || !paymentData.payment_date) {
        return res.status(400).json({
          success: false,
          message: '支払いタイプ、金額、支払い日は必須です'
        });
      }

      const payment = await Payment.create(paymentData);

      // 作成された支払いを関連データと一緒に取得
      const createdPayment = await Payment.findByPk(payment.id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Host,
            as: 'host',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: '支払いが正常に作成されました',
        data: createdPayment
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'バリデーションエラー',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: '支払いの作成に失敗しました',
        error: error.message
      });
    }
  }

  // 支払い更新
  static async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: '指定された支払いが見つかりません'
        });
      }

      await payment.update(updateData);

      // 更新された支払いを関連データと一緒に取得
      const updatedPayment = await Payment.findByPk(id, {
        include: [
          {
            model: Company,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Student,
            as: 'student',
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: Host,
            as: 'host',
            attributes: ['id', 'first_name', 'last_name']
          }
        ]
      });

      res.json({
        success: true,
        message: '支払い情報が正常に更新されました',
        data: updatedPayment
      });
    } catch (error) {
      console.error('Error updating payment:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'バリデーションエラー',
          errors: error.errors.map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        message: '支払いの更新に失敗しました',
        error: error.message
      });
    }
  }

  // 支払い削除
  static async deletePayment(req, res) {
    try {
      const { id } = req.params;

      const payment = await Payment.findByPk(id);
      
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: '指定された支払いが見つかりません'
        });
      }

      await payment.destroy();

      res.json({
        success: true,
        message: '支払いが正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({
        success: false,
        message: '支払いの削除に失敗しました',
        error: error.message
      });
    }
  }

  // 財務サマリー取得
  static async getFinancialSummary(req, res) {
    try {
      const { start_date, end_date, type } = req.query;
      
      const whereClause = {};
      
      if (start_date && end_date) {
        whereClause.payment_date = {
          [Op.between]: [start_date, end_date]
        };
      } else if (start_date) {
        whereClause.payment_date = {
          [Op.gte]: start_date
        };
      } else if (end_date) {
        whereClause.payment_date = {
          [Op.lte]: end_date
        };
      }

      if (type) {
        whereClause.type = type;
      }

      // 収入合計
      const totalIncome = await Payment.sum('amount', {
        where: {
          ...whereClause,
          type: 'income',
          status: 'completed'
        }
      });

      // 支出合計
      const totalExpense = await Payment.sum('amount', {
        where: {
          ...whereClause,
          type: 'expense',
          status: 'completed'
        }
      });

      // 保留中の収入
      const pendingIncome = await Payment.sum('amount', {
        where: {
          ...whereClause,
          type: 'income',
          status: 'pending'
        }
      });

      // 保留中の支出
      const pendingExpense = await Payment.sum('amount', {
        where: {
          ...whereClause,
          type: 'expense',
          status: 'pending'
        }
      });

      // カテゴリ別集計
      const categorySummary = await Payment.findAll({
        attributes: [
          'category',
          'type',
          [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total_amount'],
          [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count']
        ],
        where: whereClause,
        group: ['category', 'type'],
        raw: true
      });

      // 月別集計
      const monthlySummary = await Payment.findAll({
        attributes: [
          [Payment.sequelize.fn('DATE_FORMAT', Payment.sequelize.col('payment_date'), '%Y-%m'), 'month'],
          'type',
          [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'total_amount'],
          [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count']
        ],
        where: whereClause,
        group: ['month', 'type'],
        order: [['month', 'DESC']],
        raw: true
      });

      res.json({
        success: true,
        data: {
          summary: {
            total_income: totalIncome || 0,
            total_expense: totalExpense || 0,
            net_income: (totalIncome || 0) - (totalExpense || 0),
            pending_income: pendingIncome || 0,
            pending_expense: pendingExpense || 0
          },
          category_summary: categorySummary,
          monthly_summary: monthlySummary
        }
      });
    } catch (error) {
      console.error('Error fetching financial summary:', error);
      res.status(500).json({
        success: false,
        message: '財務サマリーの取得に失敗しました',
        error: error.message
      });
    }
  }

  // カテゴリ一覧取得
  static async getCategories(req, res) {
    try {
      const categories = await Payment.findAll({
        attributes: [[Payment.sequelize.fn('DISTINCT', Payment.sequelize.col('category')), 'category']],
        where: {
          category: {
            [Op.not]: null
          }
        },
        raw: true
      });

      const categoryList = categories
        .map(item => item.category)
        .filter(category => category && category.trim() !== '');

      res.json({
        success: true,
        data: categoryList
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'カテゴリ一覧の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 支払い統計情報取得
  static async getPaymentStats(req, res) {
    try {
      const totalPayments = await Payment.count();
      const completedPayments = await Payment.count({ where: { status: 'completed' } });
      const pendingPayments = await Payment.count({ where: { status: 'pending' } });
      const cancelledPayments = await Payment.count({ where: { status: 'cancelled' } });
      const failedPayments = await Payment.count({ where: { status: 'failed' } });

      const typeStats = await Payment.findAll({
        attributes: [
          'type',
          [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count']
        ],
        group: ['type'],
        raw: true
      });

      const methodStats = await Payment.findAll({
        attributes: [
          'payment_method',
          [Payment.sequelize.fn('COUNT', Payment.sequelize.col('id')), 'count']
        ],
        where: {
          payment_method: {
            [Op.not]: null
          }
        },
        group: ['payment_method'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalPayments,
          by_status: {
            completed: completedPayments,
            pending: pendingPayments,
            cancelled: cancelledPayments,
            failed: failedPayments
          },
          by_type: typeStats,
          by_method: methodStats
        }
      });
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      res.status(500).json({
        success: false,
        message: '支払い統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = PaymentController; 