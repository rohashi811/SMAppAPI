const { Student, StudentDetail, School, Agency, Group } = require('../sequelize/models');
const { Op } = require('sequelize');

class StudentController {
  // 全学生一覧取得（検索・ページネーション対応）
  static async getAllStudents(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        school_id,
        agency_id,
        group_id,
        gender,
        arrival_date_from,
        arrival_date_to,
        leaving_date_from,
        leaving_date_to,
        sort_by = 'created_at',
        sort_order = 'DESC',
        sort = null
      } = req.query;

      // 検索条件の構築
      const whereClause = {};
      const includeClause = [
        {
          model: School,
          attributes: ['id', 'name', 'category']
        },
        {
          model: Agency,
          attributes: ['id', 'name']
        },
        {
          model: Group,
          attributes: ['id', 'name']
        },
        {
          model: StudentDetail,
          attributes: ['jp_name', 'date_of_birth', 'phone_number', 'email', 'flight_number', 'arrival_time', 'visa', 'allergies', 'smoke', 'pet', 'kid', 'meal', 'emergency_contact', 'emergency_contact_relation', 'emergency_phone', 'passport_number', 'note']
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
      if (school_id) whereClause.school_id = school_id;
      if (agency_id) whereClause.agency_id = agency_id;
      if (group_id) whereClause.group_id = group_id;
      if (gender) whereClause.gender = gender;

      // 日付範囲フィルター
      if (arrival_date_from || arrival_date_to) {
        whereClause.arrival_date = {};
        if (arrival_date_from) whereClause.arrival_date[Op.gte] = arrival_date_from;
        if (arrival_date_to) whereClause.arrival_date[Op.lte] = arrival_date_to;
      }

      if (leaving_date_from || leaving_date_to) {
        whereClause.leaving_date = {};
        if (leaving_date_from) whereClause.leaving_date[Op.gte] = leaving_date_from;
        if (leaving_date_to) whereClause.leaving_date[Op.lte] = leaving_date_to;
      }

      // ソート設定
      const allowedSortFields = ['id', 'first_name', 'last_name', 'arrival_date', 'leaving_date', 'duration', 'gender', 'created_at'];
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
      const { count, rows: students } = await Student.findAndCountAll({
        where: whereClause,
        include: includeClause,
        order: orderClause,
        limit: limitNum,
        offset: offset
      });

      // durationがnullの学生に対して計算を実行
      for (const student of students) {
        if (student.duration === null && student.arrival_date && student.leaving_date) {
          const calculatedDuration = Student.calculateDuration(student.arrival_date, student.leaving_date);
          if (calculatedDuration !== null) {
            await student.update({ duration: calculatedDuration });
            student.duration = calculatedDuration;
          }
        }
      }

      // ページネーション情報
      const totalPages = Math.ceil(count / limitNum);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: students,
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
      console.error('Error fetching students:', error);
      res.status(500).json({
        success: false,
        message: '学生データの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 特定の学生詳細取得
  static async getStudentById(req, res) {
    try {
      const studentId = req.params.id;
      const student = await Student.findByPk(studentId, {
        include: [
          {
            model: School,
            attributes: ['id', 'name', 'category']
          },
          {
            model: Agency,
            attributes: ['id', 'name']
          },
          {
            model: Group,
            attributes: ['id', 'name']
          },
          {
            model: StudentDetail,
            attributes: ['jp_name', 'date_of_birth', 'phone_number', 'email', 'flight_number', 'arrival_time', 'visa', 'allergies', 'smoke', 'pet', 'kid', 'meal', 'emergency_contact', 'emergency_contact_relation', 'emergency_phone', 'passport_number', 'note']
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: '指定された学生が見つかりません'
        });
      }

      // durationがnullの場合、計算して更新
      if (student.duration === null && student.arrival_date && student.leaving_date) {
        const calculatedDuration = Student.calculateDuration(student.arrival_date, student.leaving_date);
        if (calculatedDuration !== null) {
          await student.update({ duration: calculatedDuration });
          student.duration = calculatedDuration;
        }
      }

      res.json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        success: false,
        message: '学生データの取得に失敗しました',
        error: error.message
      });
    }
  }

  // 新規学生作成
  static async createStudent(req, res) {
    try {
      const {
        first_name,
        last_name,
        arrival_date,
        leaving_date,
        gender,
        school_id,
        agency_id,
        group_id,
        student_detail
      } = req.body;

      // 必須フィールドのバリデーション
      if (!first_name || !last_name || !arrival_date || !gender) {
        return res.status(400).json({
          success: false,
          message: '必須フィールドが不足しています'
        });
      }

      // 学生データを作成
      const student = await Student.create({
        first_name,
        last_name,
        arrival_date,
        leaving_date,
        gender,
        school_id,
        agency_id,
        group_id
      });

      // 学生詳細データがある場合は作成
      if (student_detail) {
        await StudentDetail.create({
          student_id: student.id,
          ...student_detail
        });
      }

      // 作成された学生データを取得（関連データ含む）
      const createdStudent = await Student.findByPk(student.id, {
        include: [
          {
            model: School,
            attributes: ['id', 'name', 'category']
          },
          {
            model: Agency,
            attributes: ['id', 'name']
          },
          {
            model: Group,
            attributes: ['id', 'name']
          },
          {
            model: StudentDetail,
            attributes: ['jp_name', 'date_of_birth', 'phone_number', 'email', 'flight_number', 'arrival_time', 'visa', 'allergies', 'smoke', 'pet', 'kid', 'meal', 'emergency_contact', 'emergency_contact_relation', 'emergency_phone', 'passport_number', 'note']
          }
        ]
      });

      res.status(201).json({
        success: true,
        message: '学生が正常に作成されました',
        data: createdStudent
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({
        success: false,
        message: '学生の作成に失敗しました',
        error: error.message
      });
    }
  }

  // 学生情報更新
  static async updateStudent(req, res) {
    try {
      const studentId = req.params.id;
      const {
        first_name,
        last_name,
        arrival_date,
        leaving_date,
        gender,
        school_id,
        agency_id,
        group_id,
        student_detail
      } = req.body;

      // 学生が存在するかチェック
      const existingStudent = await Student.findByPk(studentId);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: '指定された学生が見つかりません'
        });
      }

      // 学生データを更新
      await existingStudent.update({
        first_name,
        last_name,
        arrival_date,
        leaving_date,
        gender,
        school_id,
        agency_id,
        group_id
      });

      // 学生詳細データの更新
      if (student_detail) {
        const existingDetail = await StudentDetail.findByPk(studentId);
        if (existingDetail) {
          await existingDetail.update(student_detail);
        } else {
          await StudentDetail.create({
            student_id: studentId,
            ...student_detail
          });
        }
      }

      // 更新された学生データを取得
      const updatedStudent = await Student.findByPk(studentId, {
        include: [
          {
            model: School,
            attributes: ['id', 'name', 'category']
          },
          {
            model: Agency,
            attributes: ['id', 'name']
          },
          {
            model: Group,
            attributes: ['id', 'name']
          },
          {
            model: StudentDetail,
            attributes: ['jp_name', 'date_of_birth', 'phone_number', 'email', 'flight_number', 'arrival_time', 'visa', 'allergies', 'smoke', 'pet', 'kid', 'meal', 'emergency_contact', 'emergency_contact_relation', 'emergency_phone', 'passport_number', 'note']
          }
        ]
      });

      res.json({
        success: true,
        message: '学生情報が正常に更新されました',
        data: updatedStudent
      });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({
        success: false,
        message: '学生情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // 学生削除
  static async deleteStudent(req, res) {
    try {
      const studentId = req.params.id;

      // 学生が存在するかチェック
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: '指定された学生が見つかりません'
        });
      }

      // 学生詳細データも削除（CASCADE設定により自動削除）
      await student.destroy();

      res.json({
        success: true,
        message: '学生が正常に削除されました'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        success: false,
        message: '学生の削除に失敗しました',
        error: error.message
      });
    }
  }

  // 学生詳細情報のみ取得
  static async getStudentDetail(req, res) {
    try {
      const studentId = req.params.id;
      const studentDetail = await StudentDetail.findByPk(studentId);

      if (!studentDetail) {
        return res.status(404).json({
          success: false,
          message: '指定された学生の詳細情報が見つかりません'
        });
      }

      res.json({
        success: true,
        data: studentDetail
      });
    } catch (error) {
      console.error('Error fetching student detail:', error);
      res.status(500).json({
        success: false,
        message: '学生詳細情報の取得に失敗しました',
        error: error.message
      });
    }
  }

  // 学生詳細情報更新
  static async updateStudentDetail(req, res) {
    try {
      const studentId = req.params.id;
      const studentDetailData = req.body;

      // 学生が存在するかチェック
      const student = await Student.findByPk(studentId);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: '指定された学生が見つかりません'
        });
      }

      // 学生詳細データの更新または作成
      const [studentDetail, created] = await StudentDetail.findOrCreate({
        where: { student_id: studentId },
        defaults: studentDetailData
      });

      if (!created) {
        await studentDetail.update(studentDetailData);
      }

      res.json({
        success: true,
        message: '学生詳細情報が正常に更新されました',
        data: studentDetail
      });
    } catch (error) {
      console.error('Error updating student detail:', error);
      res.status(500).json({
        success: false,
        message: '学生詳細情報の更新に失敗しました',
        error: error.message
      });
    }
  }

