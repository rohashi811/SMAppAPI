const { Company } = require('../sequelize/models');
const { Op } = require('sequelize');

class CompanyController {
  // 会社一覧取得
  static async getAllCompanies(req, res) {
    try {
      const { page = 1, limit = 10, search, industry, status, size } = req.query;
      const offset = (page - 1) * limit;

      // 検索条件の構築
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { address: { [Op.like]: `%${search}%` } }
        ];
      }

      if (industry) {
        whereClause.industry = industry;
      }

      if (status) {
        whereClause.status = status;
      }

      if (size) {
        whereClause.size = size;
      }

      const companies = await Company.findAndCountAll({
        where: whereClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        success: true,
        data: companies.rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(companies.count / limit),
          total_items: companies.count,
          items_per_page: parseInt(limit)
        }
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({
        success: false,
        message: '会社一覧の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定の会社取得
  static async getCompanyById(req, res) {
    try {
      const { id } = req.params;
      
      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: '指定された会社が見つかりません'
        });
      }

      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({
        success: false,
        message: '会社情報の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 会社作成
  static async createCompany(req, res) {
    try {
      const companyData = req.body;

      // バリデーション
      if (!companyData.name) {
        return res.status(400).json({
          success: false,
          message: '会社名は必須です'
        });
      }

      const company = await Company.create(companyData);

      res.status(201).json({
        success: true,
        message: '会社が正常に作成されました',
        data: company
      });
    } catch (error) {
      console.error('Error creating company:', error);
      
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
        message: '会社の作成に失敗しました',
        error: error.message
      });
    }
  }

  // 会社更新
  static async updateCompany(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: '指定された会社が見つかりません'
        });
      }

      await company.update(updateData);

      res.json({
        success: true,
        message: '会社情報が正常に更新されました',
        data: company
      });
    } catch (error) {
      console.error('Error updating company:', error);
      
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
        message: '会社の更新に失敗しました',
        error: error.message
      });
    }
  }

  // 会社削除
  static async deleteCompany(req, res) {
    try {
      const { id } = req.params;

      const company = await Company.findByPk(id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: '指定された会社が見つかりません'
        });
      }

      await company.destroy();

      res.json({
        success: true,
        message: '会社が正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      res.status(500).json({
        success: false,
        message: '会社の削除に失敗しました',
        error: error.message
      });
    }
  }

  // 業界一覧取得
  static async getIndustries(req, res) {
    try {
      const industries = await Company.findAll({
        attributes: [[Company.sequelize.fn('DISTINCT', Company.sequelize.col('industry')), 'industry']],
        where: {
          industry: {
            [Op.not]: null
          }
        },
        raw: true
      });

      const industryList = industries
        .map(item => item.industry)
        .filter(industry => industry && industry.trim() !== '');

      res.json({
        success: true,
        data: industryList
      });
    } catch (error) {
      console.error('Error fetching industries:', error);
      res.status(500).json({
        success: false,
        message: '業界一覧の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 会社統計情報取得
  static async getCompanyStats(req, res) {
    try {
      const totalCompanies = await Company.count();
      const activeCompanies = await Company.count({ where: { status: 'active' } });
      const inactiveCompanies = await Company.count({ where: { status: 'inactive' } });
      const pendingCompanies = await Company.count({ where: { status: 'pending' } });

      const sizeStats = await Company.findAll({
        attributes: [
          'size',
          [Company.sequelize.fn('COUNT', Company.sequelize.col('id')), 'count']
        ],
        where: {
          size: {
            [Op.not]: null
          }
        },
        group: ['size'],
        raw: true
      });

      res.json({
        success: true,
        data: {
          total: totalCompanies,
          by_status: {
            active: activeCompanies,
            inactive: inactiveCompanies,
            pending: pendingCompanies
          },
          by_size: sizeStats
        }
      });
    } catch (error) {
      console.error('Error fetching company stats:', error);
      res.status(500).json({
        success: false,
        message: '会社統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = CompanyController; 