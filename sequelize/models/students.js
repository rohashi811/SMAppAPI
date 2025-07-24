const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
  static associate(models) {
    this.belongsTo(models.School, { foreignKey: 'school_id' });
    this.belongsTo(models.Agency, { foreignKey: 'agency_id' });
    this.hasOne(models.StudentDetail, { foreignKey: 'student_id' });
    this.hasOne(models.AcceptanceSchedule, { foreignKey: "student_id" });
  }
  }

  Student.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      arrival_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      leaving_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      agency_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      school_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      group_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,  
      },   
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'Students',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // duration自動計算のフック
  Student.beforeCreate(async (student, options) => {
    if (student.leaving_date && student.arrival_date) {
      const arrival = new Date(student.arrival_date);
      const leaving = new Date(student.leaving_date);
      if (leaving > arrival) {
        student.duration = Math.floor((leaving - arrival) / (1000 * 60 * 60 * 24));
      }
    }
  });

  Student.beforeUpdate(async (student, options) => {
    // 日付フィールドが変更された場合のみdurationを再計算
    const previousValues = student._previousDataValues;
    const currentValues = student.dataValues;
    
    const arrivalChanged = previousValues && (previousValues.arrival_date !== currentValues.arrival_date);
    const leavingChanged = previousValues && (previousValues.leaving_date !== currentValues.leaving_date);
    
    if (arrivalChanged || leavingChanged || !previousValues) {
      if (student.leaving_date && student.arrival_date) {
        const arrival = new Date(student.arrival_date);
        const leaving = new Date(student.leaving_date);
        if (leaving > arrival) {
          student.duration = Math.floor((leaving - arrival) / (1000 * 60 * 60 * 24));
        } else {
          student.duration = null;
        }
      } else {
        student.duration = null;
      }
    }
  });

  // 既存データのdurationを計算するためのメソッド
  Student.calculateDuration = function(arrivalDate, leavingDate) {
    if (!arrivalDate || !leavingDate) return null;
    
    const arrival = new Date(arrivalDate);
    const leaving = new Date(leavingDate);
    
    if (leaving > arrival) {
      return Math.floor((leaving - arrival) / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  return Student;
}