const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AcceptanceSchedule extends Model {
    static associate(models) {
      this.belongsTo(models.Student, { foreignKey: 'student_id' });
      this.belongsTo(models.Host, { foreignKey: 'host_id' });
    }
  }

  AcceptanceSchedule.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      host_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_rook: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_extendable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'AcceptanceSchedule',
      tableName: 'Acceptance_schedule',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // バリデーションとduration自動計算のフック
  AcceptanceSchedule.beforeCreate(async (schedule, options) => {
    // 日付妥当性チェック
    if (schedule.start_date >= schedule.end_date) {
      throw new Error('Start date must be before end date');
    }

    if (schedule.start_date < new Date().toISOString().split('T')[0]) {
      throw new Error('Start date cannot be in the past');
    }

    // スケジュール重複チェック（同じホストの重複期間）
    const overlapCount = await AcceptanceSchedule.count({
      where: {
        host_id: schedule.host_id,
        id: { [sequelize.Op.ne]: schedule.id || 0 },
        [sequelize.Op.or]: [
          {
            start_date: { [sequelize.Op.lte]: schedule.end_date },
            end_date: { [sequelize.Op.gte]: schedule.start_date }
          },
          {
            start_date: { [sequelize.Op.lte]: schedule.end_date },
            end_date: { [sequelize.Op.gte]: schedule.start_date }
          }
        ]
      }
    });

    if (overlapCount > 0) {
      throw new Error('Schedule overlap detected for this host');
    }

    // is_rook = TRUEの場合のデータ整合性チェック
    if (schedule.is_rook === true) {
      if (!schedule.student_id) {
        throw new Error('Student ID is required when is_rook is TRUE');
      }

      // 学生情報の自動取得
      const student = await sequelize.models.Student.findByPk(schedule.student_id);
      if (student && student.gender) {
        schedule.gender = student.gender;
      }

      schedule.nationality = 'Japan';
    }

    // duration自動計算
    if (schedule.end_date && schedule.start_date) {
      const start = new Date(schedule.start_date);
      const end = new Date(schedule.end_date);
      schedule.duration = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }
  });

  AcceptanceSchedule.beforeUpdate(async (schedule, options) => {
    // 日付妥当性チェック
    if (schedule.start_date >= schedule.end_date) {
      throw new Error('Start date must be before end date');
    }

    if (schedule.start_date < new Date().toISOString().split('T')[0]) {
      throw new Error('Start date cannot be in the past');
    }

    // スケジュール重複チェック（同じホストの重複期間、自分以外）
    const overlapCount = await AcceptanceSchedule.count({
      where: {
        host_id: schedule.host_id,
        id: { [sequelize.Op.ne]: schedule.id },
        [sequelize.Op.or]: [
          {
            start_date: { [sequelize.Op.lte]: schedule.end_date },
            end_date: { [sequelize.Op.gte]: schedule.start_date }
          },
          {
            start_date: { [sequelize.Op.lte]: schedule.end_date },
            end_date: { [sequelize.Op.gte]: schedule.start_date }
          }
        ]
      }
    });

    if (overlapCount > 0) {
      throw new Error('Schedule overlap detected for this host');
    }

    // is_rook = TRUEの場合のデータ整合性チェック
    if (schedule.is_rook === true) {
      if (!schedule.student_id) {
        throw new Error('Student ID is required when is_rook is TRUE');
      }

      // 学生情報の自動取得
      const student = await sequelize.models.Student.findByPk(schedule.student_id);
      if (student && student.gender) {
        schedule.gender = student.gender;
      }

      schedule.nationality = 'Japan';
    }

    // duration自動計算
    if (schedule.end_date && schedule.start_date) {
      const start = new Date(schedule.start_date);
      const end = new Date(schedule.end_date);
      schedule.duration = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    }
  });

  return AcceptanceSchedule;
};