  // 学生統計情報取得
  static async getStudentStats(req, res) {
    try {
      // 総学生数
      const totalStudents = await Student.count();

      // 性別別統計
      const genderStats = await Student.findAll({
        attributes: [
          'gender',
          [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'count']
        ],
        group: ['gender']
      });

      // 学校別統計
      const schoolStats = await Student.findAll({
        attributes: [
          'school_id',
          [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'count']
        ],
        include: [
          {
            model: School,
            attributes: ['name']
          }
        ],
        group: ['school_id', 'School.id'],
        where: {
          school_id: { [Op.ne]: null }
        }
      });

      // 今月の新規学生数
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const newStudentsThisMonth = await Student.count({
        where: {
          created_at: {
            [Op.gte]: firstDayOfMonth
          }
        }
      });

      // 滞在中の学生数（leaving_dateがnullまたは未来）
      const activeStudents = await Student.count({
        where: {
          [Op.or]: [
            { leaving_date: null },
            { leaving_date: { [Op.gt]: new Date().toISOString().split('T')[0] } }
          ]
        }
      });

      res.json({
        success: true,
        data: {
          totalStudents,
          genderStats,
          schoolStats,
          newStudentsThisMonth,
          activeStudents
        }
      });
    } catch (error) {
      console.error('Error fetching student stats:', error);
      res.status(500).json({
        success: false,
        message: '統計情報の取得に失敗しました',
        error: error.message
      });
    }
  }
}

module.exports = StudentController; 