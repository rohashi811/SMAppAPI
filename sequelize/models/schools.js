const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class School extends Model {
  static associate(models) {
    School.hasMany(models.Student, { foreignKey: 'school_id' });
  }
  }
  School.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      category: {
        type: DataTypes.ENUM('Language', 'Secondary', 'College', 'University', 'Graduate'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'School',
      tableName: 'Schools',
      timestamps: false,
    }
  );
  return School;
}