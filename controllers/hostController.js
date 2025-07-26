const { Host, HostDetail, HostFamily, AcceptanceSchedule, Student } = require('../sequelize/models');
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

  // 特定の日付の滞在者数取得
  static async getOccupancyByDate(req, res) {
    try {
      const { date, host_id } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: '日付パラメータ（date）が必要です'
        });
      }

      // 日付形式の検証
      const targetDate = new Date(date);
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: '有効な日付形式で指定してください（YYYY-MM-DD）'
        });
      }

      const whereClause = {
        start_date: { [Op.lte]: date },
        end_date: { [Op.gte]: date }
      };

      // 特定のホストが指定されている場合
      if (host_id) {
        whereClause.host_id = host_id;
      }

      // 指定日付に滞在しているスケジュールを取得
      const schedules = await AcceptanceSchedule.findAll({
        where: whereClause,
        include: [
          {
            model: Host,
            attributes: ['id', 'first_name', 'last_name', 'address']
          },
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            required: false
          }
        ]
      });

      // ホスト別の滞在者数を集計
      const occupancyByHost = {};
      let totalOccupancy = 0;

      schedules.forEach(schedule => {
        const hostId = schedule.host_id;
        const hostName = `${schedule.Host.first_name} ${schedule.Host.last_name}`;
        
        if (!occupancyByHost[hostId]) {
          occupancyByHost[hostId] = {
            host_id: hostId,
            host_name: hostName,
            address: schedule.Host.address,
            occupancy_count: 0,
            schedules: []
          };
        }

        occupancyByHost[hostId].occupancy_count++;
        occupancyByHost[hostId].schedules.push({
          id: schedule.id,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          is_rook: schedule.is_rook,
          student_name: schedule.Student ? `${schedule.Student.first_name} ${schedule.Student.last_name}` : null,
          gender: schedule.gender,
          nationality: schedule.nationality
        });

        totalOccupancy++;
      });

      const result = {
        date: date,
        total_occupancy: totalOccupancy,
        host_count: Object.keys(occupancyByHost).length,
        occupancy_by_host: Object.values(occupancyByHost)
      };

      // 特定のホストが指定されている場合は、そのホストの情報のみ返す
      if (host_id) {
        const hostOccupancy = occupancyByHost[host_id];
        if (hostOccupancy) {
          res.json({
            success: true,
            data: {
              date: date,
              host_id: parseInt(host_id),
              host_name: hostOccupancy.host_name,
              address: hostOccupancy.address,
              occupancy_count: hostOccupancy.occupancy_count,
              schedules: hostOccupancy.schedules
            }
          });
        } else {
          res.json({
            success: true,
            data: {
              date: date,
              host_id: parseInt(host_id),
              occupancy_count: 0,
              schedules: []
            }
          });
        }
      } else {
        res.json({
          success: true,
          data: result
        });
      }
    } catch (error) {
      console.error('Error fetching occupancy by date:', error);
      res.status(500).json({
        success: false,
        message: '滞在者数の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 日付範囲での滞在者数取得
  static async getOccupancyByDateRange(req, res) {
    try {
      const { start_date, end_date, host_id } = req.query;
      
      if (!start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: '開始日（start_date）と終了日（end_date）パラメータが必要です'
        });
      }

      // 日付形式の検証
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: '有効な日付形式で指定してください（YYYY-MM-DD）'
        });
      }

      if (startDate > endDate) {
        return res.status(400).json({
          success: false,
          message: '開始日は終了日より前である必要があります'
        });
      }

      const whereClause = {
        [Op.or]: [
          {
            start_date: { [Op.lte]: end_date },
            end_date: { [Op.gte]: start_date }
          }
        ]
      };

      // 特定のホストが指定されている場合
      if (host_id) {
        whereClause.host_id = host_id;
      }

      // 指定期間に滞在しているスケジュールを取得
      const schedules = await AcceptanceSchedule.findAll({
        where: whereClause,
        include: [
          {
            model: Host,
            attributes: ['id', 'first_name', 'last_name', 'address']
          },
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            required: false
          }
        ],
        order: [['start_date', 'ASC']]
      });

      // 日付別の滞在者数を集計
      const occupancyByDate = {};
      const hostOccupancy = {};

      schedules.forEach(schedule => {
        const hostId = schedule.host_id;
        const hostName = `${schedule.Host.first_name} ${schedule.Host.last_name}`;
        
        // ホスト別集計
        if (!hostOccupancy[hostId]) {
          hostOccupancy[hostId] = {
            host_id: hostId,
            host_name: hostName,
            address: schedule.Host.address,
            total_days: 0,
            schedules: []
          };
        }

        // 滞在期間の各日を処理
        const currentDate = new Date(schedule.start_date);
        const endDate = new Date(schedule.end_date);
        
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split('T')[0];
          
          if (dateStr >= start_date && dateStr <= end_date) {
            if (!occupancyByDate[dateStr]) {
              occupancyByDate[dateStr] = {
                date: dateStr,
                total_occupancy: 0,
                host_count: 0,
                hosts: {}
              };
            }

            if (!occupancyByDate[dateStr].hosts[hostId]) {
              occupancyByDate[dateStr].hosts[hostId] = {
                host_id: hostId,
                host_name: hostName,
                occupancy_count: 0
              };
              occupancyByDate[dateStr].host_count++;
            }

            occupancyByDate[dateStr].hosts[hostId].occupancy_count++;
            occupancyByDate[dateStr].total_occupancy++;
            hostOccupancy[hostId].total_days++;
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        hostOccupancy[hostId].schedules.push({
          id: schedule.id,
          start_date: schedule.start_date,
          end_date: schedule.end_date,
          is_rook: schedule.is_rook,
          student_name: schedule.Student ? `${schedule.Student.first_name} ${schedule.Student.last_name}` : null,
          gender: schedule.gender,
          nationality: schedule.nationality
        });
      });

      const result = {
        period: {
          start_date: start_date,
          end_date: end_date
        },
        daily_occupancy: Object.values(occupancyByDate).sort((a, b) => a.date.localeCompare(b.date)),
        host_summary: Object.values(hostOccupancy)
      };

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching occupancy by date range:', error);
      res.status(500).json({
        success: false,
        message: '滞在者数の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 滞在スケジュール作成
  static async createAcceptanceSchedule(req, res) {
    try {
      const {
        host_id,
        start_date,
        end_date,
        is_rook = true,
        is_extendable = false,
        student_id,
        gender,
        nationality
      } = req.body;

      // 必須フィールドのバリデーション
      if (!host_id || !start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: 'host_id、start_date、end_dateは必須です'
        });
      }

      // ホストが存在するかチェック
      const host = await Host.findByPk(host_id);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: '指定されたホストが見つかりません'
        });
      }

      // 学生が指定されている場合、学生が存在するかチェック
      if (student_id) {
        const student = await Student.findByPk(student_id);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: '指定された学生が見つかりません'
          });
        }
      }

      // スケジュールを作成
      const schedule = await AcceptanceSchedule.create({
        host_id,
        start_date,
        end_date,
        is_rook,
        is_extendable,
        student_id,
        gender,
        nationality
      });

      // 作成されたスケジュールを取得（関連データ含む）
      const createdSchedule = await AcceptanceSchedule.findByPk(schedule.id, {
        include: [
          {
            model: Host,
            attributes: ['id', 'first_name', 'last_name', 'address']
          },
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            required: false
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: '滞在スケジュールが正常に作成されました',
        data: createdSchedule
      });
    } catch (error) {
      console.error('Error creating acceptance schedule:', error);
      res.status(500).json({
        success: false,
        message: '滞在スケジュールの作成に失敗しました',
        error: error.message
      });
    }
  }

  // 滞在スケジュール更新
  static async updateAcceptanceSchedule(req, res) {
    try {
      const scheduleId = req.params.id;
      const updateData = req.body;

      // スケジュールが存在するかチェック
      const existingSchedule = await AcceptanceSchedule.findByPk(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({
          success: false,
          message: '指定された滞在スケジュールが見つかりません'
        });
      }

      // ホストが指定されている場合、ホストが存在するかチェック
      if (updateData.host_id) {
        const host = await Host.findByPk(updateData.host_id);
        if (!host) {
          return res.status(404).json({
            success: false,
            message: '指定されたホストが見つかりません'
          });
        }
      }

      // 学生が指定されている場合、学生が存在するかチェック
      if (updateData.student_id) {
        const student = await Student.findByPk(updateData.student_id);
        if (!student) {
          return res.status(404).json({
            success: false,
            message: '指定された学生が見つかりません'
          });
        }
      }

      // スケジュールを更新
      await existingSchedule.update(updateData);

      // 更新されたスケジュールを取得
      const updatedSchedule = await AcceptanceSchedule.findByPk(scheduleId, {
        include: [
          {
            model: Host,
            attributes: ['id', 'first_name', 'last_name', 'address']
          },
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            required: false
          }
        ]
      });

      res.json({
        success: true,
        message: '滞在スケジュールが正常に更新されました',
        data: updatedSchedule
      });
    } catch (error) {
      console.error('Error updating acceptance schedule:', error);
      res.status(500).json({
        success: false,
        message: '滞在スケジュールの更新に失敗しました',
        error: error.message
      });
    }
  }

  // 滞在スケジュール削除
  static async deleteAcceptanceSchedule(req, res) {
    try {
      const scheduleId = req.params.id;

      // スケジュールが存在するかチェック
      const schedule = await AcceptanceSchedule.findByPk(scheduleId);
      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '指定された滞在スケジュールが見つかりません'
        });
      }

      // スケジュールを削除
      await schedule.destroy();

      res.json({
        success: true,
        message: '滞在スケジュールが正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting acceptance schedule:', error);
      res.status(500).json({
        success: false,
        message: '滞在スケジュールの削除に失敗しました',
        error: error.message
      });
    }
  }

  // 滞在スケジュール一覧取得
  static async getAcceptanceSchedules(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        host_id,
        student_id,
        start_date,
        end_date,
        is_rook
      } = req.query;

      // 検索条件の構築
      const whereClause = {};
      const includeClause = [
        {
          model: Host,
          attributes: ['id', 'first_name', 'last_name', 'address']
        },
        {
          model: Student,
          attributes: ['id', 'first_name', 'last_name', 'gender'],
          required: false
        }
      ];

      // フィルター条件
      if (host_id) whereClause.host_id = host_id;
      if (student_id) whereClause.student_id = student_id;
      if (is_rook !== undefined) whereClause.is_rook = is_rook === 'true';

      // 日付範囲フィルター
      if (start_date || end_date) {
        if (start_date && end_date) {
          whereClause[Op.or] = [
            {
              start_date: { [Op.lte]: end_date },
              end_date: { [Op.gte]: start_date }
            }
          ];
        } else if (start_date) {
          whereClause.end_date = { [Op.gte]: start_date };
        } else if (end_date) {
          whereClause.start_date = { [Op.lte]: end_date };
        }
      }

      // ページネーション設定
      const offset = (page - 1) * limit;
      const limitNum = parseInt(limit);

      // データ取得
      const { count, rows: schedules } = await AcceptanceSchedule.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: [['start_date', 'ASC']],
        limit: limitNum,
        offset: offset
      });

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: schedules,
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
      console.error('Error fetching acceptance schedules:', error);
      res.status(500).json({
        success: false,
        message: '滞在スケジュールの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定の滞在スケジュール取得
  static async getAcceptanceScheduleById(req, res) {
    try {
      const scheduleId = req.params.id;
      const schedule = await AcceptanceSchedule.findByPk(scheduleId, {
        include: [
          {
            model: Host,
            attributes: ['id', 'first_name', 'last_name', 'address']
          },
          {
            model: Student,
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            required: false
          }
        ]
      });

      if (!schedule) {
        return res.status(404).json({
          success: false,
          message: '指定された滞在スケジュールが見つかりません'
        });
      }

      res.json({
        success: true,
        data: schedule
      });
    } catch (error) {
      console.error('Error fetching acceptance schedule:', error);
      res.status(500).json({
        success: false,
        message: '滞在スケジュールの取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = HostController; 