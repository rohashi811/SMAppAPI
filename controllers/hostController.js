const { Host, HostDetail, HostFamily, AcceptanceSchedule } = require('../sequelize/models');
const { Op } = require('sequelize');

class HostController {
  // 全ホスト一覧取得（検索・ページネーション対応）
  static async getAllHosts(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        has_pet,
        min_rooms,
        max_rooms,
        sort_by = 'created_at',
        sort_order = 'DESC',
        sort = null
      } = req.query;

      // 検索条件の構築
      const whereClause = {};
      const includeClause = [
        {
          model: HostDetail,
          attributes: ['email', 'num_of_room', 'pet', 'note']
        },
        {
          model: HostFamily,
          attributes: ['name', 'relation', 'phone', 'date_of_birth']
        }
      ];

      // 名前での検索
      if (search) {
        whereClause[Op.or] = [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } }
        ];
      }

      // フィルター条件
      if (status) whereClause.status = status;

      // ペットの有無でフィルター
      if (has_pet !== undefined) {
        includeClause[0].where = { pet: has_pet === 'true' };
      }

      // 部屋数の範囲フィルター
      if (min_rooms || max_rooms) {
        if (!includeClause[0].where) includeClause[0].where = {};
        if (min_rooms) includeClause[0].where.num_of_room = { [Op.gte]: parseInt(min_rooms) };
        if (max_rooms) {
          if (includeClause[0].where.num_of_room) {
            includeClause[0].where.num_of_room[Op.lte] = parseInt(max_rooms);
          } else {
            includeClause[0].where.num_of_room = { [Op.lte]: parseInt(max_rooms) };
          }
        }
      }

      // ソート設定
      const allowedSortFields = ['id', 'first_name', 'last_name', 'status', 'created_at'];
      const allowedSortOrders = ['ASC', 'DESC'];
      
      let orderClause = [['created_at', 'DESC']]; // デフォルト
      
      if (sort) {
        // 複数フィールドでのソート (例: "last_name:ASC,first_name:DESC")
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
      const { count, rows: hosts } = await Host.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: hosts,
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
      console.error('Error fetching hosts:', error);
      res.status(500).json({
        success: false,
        message: 'ホストデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定のホスト詳細取得
  static async getHostById(req, res) {
    try {
      const hostId = req.params.id;
      const host = await Host.findByPk(hostId, {
        include: [
          {
            model: HostDetail,
            attributes: ['email', 'num_of_room', 'pet', 'note']
          },
          {
            model: HostFamily,
            attributes: ['name', 'relation', 'phone', 'date_of_birth']
          },
          {
            model: AcceptanceSchedule,
            attributes: ['id', 'start_date', 'end_date', 'is_rook', 'is_extendable']
          }
        ]
      });

      if (!host) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      res.json({
        success: true,
        data: host
      });
    } catch (error) {
      console.error('Error fetching host:', error);
      res.status(500).json({
        success: false,
        message: 'ホストデータの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 新規ホスト作成
  static async createHost(req, res) {
    try {
      const {
        first_name,
        last_name,
        phone,
        address,
        status,
        host_detail,
        host_family
      } = req.body;

      // 必須フィールドのバリデーション
      if (!first_name || !last_name || !address) {
        return res.status(400).json({
          success: false,
          message: '必須フィールドが不足しています'
        });
      }

      // ホストデータを作成
      const host = await Host.create({
        first_name,
        last_name,
        phone,
        address,
        status: status || 'Ok'
      });

      // ホスト詳細データがある場合は作成
      if (host_detail) {
        await HostDetail.create({
          host_id: host.id,
          ...host_detail
        });
      }

      // ホストファミリーデータがある場合は作成
      if (host_family && Array.isArray(host_family)) {
        for (const familyMember of host_family) {
          await HostFamily.create({
            host_id: host.id,
            ...familyMember
          });
        }
      }

      // 作成されたホストデータを取得（関連データ含む）
      const createdHost = await Host.findByPk(host.id, {
        include: [
          {
            model: HostDetail,
            attributes: ['email', 'num_of_room', 'pet', 'note']
          },
          {
            model: HostFamily,
            attributes: ['name', 'relation', 'phone', 'date_of_birth']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'ホストが正常に作成されました',
        data: createdHost
      });
    } catch (error) {
      console.error('Error creating host:', error);
      res.status(500).json({
        success: false,
        message: 'ホストの作成に失敗しました',
        error: error.message
      });
    }
  }

  // ホスト情報更新
  static async updateHost(req, res) {
    try {
      const hostId = req.params.id;
      const {
        first_name,
        last_name,
        phone,
        address,
        status,
        host_detail,
        host_family
      } = req.body;

      // ホストが存在するかチェック
      const existingHost = await Host.findByPk(hostId);
      if (!existingHost) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      // ホストデータを更新
      await existingHost.update({
        first_name,
        last_name,
        phone,
        address,
        status
      });

      // ホスト詳細データの更新
      if (host_detail) {
        const existingDetail = await HostDetail.findByPk(hostId);
        if (existingDetail) {
          await existingDetail.update(host_detail);
        } else {
          await HostDetail.create({
            host_id: hostId,
            ...host_detail
          });
        }
      }

      // ホストファミリーデータの更新
      if (host_family && Array.isArray(host_family)) {
        // 既存のファミリーデータを削除
        await HostFamily.destroy({ where: { host_id: hostId } });
        
        // 新しいファミリーデータを作成
        for (const familyMember of host_family) {
          await HostFamily.create({
            host_id: hostId,
            ...familyMember
          });
        }
      }

      // 更新されたホストデータを取得
      const updatedHost = await Host.findByPk(hostId, {
        include: [
          {
            model: HostDetail,
            attributes: ['email', 'num_of_room', 'pet', 'note']
          },
          {
            model: HostFamily,
            attributes: ['name', 'relation', 'phone', 'date_of_birth']
          }
        ]
      });

      res.json({
        success: true,
        message: 'ホスト情報が正常に更新されました',
        data: updatedHost
      });
    } catch (error) {
      console.error('Error updating host:', error);
      res.status(500).json({
        success: false,
        message: 'ホスト情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // ホスト削除
  static async deleteHost(req, res) {
    try {
      const hostId = req.params.id;

      // ホストが存在するかチェック
      const host = await Host.findByPk(hostId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      // ホスト詳細データとファミリーデータも削除（CASCADE設定により自動削除）
      await host.destroy();

      res.json({
        success: true,
        message: 'ホストが正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting host:', error);
      res.status(500).json({
        success: false,
        message: 'ホストの削除に失敗しました',
        error: error.message
      });
    }
  }

  // ホスト詳細情報のみ取得
  static async getHostDetail(req, res) {
    try {
      const hostId = req.params.id;
      const hostDetail = await HostDetail.findByPk(hostId);

      if (!hostDetail) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストの詳細情報が見つかりません'
        });
      }

      res.json({
        success: true,
        data: hostDetail
      });
    } catch (error) {
      console.error('Error fetching host detail:', error);
      res.status(500).json({
        success: false,
        message: 'ホスト詳細情報の取得に失敗しました',
        error: error.message
      });
    }
  }

  // ホスト詳細情報更新
  static async updateHostDetail(req, res) {
    try {
      const hostId = req.params.id;
      const hostDetailData = req.body;

      // ホストが存在するかチェック
      const host = await Host.findByPk(hostId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      // ホスト詳細データの更新または作成
      const [hostDetail, created] = await HostDetail.findOrCreate({
        where: { host_id: hostId },
        defaults: hostDetailData
      });

      if (!created) {
        await hostDetail.update(hostDetailData);
      }

      res.json({
        success: true,
        message: 'ホスト詳細情報が正常に更新されました',
        data: hostDetail
      });
    } catch (error) {
      console.error('Error updating host detail:', error);
      res.status(500).json({
        success: false,
        message: 'ホスト詳細情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // ホストファミリー情報取得
  static async getHostFamily(req, res) {
    try {
      const hostId = req.params.id;
      const hostFamily = await HostFamily.findAll({
        where: { host_id: hostId }
      });

      res.json({
        success: true,
        data: hostFamily
      });
    } catch (error) {
      console.error('Error fetching host family:', error);
      res.status(500).json({
        success: false,
        message: 'ホストファミリー情報の取得に失敗しました',
        error: error.message
      });
    }
  }

  // ホストファミリー情報更新
  static async updateHostFamily(req, res) {
    try {
      const hostId = req.params.id;
      const hostFamilyData = req.body; // 配列として受け取る

      // ホストが存在するかチェック
      const host = await Host.findByPk(hostId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      if (!Array.isArray(hostFamilyData)) {
        return res.status(400).json({
          success: false,
          message: 'ファミリーデータは配列形式で送信してください'
        });
      }

      // 既存のファミリーデータを削除
      await HostFamily.destroy({ where: { host_id: hostId } });
      
      // 新しいファミリーデータを作成
      const createdFamily = [];
      for (const familyMember of hostFamilyData) {
        const newFamily = await HostFamily.create({
          host_id: hostId,
          ...familyMember
        });
        createdFamily.push(newFamily);
      }

      res.json({
        success: true,
        message: 'ホストファミリー情報が正常に更新されました',
        data: createdFamily
      });
    } catch (error) {
      console.error('Error updating host family:', error);
      res.status(500).json({
        success: false,
        message: 'ホストファミリー情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // ホスト統計情報取得
  static async getHostStats(req, res) {
    try {
      // 総ホスト数
      const totalHosts = await Host.count();

      // ステータス別統計
      const statusStats = await Host.findAll({
        attributes: [
          'status',
          [Host.sequelize.fn('COUNT', Host.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      // ペット有無別統計
      const petStats = await HostDetail.findAll({
        attributes: [
          'pet',
          [HostDetail.sequelize.fn('COUNT', HostDetail.sequelize.col('host_id')), 'count']
        ],
        group: ['pet']
      });

      // 部屋数別統計
      const roomStats = await HostDetail.findAll({
        attributes: [
          'num_of_room',
          [HostDetail.sequelize.fn('COUNT', HostDetail.sequelize.col('host_id')), 'count']
        ],
        group: ['num_of_room'],
        where: {
          num_of_room: { [Op.ne]: null }
        }
      });

      // 今月の新規ホスト数
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newHostsThisMonth = await Host.count({
        where: {
          created_at: {
            [Op.gte]: firstDayOfMonth
          }
        }
      });

      // アクティブなホスト数（ステータスが'Great'または'Ok'）
      const activeHosts = await Host.count({
        where: {
          status: { [Op.in]: ['Great', 'Ok'] }
        }
      });

      res.json({
        success: true,
        data: {
          totalHosts,
          statusStats,
          petStats,
          roomStats,
          newHostsThisMonth,
          activeHosts
        }
      });
    } catch (error) {
      console.error('Error fetching host stats:', error);
      res.status(500).json({
        success: false,
        message: '統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = HostController; 