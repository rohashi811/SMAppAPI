const { Agency, Student } = require('../sequelize/models');
const { Op } = require('sequelize');

class AgencyController {
  // 全エージェンシー一覧取得（検索・ページネーション対応）
  static async getAllAgencies(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        sort_by = 'created_at',
        sort_order = 'DESC',
        sort = null
      } = req.query;

      // 検索条件の構築
      const whereClause = {};
      const includeClause = [
        {
          model: Student,
          attributes: ['id', 'first_name', 'last_name', 'gender'],
          required: false
        }
      ];

      // 名前での検索
      if (search) {
        whereClause.name = { [Op.like]: `%${search}%` };
      }

      // ソート設定
      const allowedSortFields = ['id', 'name', 'created_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      let orderClause = [['created_at', 'DESC']]; // デフォルト
      
      if (sort) {
        // 複数フィールドでのソート (例: "name:ASC,created_at:DESC")
        try {
          const sortFields = sort.split(',').map(s => s.trim());
          orderClause = sortFields.map(sortItem => {
            const [field, order] = sortItem.split(':');
            const validField = allowedSortFields.includes(field) ? field : 'created_at';
            const validOrder = allowedSortOrders.includes(order?.toUpperCase()) ? order.toUpperCase() : 'DESC';
            return [validField, validOrder];
          });
        } catch (error) {
          console.warn('Invalid sort parameter:', sort);
        }
      } else {
        // 単一フィールドでのソート
        const sortField = allowedSortFields.includes(sort_by) ? sort_by : 'created_at';
        const sortOrder = allowedSortOrders.includes(sort_order.toUpperCase()) ? sort_order.toUpperCase() : 'DESC';
        orderClause = [[sortField, sortOrder]];
      }
      
      // ページネーション設定
      const offset = (page - 1) * limit;
      const limitNum = parseInt(limit);

      // データ取得
      const { count, rows: agencies } = await Agency.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      // 各エージェンシーの学生数を計算
      const agenciesWithStudentCount = agencies.map(agency => {
        const agencyData = agency.toJSON();
        agencyData.student_count = agency.Students ? agency.Students.length : 0;
        return agencyData;
      });

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: agenciesWithStudentCount,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount: count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      console.error('Error fetching agencies:', error);
      res.status(500).json({
        success: false,
        message: 'エージェンシーデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定のエージェンシー詳細取得
  static async getAgencyById(req, res) {
    try {
      const agencyId = req.params.id;
      const agency = await Agency.findByPk(agencyId, {
        include: [
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender', 'arrival_date', 'leaving_date']
          }
        ]
      });

      if (!agency) {
        return res.status(404).json({
          success: false,
          message: '指定されたエージェンシーが見つかりません'
        });
      }

      const agencyData = agency.toJSON();
      agencyData.student_count = agency.Students ? agency.Students.length : 0;

      res.json({
        success: true,
        data: agencyData
      });
    } catch (error) {
      console.error('Error fetching agency:', error);
      res.status(500).json({
        success: false,
        message: 'エージェンシーデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 新規エージェンシー作成
  static async createAgency(req, res) {
    try {
      const { name } = req.body;

      // 必須フィールドのバリデーション
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'エージェンシー名は必須です'
        });
      }

      // エージェンシー名の重複チェック
      const existingAgency = await Agency.findOne({ where: { name } });
      if (existingAgency) {
        return res.status(400).json({
          success: false,
          message: '同じ名前のエージェンシーが既に存在します'
        });
      }

      // エージェンシーデータを作成
      const agency = await Agency.create({ name });

      res.status(201).json({
        success: true,
        message: 'エージェンシーが正常に作成されました',
        data: agency
      });
    } catch (error) {
      console.error('Error creating agency:', error);
      res.status(500).json({
        success: false,
        message: 'エージェンシーの作成に失敗しました',
        error: error.message
      });
    }
  }

  // エージェンシー情報更新
  static async updateAgency(req, res) {
    try {
      const agencyId = req.params.id;
      const { name } = req.body;

      // エージェンシーが存在するかチェック
      const existingAgency = await Agency.findByPk(agencyId);
      if (!existingAgency) {
        return res.status(404).json({
          success: false,
          message: '指定されたエージェンシーが見つかりません'
        });
      }

      // エージェンシー名の重複チェック（自分以外）
      if (name && name !== existingAgency.name) {
        const duplicateAgency = await Agency.findOne({ 
          where: { 
            name,
            id: { [Op.ne]: agencyId }
          } 
        });
        if (duplicateAgency) {
          return res.status(400).json({
            success: false,
            message: '同じ名前のエージェンシーが既に存在します'
          });
        }
      }

      // エージェンシーデータを更新
      await existingAgency.update({ name });

      res.json({
        success: true,
        message: 'エージェンシー情報が正常に更新されました',
        data: existingAgency
      });
    } catch (error) {
      console.error('Error updating agency:', error);
      res.status(500).json({
        success: false,
        message: 'エージェンシー情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // エージェンシー削除
  static async deleteAgency(req, res) {
    try {
      const agencyId = req.params.id;

      // エージェンシーが存在するかチェック
      const agency = await Agency.findByPk(agencyId, {
        include: [{ model: Student, attributes: ['id'] }]
      });
      
      if (!agency) {
        return res.status(404).json({
          success: false,
          message: '指定されたエージェンシーが見つかりません'
        });
      }

      // エージェンシーに所属する学生がいるかチェック
      if (agency.Students && agency.Students.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'このエージェンシーには学生が所属しているため削除できません',
          student_count: agency.Students.length
        });
      }

      // エージェンシーを削除
      await agency.destroy();

      res.json({
        success: true,
        message: 'エージェンシーが正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting agency:', error);
      res.status(500).json({
        success: false,
        message: 'エージェンシーの削除に失敗しました',
        error: error.message
      });
    }
  }

  // エージェンシー統計情報取得
  static async getAgencyStats(req, res) {
    try {
      // 総エージェンシー数
      const totalAgencies = await Agency.count();

      // 学生が所属するエージェンシー数
      const agenciesWithStudents = await Agency.count({
        include: [
          {
            model: Student,
            required: true
          }
        ]
      });

      // 空のエージェンシー数
      const emptyAgencies = totalAgencies - agenciesWithStudents;

      // エージェンシー別学生数統計
      const agencyStudentStats = await Agency.findAll({
        attributes: [
          'id',
          'name',
          [Agency.sequelize.fn('COUNT', Agency.sequelize.col('Students.id')), 'student_count']
        ],
        include: [
          {
            model: Student,
            attributes: [],
            required: false
          }
        ],
        group: ['Agency.id'],
        order: [[Agency.sequelize.fn('COUNT', Agency.sequelize.col('Students.id')), 'DESC']]
      });

      // 今月の新規エージェンシー数
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newAgenciesThisMonth = await Agency.count({
        where: {
          created_at: {
            [Op.gte]: firstDayOfMonth
          }
        }
      });

      res.json({
        success: true,
        data: {
          totalAgencies,
          agenciesWithStudents,
          emptyAgencies,
          agencyStudentStats,
          newAgenciesThisMonth
        }
      });
    } catch (error) {
      console.error('Error fetching agency stats:', error);
      res.status(500).json({
        success: false,
        message: '統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = AgencyController; 