const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentDetail extends Model {
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
  }
  }

  StudentDetail.init(
    {
      student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      jp_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      flight_number: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      arrival_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      visa: {
        type: DataTypes.ENUM('ETA', 'Student', 'WH'),
        allowNull: true,
      },
      allergies: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      smoke: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      pet: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      kid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      meal: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      emergency_contact: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      emergency_contact_relation: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      emergency_phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      passport_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'StudentDetail',
      tableName: 'Student_details',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // データ整合性チェックのフック
  StudentDetail.beforeCreate(async (studentDetail, options) => {
    // 生年月日の妥当性チェック
    if (studentDetail.date_of_birth) {
      if (studentDetail.date_of_birth > new Date().toISOString().split('T')[0]) {
        throw new Error('Date of birth cannot be in the future');
      }
      
      if (studentDetail.date_of_birth < '1900-01-01') {
        throw new Error('Date of birth is too far in the past');
      }
    }
    
    // 到着時刻の妥当性チェック
    if (studentDetail.arrival_time) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (studentDetail.arrival_time < oneYearAgo) {
        throw new Error('Arrival time cannot be more than 1 year in the past');
      }
    }
  });

  StudentDetail.beforeUpdate(async (studentDetail, options) => {
    // 生年月日の妥当性チェック
    if (studentDetail.date_of_birth) {
      if (studentDetail.date_of_birth > new Date().toISOString().split('T')[0]) {
        throw new Error('Date of birth cannot be in the future');
      }
      
      if (studentDetail.date_of_birth < '1900-01-01') {
        throw new Error('Date of birth is too far in the past');
      }
    }
    
    // 到着時刻の妥当性チェック
    if (studentDetail.arrival_time) {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (studentDetail.arrival_time < oneYearAgo) {
        throw new Error('Arrival time cannot be more than 1 year in the past');
      }
    }
  });

  return StudentDetail;
}