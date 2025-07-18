const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
  static associate(models) {
    this.belongsTo(models.School, { foreignKey: 'school_id' });
    this.belongsTo(models.Agency, { foreignKey: 'agency_id' });
    this.hasOne(models.StudentDetail, { foreignKey: 'student_id' });
    this.hasOne(models.StudentHomestay, { foreignKey: "student_id" });
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
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(50),
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
      duration_of_stay: {
        type: DataTypes.VIRTUAL,
        get() {
          const arrival = this.getDataValue('arrival_date');
          const leaving = this.getDataValue('leaving_date');
          if(!leaving) return null;
          return Math.floor((new Date(leaving) - new Date(arrival)) / (1000 * 60 * 60 * 24));
        }
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },
      agency_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      school_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Student',
      tableName: 'Students',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
  return Student;
}