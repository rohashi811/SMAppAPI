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
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      flight_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      arrival_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      visa: {
        type: DataTypes.ENUM('ETA','Student','WH'),
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
        type: DataTypes.INTEGER,
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
      tableName: 'Student_Details',
      timestamps: false,
    }
  );
  return StudentDetail;
}