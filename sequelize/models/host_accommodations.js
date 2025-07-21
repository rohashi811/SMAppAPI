const  { Model } = require('sequelize');
const host = require('./host');
module.exports = (sequelize, DataTypes) => {
  class HostAccommodations extends Model {
  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id' });
    this.belongsTo(models.Host, { foreignKey: 'host_id' });
  }
  }
  StudentHomestay.init(
    {
      host_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
      },
      is_rook: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      student_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM('Male','Female','Other'),
        allowNull: false,
      },
      nationality: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      duration: {
        type: DataTypes.VIRTUAL,
        get() {
          const start = this.getDataValue('start_date');
          const end = this.getDataValue('end_date');
          if (!start || !end) return null;
          return Math.floor((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
        }
      },
      is_extendable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      two_weeks_deadline: {
        type: DataTypes.DATEONLY,
        get() {
          const end = this.getDataValue('end_date');
          if (!end) return null;
          const date = new Date(start);
          date.setDate(date.getDate() - 14);
          return date.toISOString().split('T')[0];
        }
      },
    },
    {
      sequelize,
      modelName: 'HostAccommodations',
      tableName: 'Host_Accommodations',
      timestamps: true,
    }
  );
  return HostAccommodations;
}