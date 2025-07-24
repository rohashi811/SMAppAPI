const { Group, Student } = require('../sequelize/models');
const { Op } = require('sequelize');

class GroupController {
  // 全グループ一覧取得（検索・ページネーション対応）
  static async getAllGroups(req, res) {
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
      const { count, rows: groups } = await Group.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      // 各グループの学生数を計算
      const groupsWithStudentCount = groups.map(group => {
        const groupData = group.toJSON();
        groupData.student_count = group.Students ? group.Students.length : 0;
        return groupData;
      });

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: groupsWithStudentCount,
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
      console.error('Error fetching groups:', error);
      res.status(500).json({
        success: false,
        message: 'グループデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定のグループ詳細取得
  static async getGroupById(req, res) {
    try {
      const groupId = req.params.id;
      const group = await Group.findByPk(groupId, {
        include: [
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender', 'arrival_date', 'leaving_date']
          }
        ]
      });

      if (!group) {
        return res.status(404).json({
          success: false,
          message: '指定されたグループが見つかりません'
        });
      }

      const groupData = group.toJSON();
      groupData.student_count = group.Students ? group.Students.length : 0;

      res.json({
        success: true,
        data: groupData
      });
    } catch (error) {
      console.error('Error fetching group:', error);
      res.status(500).json({
        success: false,
        message: 'グループデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 新規グループ作成
  static async createGroup(req, res) {
    try {
      const { name } = req.body;

      // 必須フィールドのバリデーション
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'グループ名は必須です'
        });
      }

      // グループ名の重複チェック
      const existingGroup = await Group.findOne({ where: { name } });
      if (existingGroup) {
        return res.status(400).json({
          success: false,
          message: '同じ名前のグループが既に存在します'
        });
      }

      // グループデータを作成
      const group = await Group.create({ name });

      res.status(201).json({
        success: true,
        message: 'グループが正常に作成されました',
        data: group
      });
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({
        success: false,
        message: 'グループの作成に失敗しました',
        error: error.message
      });
    }
  }

  // グループ情報更新
  static async updateGroup(req, res) {
    try {
      const groupId = req.params.id;
      const { name } = req.body;

      // グループが存在するかチェック
      const existingGroup = await Group.findByPk(groupId);
      if (!existingGroup) {
        return res.status(404).json({
          success: false,
          message: '指定されたグループが見つかりません'
        });
      }

      // グループ名の重複チェック（自分以外）
      if (name && name !== existingGroup.name) {
        const duplicateGroup = await Group.findOne({ 
          where: { 
            name,
            id: { [Op.ne]: groupId }
          } 
        });
        if (duplicateGroup) {
          return res.status(400).json({
            success: false,
            message: '同じ名前のグループが既に存在します'
          });
        }
      }

      // グループデータを更新
      await existingGroup.update({ name });

      res.json({
        success: true,
        message: 'グループ情報が正常に更新されました',
        data: existingGroup
      });
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({
        success: false,
        message: 'グループ情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // グループ削除
  static async deleteGroup(req, res) {
    try {
      const groupId = req.params.id;

      // グループが存在するかチェック
      const group = await Group.findByPk(groupId, {
        include: [{ model: Student, attributes: ['id'] }]
      });
      
      if (!group) {
        return res.status(404).json({
          success: false,
          message: '指定されたグループが見つかりません'
        });
      }

      // グループに所属する学生がいるかチェック
      if (group.Students && group.Students.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'このグループには学生が所属しているため削除できません',
          student_count: group.Students.length
        });
      }

      // グループを削除
      await group.destroy();

      res.json({
        success: true,
        message: 'グループが正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({
        success: false,
        message: 'グループの削除に失敗しました',
        error: error.message
      });
    }
  }

  // グループ統計情報取得
  static async getGroupStats(req, res) {
    try {
      // 総グループ数
      const totalGroups = await Group.count();

      // 学生が所属するグループ数
      const groupsWithStudents = await Group.count({
        include: [
          {
            model: Student,
            required: true
          }
        ]
      });

      // 空のグループ数
      const emptyGroups = totalGroups - groupsWithStudents;

      // グループ別学生数統計
      const groupStudentStats = await Group.findAll({
        attributes: [
          'id',
          'name',
          [Group.sequelize.fn('COUNT', Group.sequelize.col('Students.id')), 'student_count']
        ],
        include: [
          {
            model: Student,
            attributes: [],
            required: false
          }
        ],
        group: ['Group.id'],
        order: [[Group.sequelize.fn('COUNT', Group.sequelize.col('Students.id')), 'DESC']]
      });

      // 今月の新規グループ数
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newGroupsThisMonth = await Group.count({
        where: {
          created_at: {
            [Op.gte]: firstDayOfMonth
          }
        }
      });

      res.json({
        success: true,
        data: {
          totalGroups,
          groupsWithStudents,
          emptyGroups,
          groupStudentStats,
          newGroupsThisMonth
        }
      });
    } catch (error) {
      console.error('Error fetching group stats:', error);
      res.status(500).json({
        success: false,
        message: '統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = GroupController; 