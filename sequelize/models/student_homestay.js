const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentHomestay extends Model {
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Homestay, { foreignKey: 'homestay_id' });
  }
  }
  StudentHomestay.init(
    {
      student_id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true 
      },
      homestay_id: { 
          type: DataTypes.INTEGER.UNSIGNED, 
          primaryKey: true 
      },
      start_date: { 
          type: DataTypes.DATEONLY, 
          allowNull: false 
      },
      end_date: { 
          type: DataTypes.DATEONLY, 
          allowNull: false 
      },
      duration: {
        type: DataTypes.VIRTUAL,
        get() {
          const start = this.getDataValue('start_date');
          const end = this.getDataValue('end_date');
          return Math.floor((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
        }
      }
    },
    {
      sequelize,
      modelName: 'StudentHomestay',
      tableName: 'Student_Homestay',
      timestamps: false,
    }
  );
  return StudentHomestay;
}