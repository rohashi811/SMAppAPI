const  { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agency extends Model {
  static associate(models) {
    Agency.hasMany(models.Student, { foreignKey: 'agency_id' });
    models.Student.belongsTo(Agency, { foreignKey: 'agency_id' });
  }
  }
  Agency.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Agency',
      tableName: 'Agencies',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Agency;
  };