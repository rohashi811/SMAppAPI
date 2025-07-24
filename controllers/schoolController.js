const { School, Student } = require('../sequelize/models');
const { Op } = require('sequelize');

class SchoolController {
  // 全学校一覧取得（検索・ページネーション対応）
  static async getAllSchools(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
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

      // カテゴリでのフィルター
      if (category) {
        whereClause.category = category;
      }

      // ソート設定
      const allowedSortFields = ['id', 'name', 'category', 'created_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      let orderClause = [['created_at', 'DESC']]; // デフォルト
      
      if (sort) {
        // 複数フィールドでのソート (例: "name:ASC,category:DESC")
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
      const { count, rows: schools } = await School.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      // 各学校の学生数を計算
      const schoolsWithStudentCount = schools.map(school => {
        const schoolData = school.toJSON();
        schoolData.student_count = school.Students ? school.Students.length : 0;
        return schoolData;
      });

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: schoolsWithStudentCount,
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
      console.error('Error fetching schools:', error);
      res.status(500).json({
        success: false,
        message: '学校データの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定の学校詳細取得
  static async getSchoolById(req, res) {
    try {
      const schoolId = req.params.id;
      const school = await School.findByPk(schoolId, {
        include: [
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender', 'arrival_date', 'leaving_date']
          }
        ]
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: '指定された学校が見つかりません'
        });
      }

      const schoolData = school.toJSON();
      schoolData.student_count = school.Students ? school.Students.length : 0;

      res.json({
        success: true,
        data: schoolData
      });
    } catch (error) {
      console.error('Error fetching school:', error);
      res.status(500).json({
        success: false,
        message: '学校データの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 新規学校作成
  static async createSchool(req, res) {
    try {
      const { name, category } = req.body;

      // 必須フィールドのバリデーション
      if (!name || !category) {
        return res.status(400).json({
          success: false,
          message: '学校名とカテゴリは必須です'
        });
      }

      // カテゴリの妥当性チェック
      const validCategories = ['language', 'secondary', 'college', 'university'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: '無効なカテゴリです。有効なカテゴリ: language, secondary, college, university'
        });
      }

      // 学校名の重複チェック
      const existingSchool = await School.findOne({ where: { name } });
      if (existingSchool) {
        return res.status(400).json({
          success: false,
          message: '同じ名前の学校が既に存在します'
        });
      }

      // 学校データを作成
      const school = await School.create({ name, category });

      res.status(201).json({
        success: true,
        message: '学校が正常に作成されました',
        data: school
      });
    } catch (error) {
      console.error('Error creating school:', error);
      res.status(500).json({
        success: false,
        message: '学校の作成に失敗しました',
        error: error.message
      });
    }
  }

  // 学校情報更新
  static async updateSchool(req, res) {
    try {
      const schoolId = req.params.id;
      const { name, category } = req.body;

      // 学校が存在するかチェック
      const existingSchool = await School.findByPk(schoolId);
      if (!existingSchool) {
        return res.status(404).json({
          success: false,
          message: '指定された学校が見つかりません'
        });
      }

      // カテゴリの妥当性チェック
      if (category) {
        const validCategories = ['language', 'secondary', 'college', 'university'];
        if (!validCategories.includes(category)) {
          return res.status(400).json({
            success: false,
            message: '無効なカテゴリです。有効なカテゴリ: language, secondary, college, university'
          });
        }
      }

      // 学校名の重複チェック（自分以外）
      if (name && name !== existingSchool.name) {
        const duplicateSchool = await School.findOne({ 
          where: { 
            name,
            id: { [Op.ne]: schoolId }
          } 
        });
        if (duplicateSchool) {
          return res.status(400).json({
            success: false,
            message: '同じ名前の学校が既に存在します'
          });
        }
      }

      // 学校データを更新
      await existingSchool.update({ name, category });

      res.json({
        success: true,
        message: '学校情報が正常に更新されました',
        data: existingSchool
      });
    } catch (error) {
      console.error('Error updating school:', error);
      res.status(500).json({
        success: false,
        message: '学校情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // 学校削除
  static async deleteSchool(req, res) {
    try {
      const schoolId = req.params.id;

      // 学校が存在するかチェック
      const school = await School.findByPk(schoolId, {
        include: [{ model: Student, attributes: ['id'] }]
      });
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: '指定された学校が見つかりません'
        });
      }

      // 学校に所属する学生がいるかチェック
      if (school.Students && school.Students.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'この学校には学生が所属しているため削除できません',
          student_count: school.Students.length
        });
      }

      // 学校を削除
      await school.destroy();

      res.json({
        success: true,
        message: '学校が正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      res.status(500).json({
        success: false,
        message: '学校の削除に失敗しました',
        error: error.message
      });
    }
  }

  // 学校統計情報取得
  static async getSchoolStats(req, res) {
    try {
      // 総学校数
      const totalSchools = await School.count();

      // 学生が所属する学校数
      const schoolsWithStudents = await School.count({
        include: [
          {
            model: Student,
            required: true
          }
        ]
      });

      // 空の学校数
      const emptySchools = totalSchools - schoolsWithStudents;

      // カテゴリ別統計
      const categoryStats = await School.findAll({
        attributes: [
          'category',
          [School.sequelize.fn('COUNT', School.sequelize.col('id')), 'count']
        ],
        group: ['category']
      });

      // 学校別学生数統計
      const schoolStudentStats = await School.findAll({
        attributes: [
          'id',
          'name',
          'category',
          [School.sequelize.fn('COUNT', School.sequelize.col('Students.id')), 'student_count']
        ],
        include: [
          {
            model: Student,
            attributes: [],
            required: false
          }
        ],
        group: ['School.id'],
        order: [[School.sequelize.fn('COUNT', School.sequelize.col('Students.id')), 'DESC']]
      });

      // 今月の新規学校数
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newSchoolsThisMonth = await School.count({
        where: {
          created_at: {
            [Op.gte]: firstDayOfMonth
          }
        }
      });

      res.json({
        success: true,
        data: {
          totalSchools,
          schoolsWithStudents,
          emptySchools,
          categoryStats,
          schoolStudentStats,
          newSchoolsThisMonth
        }
      });
    } catch (error) {
      console.error('Error fetching school stats:', error);
      res.status(500).json({
        success: false,
        message: '統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = SchoolController; 